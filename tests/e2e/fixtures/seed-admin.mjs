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
db.close();
process.stdout.write(JSON.stringify({ token }));
