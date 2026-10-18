"use client";
type Row = Record<string, string | number | null>;
export function RepositoryReferences({
  slugs,
  rows,
  send,
}: {
  slugs: string[];
  rows: Row[];
  send: (body: object) => Promise<boolean>;
}) {
  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold">
        Private administration references
      </h2>
      <p className="text-sm">
        Repository records are stored separately from product publications. They
        are available only through administrator authorization and are never
        added to public product JSON.
      </p>
      <form
        className="grid gap-4 sm:grid-cols-2"
        onSubmit={(event) => {
          event.preventDefault();
          const values = new FormData(event.currentTarget);
          void send({
            action: "repository",
            slug: values.get("slug"),
            repository: values.get("repository"),
            private: values.get("private") === "on",
          });
        }}
      >
        <label htmlFor="repository-product" className="text-sm">
          Product
          <select
            id="repository-product"
            className="field mt-2"
            name="slug"
            required
          >
            {slugs.map((slug) => (
              <option key={slug}>{slug}</option>
            ))}
          </select>
        </label>
        <label className="text-sm">
          Repository owner/name
          <input
            name="repository"
            className="field mt-2"
            required
            maxLength={200}
            placeholder="owner/repository"
          />
        </label>
        <label className="flex gap-2 text-sm">
          <input type="checkbox" name="private" defaultChecked />
          Private source
        </label>
        <button className="action-button" disabled={!slugs.length}>
          Save administration reference
        </button>
      </form>
      <ul className="space-y-2 text-sm">
        {rows.map((row) => (
          <li key={String(row.slug)}>
            {row.slug} · {row.repository} · {row.visibility}
          </li>
        ))}
      </ul>
    </section>
  );
}
