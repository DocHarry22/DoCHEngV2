import "server-only";
import type { SQLInputValue } from "node:sqlite";
import type { AdminRow } from "@/lib/admin";
import type {
  Customer,
  CustomerEntitlement,
  CustomerLicence,
  CustomerPage,
  CustomerTicket,
} from "@/lib/customers";
import { rows } from "./database";
import { HttpError } from "./security";

const customerColumns = "id,email,name,role,verified,disabled,created_at";
function pageNumber(params: URLSearchParams, key: string) {
  const raw = params.get(key) ?? "1";
  if (!/^[1-9]\d{0,5}$/.test(raw))
    throw new HttpError(400, "Choose a valid page.");
  return Number(raw);
}
function page<T>(
  params: URLSearchParams,
  key: string,
  size: number,
  table: string,
  where: string,
  values: SQLInputValue[],
  select: string,
  order: string,
): CustomerPage<T> {
  const requested = pageNumber(params, key);
  const total = rows<{ total: number }>(
    `SELECT COUNT(*) AS total FROM ${table} WHERE ${where}`,
    ...values,
  )[0].total;
  const pages = Math.max(1, Math.ceil(total / size));
  const current = Math.min(requested, pages);
  return {
    total,
    page: current,
    pageSize: size,
    pages,
    items: rows<T>(
      `SELECT ${select} FROM ${table} WHERE ${where} ORDER BY ${order} LIMIT ? OFFSET ?`,
      ...values,
      size,
      (current - 1) * size,
    ),
  };
}
export function customerDirectory(params: URLSearchParams) {
  const query = (params.get("q") ?? "").trim();
  const verified = params.get("verification") ?? "all";
  const state = params.get("state") ?? "all";
  if (
    query.length > 254 ||
    !["all", "verified", "unverified"].includes(verified) ||
    !["all", "enabled", "disabled"].includes(state)
  )
    throw new HttpError(400, "Check the customer search filters.");
  const conditions = ["1=1"],
    values: SQLInputValue[] = [];
  if (query) {
    // instr treats %, _ and quotes literally rather than expanding SQL patterns.
    conditions.push(
      "(instr(lower(name),lower(?))>0 OR instr(lower(email),lower(?))>0)",
    );
    values.push(query, query);
  }
  if (verified !== "all") {
    conditions.push("verified=?");
    values.push(verified === "verified" ? 1 : 0);
  }
  if (state !== "all") {
    conditions.push("disabled=?");
    values.push(state === "disabled" ? 1 : 0);
  }
  return page<Customer>(
    params,
    "page",
    25,
    "users",
    conditions.join(" AND "),
    values,
    customerColumns,
    "created_at DESC,id DESC",
  );
}
export function customerProfile(
  id: string,
  params: URLSearchParams,
  currentUserId: string,
) {
  if (
    !/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(id)
  )
    throw new HttpError(400, "Invalid customer identifier.");
  const customer = rows<Customer>(
    `SELECT ${customerColumns} FROM users WHERE id=?`,
    id,
  )[0];
  if (!customer) throw new HttpError(404, "Customer not found.");
  const licences = page<Omit<CustomerLicence, "products">>(
    params,
    "licencePage",
    10,
    "licences l",
    "l.user_id=?",
    [id],
    "l.id,l.product_slug,l.key_hint,l.device_limit,l.expires_at,l.revoked,(SELECT COUNT(*) FROM devices d WHERE d.licence_id=l.id) AS devices",
    "l.rowid DESC",
  );
  const tickets = page<Omit<CustomerTicket, "replies">>(
    params,
    "ticketPage",
    10,
    "tickets",
    "user_id=?",
    [id],
    "id,enquiry_type,product,message,status,created_at",
    "created_at DESC,id DESC",
  );
  const activity = page<AdminRow>(
    params,
    "activityPage",
    20,
    "audit_log a LEFT JOIN users u ON u.id=a.actor_id",
    "(a.actor_id=? OR a.resource=? OR a.resource IN (SELECT id FROM licences WHERE user_id=?) OR a.resource IN (SELECT id FROM tickets WHERE user_id=?))",
    [id, id, id, id],
    "a.id,a.action,a.resource,a.detail,a.created_at,u.name AS actor_name",
    "a.created_at DESC,a.id DESC",
  );
  return {
    asOf: Date.now(),
    customer,
    currentUserId,
    entitlements: rows<CustomerEntitlement>(
      "SELECT product_slug,state,source,expires_at FROM entitlements WHERE user_id=? ORDER BY product_slug",
      id,
    ),
    licences: {
      ...licences,
      items: licences.items.map((licence) => ({
        ...licence,
        products: rows<{ product_slug: string }>(
          "SELECT product_slug FROM licence_products WHERE licence_id=? ORDER BY product_slug",
          licence.id,
        ).map((p) => p.product_slug),
      })),
    },
    tickets: {
      ...tickets,
      items: tickets.items.map((ticket) => ({
        ...ticket,
        replies: rows<CustomerTicket["replies"][number]>(
          "SELECT m.id,m.message,m.created_at,u.name AS author_name FROM ticket_messages m JOIN users u ON u.id=m.author_id WHERE m.ticket_id=? ORDER BY m.created_at,m.id",
          ticket.id,
        ),
      })),
    },
    activity,
  };
}
