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
let customer, batch, licence;
if (process.argv.includes("--customers")) {
  batch = randomBytes(5).toString("hex");
  customer = {
    id: randomUUID(),
    name: "Profile " + batch,
    email: "directory-" + batch + "-profile@example.test",
  };
  const insert = db.prepare(
    "INSERT INTO users (id,email,name,password_hash,verified,disabled,created_at) VALUES (?,?,?,?,?,?,?)",
  );
  db.exec("BEGIN IMMEDIATE");
  try {
    for (let i = 0; i < 110; i++)
      insert.run(
        randomUUID(),
        "directory-" + batch + "-" + i + "@example.test",
        "Directory " + batch + " " + i,
        "unused-test-fixture",
        i % 2,
        i % 3 === 0 ? 1 : 0,
        Date.now() + i,
      );
    insert.run(
      customer.id,
      customer.email,
      customer.name,
      "unused-test-fixture",
      1,
      0,
      Date.now() - 14 * 86400000,
    );
    const order = randomUUID();
    licence = randomUUID();
    db.prepare("INSERT INTO orders VALUES (?,?,?,?,?,?,?,?,?,?)").run(
      order,
      customer.id,
      randomUUID(),
      "desk",
      100,
      "ZAR",
      "paid",
      "test",
      Date.now(),
      Date.now(),
    );
    db.prepare("INSERT INTO licences VALUES (?,?,?,?,?,?,?,?,?)").run(
      licence,
      order,
      customer.id,
      "desk",
      randomUUID(),
      "TEST",
      2,
      null,
      0,
    );
    db.prepare("INSERT INTO entitlements VALUES (?,?,?,?,?,?)").run(
      randomUUID(),
      customer.id,
      "desk",
      "trial",
      "manual",
      Date.now() + 86400000,
    );
    ticket = "DCH-2026-" + randomBytes(6).toString("hex").toUpperCase();
    db.prepare("INSERT INTO tickets VALUES (?,?,?,?,?,?,?,?,?,?,?)").run(
      ticket,
      customer.id,
      customer.email,
      customer.name,
      "technical",
      "desk",
      "Local customer profile support enquiry.",
      "",
      "",
      "open",
      Date.now(),
    );
    db.prepare("INSERT INTO ticket_messages VALUES (?,?,?,?,?)").run(
      randomUUID(),
      ticket,
      id,
      "Local recorded support reply.",
      Date.now(),
    );
    db.prepare("INSERT INTO audit_log VALUES (?,?,?,?,?,?)").run(
      randomUUID(),
      customer.id,
      "account.created",
      customer.id,
      "",
      Date.now(),
    );
    db.exec("COMMIT");
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }
}
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
process.stdout.write(
  JSON.stringify({ token, ticket, customer, batch, licence, adminId: id }),
);
