import { notFound } from "next/navigation";
import Link from "next/link";
import { publishedCatalogue } from "@/lib/server/catalogue";
import { ProductAccessLinks } from "@/components/apps/product-access-links";
import { ProductIcon } from "@/components/apps/product-icon";
import { ScreenshotGallery } from "@/components/apps/screenshot-gallery";
import { Section } from "@/components/ui/section";
import { Card } from "@/components/ui/card";
export const dynamic = "force-dynamic";
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const product = publishedCatalogue().find((p) => p.slug === slug);
  return product
    ? {
        title: product.name,
        description: product.summary,
        alternates: { canonical: "/products/" + slug },
        openGraph: {
          title: product.name,
          description: product.summary,
          url: "/products/" + slug,
        },
      }
    : { title: "Product not found" };
}
export default async function Product({ params }: Props) {
  const { slug } = await params;
  const catalogue = publishedCatalogue();
  const product = catalogue.find((p) => p.slug === slug);
  if (!product) notFound();
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: product.name,
    description: product.summary,
    applicationCategory: product.category,
    operatingSystem: product.platforms.join(", "),
    url: "https://www.docheng.co.za/products/" + slug,
  };
  return (
    <Section className="space-y-10 py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema).replace(/</g, "\\u003c"),
        }}
      />
      <Link href="/apps" className="text-link">
        ← All applications
      </Link>
      <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
        <div className="space-y-5">
          <ProductIcon slug={product.icon} imageUrl={product.logoUrl} />
          <p className="eyebrow">
            {product.category} · {product.status.replaceAll("-", " ")}
          </p>
          <h1 className="text-4xl font-semibold sm:text-6xl">{product.name}</h1>
          <p className="text-xl leading-relaxed text-[var(--text-subtle)]">
            {product.summary}
          </p>
          <div className="flex flex-wrap gap-3">
            <ProductAccessLinks product={product} />
            <Link
              className="text-link self-center"
              href={product.documentation}
            >
              Documentation
            </Link>
          </div>
        </div>
        <Card className="space-y-4">
          <p className="eyebrow">At a glance</p>
          <p>
            <strong>For:</strong> {product.audience}
          </p>
          <p>
            <strong>Platforms:</strong> {product.platforms.join(", ")}
          </p>
          <p>
            <strong>Pricing:</strong>{" "}
            {product.pricing === "unconfirmed"
              ? "Under review"
              : product.pricing}
          </p>
          <p className="text-sm text-[var(--text-subtle)]">
            {product.launch
              ? "Public entry page checked " +
                product.launch.checkedAt +
                ". This does not establish full workflow readiness."
              : "No public launch URL has been verified."}
          </p>
          <p className="text-sm">
            {product.releases.length
              ? product.releases.length + " verified releases"
              : "No verified Windows or Android installer"}
          </p>
        </Card>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="text-2xl font-semibold">Built for a clear purpose</h2>
          <p className="mt-4 leading-relaxed text-[var(--text-subtle)]">
            {product.description}
          </p>
        </Card>
        <Card>
          <h2 className="text-2xl font-semibold">What you can explore</h2>
          <ul className="mt-4 list-disc space-y-3 pl-5">
            {product.features.map((feature) => (
              <li key={feature}>{feature}</li>
            ))}
          </ul>
        </Card>
      </div>
      {product.screenshots.length ? (
        <ScreenshotGallery screenshots={product.screenshots} />
      ) : null}
      <Card>
        <h2 className="text-2xl font-semibold">Pricing and access</h2>
        <p className="mt-4 leading-relaxed text-[var(--text-subtle)]">
          {product.pricingNote}
        </p>
        <p className="mt-3 text-sm">
          The free and paid feature split will be published when a
          provider-backed offer is approved. No paid access is granted by this
          page.
        </p>
        <Link className="text-link mt-4 inline-block" href="/pricing">
          Compare existing plan proposals
        </Link>
      </Card>
      <Card>
        <h2 className="text-2xl font-semibold">
          Release notes and installation
        </h2>
        <p className="mt-4 text-[var(--text-subtle)]">{product.releaseNotes}</p>
        <div className="mt-4 flex flex-wrap gap-4">
          <Link className="text-link" href={"/downloads#" + product.slug}>
            Check verified downloads
          </Link>
          <Link className="text-link" href="/changelog">
            Platform changelog
          </Link>
        </div>
      </Card>
      <Card>
        <h2 className="text-2xl font-semibold">Common questions</h2>
        <details className="mt-4">
          <summary className="cursor-pointer font-medium">
            Can I download this app?
          </summary>
          <p className="mt-3 text-sm">
            Only releases with verified files, platform details and SHA-256
            checksums appear in the download centre. A web app listing does not
            imply a native installer exists.
          </p>
        </details>
        <details className="mt-4">
          <summary className="cursor-pointer font-medium">
            Does my DoCHEng account sign me into this product?
          </summary>
          <p className="mt-3 text-sm">
            Each application currently controls its own account and data
            permissions. Centralized sign-on is not enabled; account tokens are
            never passed between frontends.
          </p>
        </details>
        <details className="mt-4">
          <summary className="cursor-pointer font-medium">
            Where can I ask for help?
          </summary>
          <p className="mt-3 text-sm">
            <Link className="text-link" href={product.support}>
              Submit a support enquiry
            </Link>{" "}
            and include the product and relevant version. You will receive a
            ticket reference after successful storage.
          </p>
        </details>
      </Card>
      {product.related.length ? (
        <Card>
          <h2 className="text-2xl font-semibold">Related applications</h2>
          <div className="mt-4 flex flex-wrap gap-4">
            {catalogue
              .filter((p) => product.related.includes(p.slug))
              .map((p) => (
                <Link
                  className="text-link"
                  href={"/products/" + p.slug}
                  key={p.id}
                >
                  {p.name}
                </Link>
              ))}
          </div>
        </Card>
      ) : null}
    </Section>
  );
}
