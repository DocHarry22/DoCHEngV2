"use client";
type Row = Record<string, string | number | null>;
export function CustomerOperations({
  users,
  licences,
  send,
}: {
  users: Row[];
  licences: Row[];
  send: (body: object) => Promise<boolean>;
}) {
  return (
    <div className="space-y-5">
      <h3 className="text-lg font-semibold">User and licence controls</h3>
      <form
        className="flex flex-wrap items-end gap-3"
        onSubmit={(event) => {
          event.preventDefault();
          const f = new FormData(event.currentTarget);
          void send({
            action: "user-state",
            userId: f.get("userId"),
            disabled: f.get("state") === "disabled",
          });
        }}
      >
        <label className="text-sm">
          Account
          <select className="field mt-2" name="userId" required>
            {users.map((user) => (
              <option key={String(user.id)} value={String(user.id)}>
                {user.email} · {user.disabled ? "disabled" : "enabled"}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm">
          State
          <select className="field mt-2" name="state">
            <option value="enabled">Enabled</option>
            <option value="disabled">Disabled</option>
          </select>
        </label>
        <button className="action-button">Update account state</button>
      </form>
      <form
        className="flex flex-wrap items-end gap-3"
        onSubmit={(event) => {
          event.preventDefault();
          const f = new FormData(event.currentTarget);
          void send({
            action: "revoke-licence",
            licenceId: f.get("licenceId"),
          });
        }}
      >
        <label className="text-sm">
          Licence
          <select
            className="field mt-2"
            name="licenceId"
            required
            disabled={!licences.length}
          >
            <option value="">Choose a licence</option>
            {licences
              .filter((l) => !l.revoked)
              .map((l) => (
                <option key={String(l.id)} value={String(l.id)}>
                  {l.product_slug} · ending {l.key_hint}
                </option>
              ))}
          </select>
        </label>
        <button disabled={!licences.length} className="action-button">
          Revoke licence and its devices
        </button>
      </form>
      <p className="text-xs">
        These server operations are audited. Refunds and provider subscription
        cancellations require the separate commercial workflow; revoking a
        licence does not issue a refund.
      </p>
    </div>
  );
}
