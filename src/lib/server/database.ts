import "server-only";
import { DatabaseSync, type SQLInputValue } from "node:sqlite";
import { mkdirSync, chmodSync } from "node:fs";
import { homedir } from "node:os";
import { isAbsolute, join, resolve, relative } from "node:path";

let connection: DatabaseSync | undefined;

export function dataDirectory() {
  const configured = process.env.DOCHENG_DATA_DIR;
  const directory =
    configured ??
    (process.env.NODE_ENV === "production"
      ? join(homedir(), ".local", "share", "docheng-platform")
      : join(process.cwd(), ".data"));
  if (!isAbsolute(directory))
    throw new Error("Persistent storage must be absolute.");
  const relation = relative(resolve(process.cwd()), resolve(directory));
  if (
    process.env.NODE_ENV === "production" &&
    !relation.startsWith("..") &&
    !isAbsolute(relation)
  )
    throw new Error("Storage must be outside the deployment directory.");
  return directory;
}

/** Single-instance store, outside the replaceable deployment tree in production. */
export function database() {
  if (connection) return connection;
  const directory = dataDirectory();
  mkdirSync(directory, { recursive: true, mode: 0o700 });
  connection = new DatabaseSync(join(directory, "platform.sqlite"));
  chmodSync(join(directory, "platform.sqlite"), 0o600);
  connection.exec(
    "PRAGMA journal_mode=WAL; PRAGMA foreign_keys=ON; PRAGMA busy_timeout=5000;",
  );
  connection.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY, email TEXT NOT NULL UNIQUE, name TEXT NOT NULL,
      password_hash TEXT NOT NULL, role TEXT NOT NULL DEFAULT 'user' CHECK(role IN ('user','admin')),
      verified INTEGER NOT NULL DEFAULT 0, disabled INTEGER NOT NULL DEFAULT 0, created_at INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS sessions (
      token_hash TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      created_at INTEGER NOT NULL, expires_at INTEGER NOT NULL
    );
    CREATE INDEX IF NOT EXISTS session_owner ON sessions(user_id);
    CREATE TABLE IF NOT EXISTS auth_tokens (
      token_hash TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      purpose TEXT NOT NULL, expires_at INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS entitlements (
      id TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      product_slug TEXT NOT NULL, state TEXT NOT NULL, source TEXT NOT NULL, expires_at INTEGER,
      UNIQUE(user_id, product_slug)
    );
    CREATE TABLE IF NOT EXISTS tickets (
      id TEXT PRIMARY KEY, user_id TEXT REFERENCES users(id) ON DELETE SET NULL, email TEXT NOT NULL,
      name TEXT NOT NULL, enquiry_type TEXT NOT NULL, product TEXT NOT NULL, message TEXT NOT NULL,
      organization TEXT NOT NULL, context TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'open', created_at INTEGER NOT NULL
    );
    CREATE INDEX IF NOT EXISTS ticket_owner ON tickets(user_id);
    CREATE TABLE IF NOT EXISTS ticket_messages (
      id TEXT PRIMARY KEY, ticket_id TEXT NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
      author_id TEXT NOT NULL REFERENCES users(id), message TEXT NOT NULL, created_at INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS mail_outbox (
      id TEXT PRIMARY KEY, recipient TEXT NOT NULL, subject TEXT NOT NULL, body TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'queued', attempts INTEGER NOT NULL DEFAULT 0,
      created_at INTEGER NOT NULL, sent_at INTEGER, provider_id TEXT
    );
    CREATE TABLE IF NOT EXISTS rate_limits (key TEXT PRIMARY KEY, hits INTEGER NOT NULL, expires_at INTEGER NOT NULL);
    CREATE TABLE IF NOT EXISTS metrics_daily (day TEXT NOT NULL,path TEXT NOT NULL,campaign TEXT NOT NULL,views INTEGER NOT NULL,PRIMARY KEY(day,path,campaign));
    CREATE TABLE IF NOT EXISTS audit_log (
      id TEXT PRIMARY KEY, actor_id TEXT NOT NULL, action TEXT NOT NULL, resource TEXT NOT NULL,
      detail TEXT NOT NULL, created_at INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS product_drafts (
      slug TEXT PRIMARY KEY, document TEXT NOT NULL, revision INTEGER NOT NULL, updated_by TEXT NOT NULL,
      approved_by TEXT, approved_at INTEGER, updated_at INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS subscriptions (
      id TEXT PRIMARY KEY, email TEXT NOT NULL, topic TEXT NOT NULL, confirmed INTEGER NOT NULL DEFAULT 0,
      token_hash TEXT NOT NULL UNIQUE, created_at INTEGER NOT NULL, UNIQUE(email,topic)
    );
    CREATE TABLE IF NOT EXISTS published_products (
      slug TEXT PRIMARY KEY, document TEXT NOT NULL, published_by TEXT NOT NULL, published_at INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS product_repositories (slug TEXT PRIMARY KEY,repository TEXT NOT NULL,visibility TEXT NOT NULL,updated_by TEXT NOT NULL,updated_at INTEGER NOT NULL);
    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id), reference TEXT NOT NULL UNIQUE,
      product_slug TEXT NOT NULL, amount INTEGER NOT NULL, currency TEXT NOT NULL DEFAULT 'ZAR',
      status TEXT NOT NULL, provider TEXT NOT NULL, created_at INTEGER NOT NULL, paid_at INTEGER
    );
    CREATE TABLE IF NOT EXISTS payment_events (id TEXT PRIMARY KEY, received_at INTEGER NOT NULL);
    CREATE TABLE IF NOT EXISTS checkout_batches (reference TEXT PRIMARY KEY,user_id TEXT NOT NULL REFERENCES users(id),amount INTEGER NOT NULL,currency TEXT NOT NULL,status TEXT NOT NULL,created_at INTEGER NOT NULL);
    CREATE TABLE IF NOT EXISTS checkout_orders (reference TEXT NOT NULL REFERENCES checkout_batches(reference),order_id TEXT NOT NULL UNIQUE REFERENCES orders(id) ON DELETE CASCADE,offer_document TEXT NOT NULL,PRIMARY KEY(reference,order_id));
    CREATE TABLE IF NOT EXISTS licences (
      id TEXT PRIMARY KEY, order_id TEXT NOT NULL UNIQUE REFERENCES orders(id), user_id TEXT NOT NULL REFERENCES users(id),
      product_slug TEXT NOT NULL, key_hash TEXT NOT NULL UNIQUE, key_hint TEXT NOT NULL,
      device_limit INTEGER NOT NULL, expires_at INTEGER, revoked INTEGER NOT NULL DEFAULT 0
    );
    CREATE TABLE IF NOT EXISTS devices (
      id TEXT PRIMARY KEY, licence_id TEXT NOT NULL REFERENCES licences(id), user_id TEXT NOT NULL REFERENCES users(id),
      fingerprint_hash TEXT NOT NULL, name TEXT NOT NULL, created_at INTEGER NOT NULL, UNIQUE(licence_id,fingerprint_hash)
    );
    CREATE TABLE IF NOT EXISTS licence_products (licence_id TEXT NOT NULL REFERENCES licences(id) ON DELETE CASCADE,product_slug TEXT NOT NULL,PRIMARY KEY(licence_id,product_slug));
    CREATE INDEX IF NOT EXISTS customer_directory_order ON users(created_at DESC,id DESC);
    CREATE INDEX IF NOT EXISTS customer_licences ON licences(user_id);
    CREATE INDEX IF NOT EXISTS customer_activity_actor ON audit_log(actor_id,created_at DESC);
    CREATE INDEX IF NOT EXISTS customer_activity_resource ON audit_log(resource,created_at DESC);
    CREATE INDEX IF NOT EXISTS ticket_message_order ON ticket_messages(ticket_id,created_at,id);
  `);
  return connection;
}

export function rows<T>(sql: string, ...parameters: SQLInputValue[]): T[] {
  return database()
    .prepare(sql)
    .all(...parameters) as T[];
}
export function run(sql: string, ...parameters: SQLInputValue[]) {
  return database()
    .prepare(sql)
    .run(...parameters);
}
/** Synchronous callbacks only: no request may interleave writes inside a transaction. */
export function transaction<T>(action: () => T): T {
  database().exec("BEGIN IMMEDIATE");
  try {
    const value = action();
    database().exec("COMMIT");
    return value;
  } catch (error) {
    database().exec("ROLLBACK");
    throw error;
  }
}
