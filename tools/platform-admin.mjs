// Run only on the hosting account. No HTTP bootstrap endpoint exists.
import { DatabaseSync } from "node:sqlite";
import { homedir } from "node:os";
import { join, isAbsolute } from "node:path";
import { existsSync, chmodSync } from "node:fs";
import { randomUUID } from "node:crypto";

const directory =
  process.env.DOCHENG_DATA_DIR ??
  join(homedir(), ".local", "share", "docheng-platform");
if (!isAbsolute(directory) || !existsSync(join(directory, "platform.sqlite")))
  throw new Error("An initialized persistent platform database is required.");
const database = new DatabaseSync(join(directory, "platform.sqlite"));
const [action, value] = process.argv.slice(2);
if (action === "backup") {
  const output =
    value ??
    join(
      directory,
      "platform-backup-" +
        new Date().toISOString().replaceAll(":", "-") +
        ".sqlite",
    );
  if (!isAbsolute(output) || existsSync(output))
    throw new Error(
      "Choose a new absolute backup filename outside the web root.",
    );
  database.prepare("VACUUM INTO ?").run(output);
  chmodSync(output, 0o600);
  console.log(
    "Consistent database backup created. Include the media and releases directories in the same backup policy.",
  );
} else if (action === "grant-admin") {
  if (!value || !/^\S+@\S+\.\S+$/.test(value))
    throw new Error("Provide the explicitly authorized administrator email.");
  const user = database
    .prepare("SELECT id,verified,disabled FROM users WHERE email=?")
    .get(value.toLowerCase());
  if (!user || !user.verified || user.disabled)
    throw new Error(
      "Create the account and verify mailbox ownership first. This tool does not bypass verification.",
    );
  database.exec("BEGIN IMMEDIATE");
  try {
    database.prepare("UPDATE users SET role='admin' WHERE id=?").run(user.id);
    database
      .prepare("INSERT INTO audit_log VALUES (?,?,?,?,?,?)")
      .run(
        randomUUID(),
        "hosting-operator",
        "admin.granted",
        user.id,
        "Explicit owner instruction; server CLI",
        Date.now(),
      );
    database.exec("COMMIT");
    console.log(
      "Administrator role granted. Existing sessions revalidate their role on the next request.",
    );
  } catch (error) {
    database.exec("ROLLBACK");
    throw error;
  }
} else
  throw new Error(
    "Use: node tools/platform-admin.mjs grant-admin EMAIL | backup [ABSOLUTE_PATH]",
  );
database.close();
