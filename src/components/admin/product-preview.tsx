import Image from "next/image";
import type { CatalogueProduct } from "@/lib/catalogue";
import { ProductIcon } from "@/components/apps/product-icon";

export function ProductPreview({ product }: { product: CatalogueProduct }) {
  return (
    <aside
      aria-label="Product preview"
      className="min-w-0 space-y-5 rounded-2xl border border-[var(--border-subtle)] p-5 xl:sticky xl:top-6 xl:self-start"
    >
      <p className="eyebrow">
        Live preview ·{" "}
        {product.visibility === "internal"
          ? "Internal draft"
          : "Public listing"}
      </p>
      <ProductIcon slug={product.icon} imageUrl={product.logoUrl} />
      <p className="text-sm text-[var(--text-subtle)]">
        {product.category} · {product.status.replaceAll("-", " ")}
      </p>
      <h3 className="break-words text-3xl font-semibold">
        {product.name || "Your application name"}
      </h3>
      <p className="break-words text-lg">
        {product.summary ||
          "A short introduction to your application will appear here."}
      </p>
      <p className="break-words whitespace-pre-wrap text-sm text-[var(--text-subtle)]">
        {product.description ||
          "Describe what your application does and how it helps."}
      </p>
      <dl className="space-y-2 text-sm">
        <div>
          <dt className="font-semibold">Built for</dt>
          <dd className="break-words">
            {product.audience || "Your intended audience"}
          </dd>
        </div>
        <div>
          <dt className="font-semibold">Platforms</dt>
          <dd>
            {product.platforms.join(", ") || "Choose supported platforms"}
          </dd>
        </div>
        <div>
          <dt className="font-semibold">Pricing</dt>
          <dd>
            {product.pricing === "unconfirmed"
              ? "Under review"
              : product.pricing}
          </dd>
          <dd className="break-words whitespace-pre-wrap">
            {product.pricingNote}
          </dd>
        </div>
      </dl>
      <ul className="list-disc space-y-2 break-words pl-5 text-sm">
        {product.features
          .filter((f) => f.trim())
          .map((feature, index) => (
            <li key={index}>{feature}</li>
          ))}
      </ul>
      {product.screenshots.map((shot, index) => (
        <figure key={index} className="space-y-2">
          <Image
            unoptimized
            src={shot.url}
            alt={shot.caption}
            width={640}
            height={400}
            className="h-auto w-full rounded-lg border border-[var(--border-subtle)]"
          />
          <figcaption className="break-words text-sm">
            {shot.caption}
          </figcaption>
        </figure>
      ))}
      <div className="border-t border-[var(--border-subtle)] pt-4 text-sm">
        <p className="font-semibold">Release notes</p>
        <p className="break-words whitespace-pre-wrap">
          {product.releaseNotes}
        </p>
        <p className="mt-3">
          {product.releases.length} verified release files attached
        </p>
        <p className="mt-3 text-[var(--text-subtle)]">
          Preview updates as you edit. Save your draft, then approve publication
          to update the website.
        </p>
      </div>
    </aside>
  );
}
