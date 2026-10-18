import "server-only";
import { randomUUID } from "node:crypto";
import { rows, run, transaction } from "./database";

export function mailConfigured() {
  return Boolean(
    (process.env.HOSTINGER_MAIL_TOKEN && process.env.HOSTINGER_MAILBOX_ID) ||
    (process.env.RESEND_API_KEY && process.env.DOCHENG_MAIL_FROM),
  );
}

export function queueMail(to: string, subject: string, text: string) {
  const id = randomUUID();
  run(
    "INSERT INTO mail_outbox (id,recipient,subject,body,created_at) VALUES (?,?,?,?,?)",
    id,
    to,
    subject,
    text,
    Date.now(),
  );
  return id;
}
/** Durable outbox; a provider acceptance is reported separately from ticket persistence. */
export async function deliverMail(id: string): Promise<boolean> {
  if (!mailConfigured()) return false;
  const mail = transaction(() => {
    const item = rows<{
      recipient: string;
      subject: string;
      body: string;
      status: string;
    }>("SELECT * FROM mail_outbox WHERE id=?", id)[0];
    if (!item || item.status !== "queued") return undefined;
    run(
      "UPDATE mail_outbox SET status='sending',attempts=attempts+1 WHERE id=?",
      id,
    );
    return item;
  });
  if (!mail)
    return (
      rows<{ status: string }>(
        "SELECT status FROM mail_outbox WHERE id=?",
        id,
      )[0]?.status === "sent"
    );
  try {
    if (process.env.HOSTINGER_MAIL_TOKEN && process.env.HOSTINGER_MAILBOX_ID) {
      const response = await fetch(
        "https://api.mail.hostinger.com/api/v1/mailboxes/" +
          encodeURIComponent(process.env.HOSTINGER_MAILBOX_ID) +
          "/send",
        {
          method: "POST",
          signal: AbortSignal.timeout(15_000),
          headers: {
            Authorization: "Bearer " + process.env.HOSTINGER_MAIL_TOKEN,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            to: [mail.recipient],
            displayName: "DoCHEng",
            subject: mail.subject,
            text: mail.body,
          }),
        },
      );
      if (response.status !== 204)
        throw new Error("Mail provider did not accept the message.");
      run(
        "UPDATE mail_outbox SET status='sent',sent_at=?,provider_id='hostinger' WHERE id=?",
        Date.now(),
        id,
      );
      return true;
    }
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      signal: AbortSignal.timeout(10_000),
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
        "Idempotency-Key": id,
      },
      body: JSON.stringify({
        from: process.env.DOCHENG_MAIL_FROM,
        to: [mail.recipient],
        subject: mail.subject,
        text: mail.body,
      }),
    });
    if (!response.ok)
      throw new Error("Mail provider did not accept the message.");
    const data = (await response.json()) as { id?: string };
    run(
      "UPDATE mail_outbox SET status='sent',sent_at=?,provider_id=? WHERE id=?",
      Date.now(),
      data.id ?? null,
      id,
    );
    return true;
  } catch {
    run("UPDATE mail_outbox SET status='queued' WHERE id=?", id);
    return false;
  }
}
export async function flushMail() {
  const pending = rows<{ id: string }>(
    "SELECT id FROM mail_outbox WHERE status='queued' AND attempts<10 ORDER BY created_at LIMIT 5",
  );
  const results = await Promise.all(
    pending.map((mail) => deliverMail(mail.id)),
  );
  const sent = results.filter(Boolean).length;
  return { queued: pending.length, sent };
}
