import { randomUUID } from "node:crypto";
import { requireUser } from "@/lib/server/auth";
import { rows, run, transaction } from "@/lib/server/database";
import { flushMail, queueMail } from "@/lib/server/mail";
import { baseCatalogue } from "@/lib/catalogue";
import { candidateProducts } from "@/lib/server/candidates";
import { validateProduct } from "@/lib/server/catalogue";
import { probeUrl } from "@/lib/server/probe-url";
import { adminOverview } from "@/lib/server/admin-overview";
import type { AdminData } from "@/lib/admin";
import {
  assertSameOrigin,
  jsonBody,
  apiResponse,
  apiError,
  HttpError,
  field,
  audit,
  rateLimit,
} from "@/lib/server/security";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function GET() {
  try {
    await requireUser(true);
    const drafts = rows<AdminData["drafts"][number]>(
      "SELECT * FROM product_drafts",
    );
    return apiResponse({
      ...adminOverview(drafts),
      products: [
        ...baseCatalogue,
        ...candidateProducts.filter(
          (p) => !baseCatalogue.some((b) => b.slug === p.slug),
        ),
      ],
      drafts,
      tickets: rows(
        "SELECT * FROM tickets ORDER BY CASE WHEN status IN ('open','in-progress') THEN 0 ELSE 1 END,created_at DESC LIMIT 100",
      ),
      users: rows(
        "SELECT id,email,name,role,verified,disabled FROM users ORDER BY created_at DESC LIMIT 100",
      ),
      audit: rows(
        "SELECT a.*,u.name AS actor_name FROM audit_log a LEFT JOIN users u ON u.id=a.actor_id ORDER BY a.created_at DESC LIMIT 100",
      ),
      mail: rows(
        "SELECT id,status,attempts,created_at FROM mail_outbox ORDER BY CASE WHEN status IN ('queued','sending') THEN 0 ELSE 1 END,created_at DESC LIMIT 100",
      ),
      metrics: rows(
        "SELECT day,path,campaign,views FROM metrics_daily ORDER BY day DESC,views DESC LIMIT 100",
      ),
      licences: rows(
        "SELECT id,product_slug,key_hint,revoked,expires_at FROM licences ORDER BY rowid DESC LIMIT 100",
      ),
      repositories: rows(
        "SELECT slug,repository,visibility FROM product_repositories",
      ),
    });
  } catch (error) {
    return apiError(error);
  }
}
export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    const session = await requireUser(true);
    const user = session.user!;
    if (!user.emailVerified)
      throw new HttpError(403, "Verify your administrator email first.");
    rateLimit("admin", user.id, 100);
    const body = await jsonBody(request);
    if (body.action === "repository") {
      const slug = field(body, "slug", 2, 80),
        repository = field(body, "repository", 3, 200);
      if (
        !/^[a-z0-9-]{2,80}$/.test(slug) ||
        !/^[-a-z0-9_.]+\/[-a-z0-9_.]+$/i.test(repository) ||
        (!baseCatalogue.some((p) => p.slug === slug) &&
          !rows("SELECT slug FROM product_drafts WHERE slug=?", slug).length)
      )
        throw new HttpError(
          400,
          "Choose a product draft and a valid repository owner/name.",
        );
      run(
        "INSERT INTO product_repositories VALUES (?,?,?,?,?) ON CONFLICT(slug) DO UPDATE SET repository=excluded.repository,visibility=excluded.visibility,updated_by=excluded.updated_by,updated_at=excluded.updated_at",
        slug,
        repository,
        body.private === false ? "public" : "private",
        user.id,
        Date.now(),
      );
      audit(user.id, "product.repository-changed", slug);
      return apiResponse({
        ok: true,
        message:
          "Administrative repository reference saved. It is excluded from public metadata.",
      });
    }
    if (body.action === "user-state") {
      const target = field(body, "userId", 36, 36);
      if (typeof body.disabled !== "boolean" || target === user.id)
        throw new HttpError(400, "Choose another account and a valid state.");
      const account = rows<{ role: string }>(
        "SELECT role FROM users WHERE id=?",
        target,
      )[0];
      if (!account) throw new HttpError(404, "Account not found.");
      transaction(() => {
        if (
          body.disabled === true &&
          account.role === "admin" &&
          rows("SELECT id FROM users WHERE role='admin' AND disabled=0")
            .length <= 1
        )
          throw new HttpError(
            400,
            "The last enabled administrator cannot be disabled.",
          );
        run(
          "UPDATE users SET disabled=? WHERE id=?",
          body.disabled === true ? 1 : 0,
          target,
        );
        if (body.disabled) run("DELETE FROM sessions WHERE user_id=?", target);
        audit(user.id, "user.state-changed", target, String(body.disabled));
      });
      return apiResponse({ ok: true, message: "Account state updated." });
    }
    if (body.action === "revoke-licence") {
      const id = field(body, "licenceId", 36, 36);
      const licence = rows<{ user_id: string; product_slug: string }>(
        "SELECT user_id,product_slug FROM licences WHERE id=?",
        id,
      )[0];
      if (!licence) throw new HttpError(404, "Licence not found.");
      transaction(() => {
        run("UPDATE licences SET revoked=1 WHERE id=?", id);
        run("DELETE FROM devices WHERE licence_id=?", id);
        const products = rows<{ product_slug: string }>(
          "SELECT product_slug FROM licence_products WHERE licence_id=?",
          id,
        );
        for (const product of products.length
          ? products
          : [{ product_slug: licence.product_slug }]) {
          if (
            !rows(
              "SELECT l.id FROM licences l LEFT JOIN licence_products p ON p.licence_id=l.id WHERE l.user_id=? AND (p.product_slug=? OR l.product_slug=?) AND l.revoked=0 AND (l.expires_at IS NULL OR l.expires_at>?)",
              licence.user_id,
              product.product_slug,
              product.product_slug,
              Date.now(),
            ).length
          )
            run(
              "DELETE FROM entitlements WHERE user_id=? AND product_slug=? AND source='plan'",
              licence.user_id,
              product.product_slug,
            );
        }
        audit(user.id, "licence.revoked", id);
      });
      return apiResponse({
        ok: true,
        message: "Licence revoked. Provider billing has not been changed.",
      });
    }
    if (body.action === "flush-mail")
      return apiResponse({ ok: true, ...(await flushMail()) });
    if (body.action === "reply") {
      const ticket = field(body, "ticket", 5, 100),
        message = field(body, "message", 10, 8000);
      const target = rows<{ email: string }>(
        "SELECT email FROM tickets WHERE id=?",
        ticket,
      )[0];
      if (!target) throw new HttpError(404, "Ticket not found.");
      transaction(() => {
        run(
          "INSERT INTO ticket_messages VALUES (?,?,?,?,?)",
          randomUUID(),
          ticket,
          user.id,
          message,
          Date.now(),
        );
        run(
          "UPDATE tickets SET status=? WHERE id=?",
          body.close === true ? "closed" : "in-progress",
          ticket,
        );
        queueMail(target.email, ticket + ": DoCHEng support reply", message);
        audit(user.id, "support.replied", ticket);
      });
      return apiResponse({
        ok: true,
        message: "Reply saved in the ticket and queued for email delivery.",
      });
    }
    if (body.action === "entitlement") {
      const userId = field(body, "userId", 36, 36),
        slug = field(body, "slug", 2, 80);
      const state = field(body, "state", 4, 10);
      if (
        !["none", "trial", "active"].includes(state) ||
        ![...baseCatalogue, ...candidateProducts].some(
          (p) => p.slug === slug,
        ) ||
        !rows("SELECT id FROM users WHERE id=?", userId).length
      )
        throw new HttpError(400, "Invalid entitlement.");
      const expires = body.expiresAt
        ? Date.parse(String(body.expiresAt))
        : null;
      if (
        expires !== null &&
        (!Number.isFinite(expires) || expires <= Date.now())
      )
        throw new HttpError(400, "Choose a future expiry.");
      transaction(() => {
        run(
          "DELETE FROM entitlements WHERE user_id=? AND product_slug=?",
          userId,
          slug,
        );
        run(
          "INSERT INTO entitlements VALUES (?,?,?,?,?,?)",
          randomUUID(),
          userId,
          slug,
          state,
          "manual",
          expires,
        );
        audit(user.id, "entitlement.changed", userId, slug + ":" + state);
      });
      return apiResponse({ ok: true, message: "Entitlement updated." });
    }
    if (body.action === "verify-link") {
      const slug = field(body, "slug", 2, 80);
      const draft = rows<{ document: string; revision: number }>(
        "SELECT document,revision FROM product_drafts WHERE slug=?",
        slug,
      )[0];
      if (!draft) throw new HttpError(400, "Save the draft first.");
      if (body.revision !== draft.revision)
        throw new HttpError(
          409,
          "This draft changed. Reload before verifying its launch URL.",
        );
      const evidence = await probeUrl(field(body, "url", 10, 2000));
      const product = validateProduct(JSON.parse(draft.document));
      product.launch = evidence;
      transaction(() => {
        const current = rows<{ revision: number }>(
          "SELECT revision FROM product_drafts WHERE slug=?",
          slug,
        )[0];
        if (current?.revision !== draft.revision)
          throw new HttpError(
            409,
            "This draft changed during verification. Reload and try again.",
          );
        run(
          "UPDATE product_drafts SET document=?,revision=revision+1,approved_at=NULL,approved_by=NULL,updated_at=? WHERE slug=?",
          JSON.stringify(product),
          Date.now(),
          slug,
        );
        audit(user.id, "product.link-verified", slug, evidence.url);
      });
      return apiResponse({
        ok: true,
        message:
          "Entry page verified. Review the application identity and workflows before publishing.",
        product,
        revision: draft.revision + 1,
      });
    }
    const product = validateProduct(body.product);
    const current = rows<{ document: string; revision: number }>(
      "SELECT * FROM product_drafts WHERE slug=?",
      product.slug,
    )[0];
    // Client payloads cannot manufacture verification or replace a checked release manifest.
    const trusted = current
      ? validateProduct(JSON.parse(current.document))
      : baseCatalogue.find((p) => p.slug === product.slug);
    product.launch = trusted?.launch;
    product.releases = trusted?.releases ?? [];
    if (body.action === "publish" && body.approvePublication !== true)
      throw new HttpError(400, "Explicit publication approval is required.");
    if (body.action === "publish" && product.visibility !== "public")
      throw new HttpError(
        400,
        "Internal drafts cannot be publicly published. Change visibility only after owner approval.",
      );
    if (!["save-product", "publish", "unpublish"].includes(String(body.action)))
      throw new HttpError(400, "Unknown administrator action.");
    if (
      body.action === "publish" &&
      (product.status === "live" || product.status === "beta") &&
      !product.launch
    )
      throw new HttpError(
        400,
        "Verify the public launch address before publishing an active product.",
      );
    transaction(() => {
      if (current && body.revision !== current.revision)
        throw new HttpError(409, "This draft changed. Reload before saving.");
      const approved = body.action === "publish" ? Date.now() : null;
      if (current)
        run(
          "UPDATE product_drafts SET document=?,revision=revision+1,updated_by=?,approved_by=?,approved_at=?,updated_at=? WHERE slug=?",
          JSON.stringify(product),
          user.id,
          approved ? user.id : null,
          approved,
          Date.now(),
          product.slug,
        );
      else
        run(
          "INSERT INTO product_drafts VALUES (?,?,?,?,?,?,?)",
          product.slug,
          JSON.stringify(product),
          1,
          user.id,
          approved ? user.id : null,
          approved,
          Date.now(),
        );
      if (body.action === "publish" || body.action === "unpublish") {
        run(
          "INSERT INTO published_products VALUES (?,?,?,?) ON CONFLICT(slug) DO UPDATE SET document=excluded.document,published_by=excluded.published_by,published_at=excluded.published_at",
          product.slug,
          body.action === "publish"
            ? JSON.stringify(product)
            : JSON.stringify({ withdrawn: true }),
          user.id,
          Date.now(),
        );
      }
      audit(user.id, "product." + String(body.action), product.slug);
    });
    return apiResponse({
      ok: true,
      product,
      revision: (current?.revision ?? 0) + 1,
      message:
        body.action === "publish"
          ? "Product publication approved."
          : body.action === "unpublish"
            ? "Product publication withdrawn. Your draft has been kept."
            : "Draft saved; publication requires explicit approval.",
    });
  } catch (error) {
    return apiError(error);
  }
}
