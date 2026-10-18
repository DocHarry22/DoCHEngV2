import Link from "next/link";
import { Section } from "@/components/ui/section";
import { Card } from "@/components/ui/card";
import { publishedCatalogue } from "@/lib/server/catalogue";
export const dynamic = "force-dynamic";
export const metadata = {
  title: "Compare applications",
  description:
    "Compare published DoCHEng products by purpose, verified availability, platform and pricing status.",
  alternates: { canonical: "/compare" },
};
export default async function Compare({
  searchParams,
}: {
  searchParams: Promise<{ product?: string | string[] }>;
}) {
  const params = await searchParams;
  const catalogue = publishedCatalogue();
  const values =
    typeof params.product === "string"
      ? [params.product]
      : (params.product ?? ["desk", "resume", "compass"]);
  const selected = [...new Set(values)]
    .slice(0, 3)
    .map((slug) => catalogue.find((p) => p.slug === slug))
    .filter((p) => p !== undefined);
  return (
    <Section className="space-y-8 py-16">
      <p className="eyebrow">Choose by purpose</p>
      <h1 className="text-4xl font-semibold">Compare the right tools.</h1>
      <p className="max-w-3xl text-[var(--text-subtle)]">
        Select up to three published applications. Product implementation,
        hosted workflow acceptance and native installer availability are
        separate checks.
      </p>
      <Card>
        <form className="grid items-end gap-4 sm:grid-cols-3">
          <div className="contents">
            {[0, 1, 2].map((index) => (
              <label
                key={index}
                className="text-sm"
                htmlFor={"compare-" + index}
              >
                {["First", "Second", "Third"][index]} product
                <select
                  id={"compare-" + index}
                  name="product"
                  className="field mt-2"
                  defaultValue={selected[index]?.slug ?? ""}
                >
                  <option value="">None</option>
                  {catalogue.map((p) => (
                    <option key={p.id} value={p.slug}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </label>
            ))}
          </div>
          <button className="action-button sm:col-span-3">
            Compare selected products
          </button>
        </form>
      </Card>
      {selected.length ? (
        <div className="grid gap-5 lg:grid-cols-3">
          {selected.map((product) => (
            <Card key={product.id} className="space-y-4">
              <h2 className="text-2xl font-semibold">{product.name}</h2>
              <p>{product.summary}</p>
              <dl className="space-y-3 text-sm">
                <div>
                  <dt className="font-semibold">For</dt>
                  <dd>{product.audience}</dd>
                </div>
                <div>
                  <dt className="font-semibold">Status</dt>
                  <dd>{product.status.replaceAll("-", " ")}</dd>
                </div>
                <div>
                  <dt className="font-semibold">Platforms</dt>
                  <dd>{product.platforms.join(", ")}</dd>
                </div>
                <div>
                  <dt className="font-semibold">Pricing</dt>
                  <dd>{product.pricingNote}</dd>
                </div>
                <div>
                  <dt className="font-semibold">Native releases</dt>
                  <dd>
                    {product.releases.length
                      ? product.releases
                          .map(
                            (r) =>
                              r.platform +
                              " " +
                              r.version +
                              " (" +
                              r.channel +
                              ")",
                          )
                          .join(", ")
                      : "No verified installer"}
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold">Public entry</dt>
                  <dd>
                    {product.launch
                      ? "Checked " +
                        product.launch.checkedAt +
                        "; workflow acceptance remains separate."
                      : "No verified public launch."}
                  </dd>
                </div>
              </dl>
              <Link
                className="text-link inline-block"
                href={"/products/" + product.slug}
              >
                View product details
              </Link>
            </Card>
          ))}
        </div>
      ) : (
        <p>
          No published products were selected. Choose products above to compare
          them.
        </p>
      )}
    </Section>
  );
}
