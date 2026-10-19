// Test-only fixture. The database path is fixed to the local Playwright store.
// A separate plain Node process avoids Playwright's loader hook for node:sqlite.
import { DatabaseSync } from "node:sqlite";
import { createHash, randomBytes, randomUUID } from "node:crypto";
import { resolve } from "node:path";
const db = new DatabaseSync(resolve("../.e2e-data/platform.sqlite"));
const id = randomUUID(),
  token = randomBytes(32).toString("base64url");
db.prepare(
  "INSERT INTO users (id,email,name,password_hash,role,verified,created_at) VALUES (?,?,?,?,'admin',1,?)",
).run(id, id + "@example.test", "Editor QA", "unused-test-fixture", Date.now());
db.prepare("INSERT INTO sessions VALUES (?,?,?,?)").run(
  createHash("sha256").update(token).digest("hex"),
  id,
  Date.now(),
  Date.now() + 3600000,
);
let ticket;
if (process.argv.includes("--overview")) {
  ticket = "DCH-2026-" + randomBytes(6).toString("hex").toUpperCase();
  db.prepare(
    "INSERT INTO tickets (id,user_id,email,name,enquiry_type,product,message,organization,context,created_at) VALUES (?,?,?,?,?,?,?,?,?,?)",
  ).run(
    ticket,
    id,
    id + "@example.test",
    "Dashboard QA",
    "technical",
    "desk",
    "Local admin overview support fixture; no external assistance required.",
    "",
    "",
    Date.now(),
  );
  db.prepare(
    "INSERT INTO mail_outbox (id,recipient,subject,body,created_at) VALUES (?,?,?,?,?)",
  ).run(
    randomUUID(),
    id + "@example.test",
    "Local overview fixture",
    "Local test only. Do not send.",
    Date.now(),
  );
  db.prepare("INSERT INTO audit_log VALUES (?,?,?,?,?,?)").run(
    randomUUID(),
    id,
    "account.created",
    id,
    "Local browser fixture",
    Date.now(),
  );
}
db.close();
process.stdout.write(JSON.stringify({ token, ticket }));
