"use client";
import { useEffect, useState } from "react";
import { categories, type CatalogueProduct } from "@/lib/catalogue";
import { Card } from "@/components/ui/card";
import { ProductImageUpload } from "./product-image-upload";
import { ProductPreview } from "./product-preview";
import { ReleaseUpload } from "./release-upload";

export type ProductDraft = { slug: string; document: string; revision: number };
type Data = { products: CatalogueProduct[]; drafts: ProductDraft[] };
type Pending = { kind: "select"; slug: string } | { kind: "new" | "reload" };
function blankProduct(): CatalogueProduct {
  return {
    id: "app-new-product",
    slug: "",
    name: "",
    visibility: "internal",
    category: categories[0],
    summary: "",
    description: "",
    audience: "",
    features: [""],
    platforms: ["Web"],
    status: "planned",
    featured: false,
    pricing: "unconfirmed",
    pricingNote: "Pricing is under review.",
    icon: "new-product",
    screenshots: [],
    documentation: "/docs",
    support: "/support",
    related: [],
    releases: [],
    releaseNotes: "No release notes published.",
  };
}
function slugFor(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function GuidedProductEditor({
  products,
  drafts,
  onReload,
}: Data & { onReload: () => Promise<Data> }) {
  const [product, setProduct] = useState<CatalogueProduct>();
  const [savedSlug, setSavedSlug] = useState("");
  const [revision, setRevision] = useState<number>();
  const [slugTouched, setSlugTouched] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [approve, setApprove] = useState(false);
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [launchUrl, setLaunchUrl] = useState("");
  const [pending, setPending] = useState<Pending>();
  const locked = busy || uploading;
  const launchEdited = Boolean(
    product && launchUrl !== (product.launch?.url ?? ""),
  );
  const unsaved = dirty || launchEdited;
  useEffect(() => {
    if (!unsaved) return;
    const leave = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", leave);
    return () => window.removeEventListener("beforeunload", leave);
  }, [unsaved]);
  function load(slug: string, data: Data = { products, drafts }) {
    const draft = data.drafts.find((d) => d.slug === slug);
    const value = draft
      ? (JSON.parse(draft.document) as CatalogueProduct)
      : data.products.find((p) => p.slug === slug);
    setProduct(value);
    setSavedSlug(value?.slug ?? "");
    setRevision(draft?.revision);
    setLaunchUrl(value?.launch?.url ?? "");
    setSlugTouched(true);
    setDirty(false);
    setApprove(false);
    setError("");
    setNotice("");
  }
  async function navigate(action: Pending, discard = false) {
    if (unsaved && !discard) {
      setPending(action);
      return;
    }
    setPending(undefined);
    if (action.kind === "new") {
      setProduct(blankProduct());
      setSavedSlug("");
      setRevision(undefined);
      setSlugTouched(false);
      setLaunchUrl("");
      setDirty(true);
      setApprove(false);
      setError("");
      setNotice("");
    } else if (action.kind === "select") load(action.slug);
    else {
      setBusy(true);
      try {
        load(savedSlug, await onReload());
        setNotice("Saved draft reloaded.");
      } catch {
        setError("Unable to reload the draft. Your edits have been kept.");
      } finally {
        setBusy(false);
      }
    }
  }
  function update(change: Partial<CatalogueProduct>) {
    setProduct((current) => (current ? { ...current, ...change } : current));
    setDirty(true);
    setApprove(false);
    setNotice("");
    setError("");
  }
  async function action(
    kind: "save-product" | "publish" | "unpublish" | "verify-link",
  ) {
    if (!product) return;
    const clean = {
      ...product,
      features: product.features.map((f) => f.trim()).filter(Boolean),
    };
    if (!clean.features.length || !clean.platforms.length) {
      setError("Add at least one feature and choose a supported platform.");
      return;
    }
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const response = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          kind === "verify-link"
            ? { action: kind, slug: savedSlug, revision, url: launchUrl }
            : {
                action: kind,
                product: clean,
                revision,
                approvePublication: kind === "publish" && approve,
              },
        ),
      });
      const result = await response.json();
      if (!response.ok)
        throw new Error(result.message ?? "Unable to save this product.");
      setProduct(result.product);
      if (kind === "verify-link")
        setLaunchUrl(result.product.launch?.url ?? "");
      setSavedSlug(result.product.slug);
      setRevision(result.revision);
      setDirty(false);
      setApprove(false);
      setPending(undefined);
      setNotice(result.message);
      // Keep the saved revision from this response. A later refresh must not silently rebase older form values over another editor's work.
      try {
        await onReload();
      } catch {
        setNotice(
          result.message +
            " Dashboard refresh failed; reload the dashboard before selecting another product.",
        );
      }
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "Unable to save this product. Your edits have been kept.",
      );
    } finally {
      setBusy(false);
    }
  }
  const active = product?.status === "live" || product?.status === "beta";
  return (
    <Card className="min-w-0 space-y-6">
      <div>
        <p className="eyebrow">Product management</p>
        <h2 className="mt-2 text-2xl font-semibold">Guided product editor</h2>
        <p className="mt-2 text-sm text-[var(--text-subtle)]">
          Choose an app or create a draft. Complete its details, preview the
          page, then review and publish.
        </p>
      </div>
      <div className="flex flex-wrap items-end gap-3">
        <label className="min-w-0 basis-full text-sm sm:flex-1 sm:basis-64">
          Choose a product
          <select
            className="field mt-2 w-full"
            value={savedSlug}
            disabled={locked}
            onChange={(e) =>
              void navigate({ kind: "select", slug: e.target.value })
            }
          >
            <option value="">Select a product</option>
            {Array.from(
              new Set([
                ...products.map((p) => p.slug),
                ...drafts.map((d) => d.slug),
              ]),
            ).map((slug) => (
              <option key={slug} value={slug}>
                {products.find((p) => p.slug === slug)?.name ?? slug}
              </option>
            ))}
          </select>
        </label>
        <button
          type="button"
          className="action-button"
          disabled={locked}
          onClick={() => void navigate({ kind: "new" })}
        >
          Add an application
        </button>
        <button
          type="button"
          className="text-link"
          disabled={!savedSlug || locked}
          onClick={() => void navigate({ kind: "reload" })}
        >
          Reload saved draft
        </button>
      </div>
      {pending ? (
        <div
          role="alert"
          className="space-y-3 rounded-xl border border-[var(--border-subtle)] p-4"
        >
          <p>
            You have unsaved changes. Save your draft to keep them, or discard
            them to continue.
          </p>
          <div className="flex gap-4">
            <button
              type="button"
              className="action-button"
              onClick={() => void navigate(pending, true)}
            >
              Discard changes
            </button>
            <button
              type="button"
              className="text-link"
              onClick={() => setPending(undefined)}
            >
              Keep editing
            </button>
          </div>
        </div>
      ) : null}
      {error ? (
        <p role="alert" className="notice">
          {error}
        </p>
      ) : null}
      {notice || uploading ? (
        <p role="status" className="notice">
          {uploading ? "Uploading file…" : notice}
        </p>
      ) : null}
      {product ? (
        <div className="grid min-w-0 gap-8 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          <div className="min-w-0 space-y-8">
            <form
              aria-label="Product details"
              onSubmit={(e) => {
                e.preventDefault();
                void action("save-product");
              }}
            >
              <fieldset disabled={locked} className="min-w-0 space-y-6">
                <legend className="mb-4 text-lg font-semibold">
                  1. App details
                </legend>
                <label className="block text-sm">
                  App name
                  <input
                    className="field mt-2 w-full"
                    value={product.name}
                    minLength={2}
                    maxLength={100}
                    required
                    onChange={(e) => {
                      const name = e.target.value;
                      const slug = slugFor(name);
                      update(
                        !savedSlug && !slugTouched
                          ? {
                              name,
                              slug,
                              id: "app-" + slug,
                              icon: slug,
                              support:
                                "/support?product=" +
                                (slug || "new-product") +
                                "#contact-form",
                            }
                          : { name },
                      );
                    }}
                  />
                </label>
                <label className="block text-sm">
                  Page address
                  <input
                    aria-label="Page address"
                    aria-describedby="product-address-help"
                    className="field mt-2 w-full"
                    value={product.slug}
                    minLength={2}
                    maxLength={80}
                    pattern="[a-z0-9]+(-[a-z0-9]+)*"
                    required
                    readOnly={Boolean(savedSlug)}
                    onChange={(e) => {
                      setSlugTouched(true);
                      update({
                        slug: e.target.value,
                        id: "app-" + e.target.value,
                        icon: e.target.value,
                      });
                    }}
                  />
                  <span
                    id="product-address-help"
                    className="mt-1 block text-xs text-[var(--text-subtle)]"
                  >
                    /products/{product.slug || "your-app"}
                    {savedSlug
                      ? " · Fixed after the first save."
                      : " · Lowercase letters, numbers and hyphens."}
                  </span>
                </label>
                <label className="block text-sm">
                  Short description
                  <textarea
                    aria-label="Short description"
                    aria-describedby="product-summary-help"
                    className="field mt-2 min-h-24 w-full"
                    value={product.summary}
                    minLength={20}
                    maxLength={300}
                    required
                    onChange={(e) => update({ summary: e.target.value })}
                  />
                  <span
                    id="product-summary-help"
                    className="text-xs text-[var(--text-subtle)]"
                  >
                    20–300 characters · {product.summary.length}/300
                  </span>
                </label>
                <label className="block text-sm">
                  Full description
                  <textarea
                    className="field mt-2 min-h-40 w-full"
                    value={product.description}
                    minLength={40}
                    maxLength={8000}
                    required
                    onChange={(e) => update({ description: e.target.value })}
                  />
                </label>
                <label className="block text-sm">
                  Who is it for?
                  <input
                    className="field mt-2 w-full"
                    value={product.audience}
                    minLength={3}
                    maxLength={300}
                    required
                    onChange={(e) => update({ audience: e.target.value })}
                  />
                </label>
                <label className="block text-sm">
                  Key features
                  <textarea
                    aria-label="Key features"
                    aria-describedby="product-features-help"
                    className="field mt-2 min-h-32 w-full"
                    value={product.features.join("\n")}
                    required
                    onChange={(e) =>
                      update({ features: e.target.value.split("\n") })
                    }
                  />
                  <span
                    id="product-features-help"
                    className="text-xs text-[var(--text-subtle)]"
                  >
                    One feature per line · up to 20, each up to 200 characters.
                  </span>
                </label>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="text-sm">
                    Category
                    <select
                      className="field mt-2 w-full"
                      value={product.category}
                      onChange={(e) =>
                        update({
                          category: e.target
                            .value as CatalogueProduct["category"],
                        })
                      }
                    >
                      {categories.map((c) => (
                        <option key={c}>{c}</option>
                      ))}
                    </select>
                  </label>
                  <label className="text-sm">
                    Release status
                    <select
                      className="field mt-2 w-full"
                      value={product.status}
                      onChange={(e) =>
                        update({
                          status: e.target.value as CatalogueProduct["status"],
                        })
                      }
                    >
                      <option value="planned">Planned</option>
                      <option value="coming-soon">Coming soon</option>
                      <option value="beta">Beta</option>
                      <option value="live">Live</option>
                    </select>
                  </label>
                  <label className="text-sm">
                    Visibility
                    <select
                      className="field mt-2 w-full"
                      value={product.visibility}
                      onChange={(e) =>
                        update({
                          visibility: e.target
                            .value as CatalogueProduct["visibility"],
                        })
                      }
                    >
                      <option value="internal">Internal draft</option>
                      <option value="public">Public</option>
                    </select>
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={product.featured}
                      onChange={(e) => update({ featured: e.target.checked })}
                    />
                    Featured application
                  </label>
                </div>
                <fieldset>
                  <legend className="mb-2 text-sm font-medium">
                    Supported platforms
                  </legend>
                  <div className="flex flex-wrap gap-4">
                    {Array.from(
                      new Set([
                        "Web",
                        "Windows",
                        "Android",
                        ...product.platforms,
                      ]),
                    ).map((platform) => (
                      <label
                        key={platform}
                        className="flex items-center gap-2 text-sm"
                      >
                        <input
                          type="checkbox"
                          checked={product.platforms.includes(platform)}
                          onChange={(e) =>
                            update({
                              platforms: e.target.checked
                                ? [...product.platforms, platform]
                                : product.platforms.filter(
                                    (p) => p !== platform,
                                  ),
                            })
                          }
                        />
                        {platform}
                      </label>
                    ))}
                  </div>
                </fieldset>
                <div className="space-y-4 border-t border-[var(--border-subtle)] pt-6">
                  <h3 className="text-lg font-semibold">
                    2. Pricing and links
                  </h3>
                  <label className="block text-sm">
                    Pricing type
                    <select
                      className="field mt-2 w-full"
                      value={product.pricing}
                      onChange={(e) =>
                        update({
                          pricing: e.target
                            .value as CatalogueProduct["pricing"],
                        })
                      }
                    >
                      <option value="unconfirmed">Under review</option>
                      <option value="free">Free</option>
                      <option value="paid">Paid proposal</option>
                    </select>
                  </label>
                  <label className="block text-sm">
                    Pricing description
                    <textarea
                      className="field mt-2 w-full"
                      value={product.pricingNote}
                      minLength={10}
                      maxLength={1000}
                      required
                      onChange={(e) => update({ pricingNote: e.target.value })}
                    />
                  </label>
                  <p className="text-xs text-[var(--text-subtle)]">
                    Describe proposed prices here. Saving or publishing a
                    description does not activate payments.
                  </p>
                  <label className="block text-sm">
                    Documentation page
                    <input
                      className="field mt-2 w-full"
                      value={product.documentation}
                      pattern={String.raw`/docs(/[a-z0-9\-]+)?(#[a-z0-9\-]+)?`}
                      required
                      onChange={(e) =>
                        update({ documentation: e.target.value })
                      }
                    />
                  </label>
                  <label className="block text-sm">
                    Support page
                    <input
                      className="field mt-2 w-full"
                      value={product.support}
                      pattern={String.raw`/support(\?product=[a-z0-9\-]+)?(#[a-z0-9\-]+)?`}
                      required
                      onChange={(e) => update({ support: e.target.value })}
                    />
                  </label>
                  <fieldset>
                    <legend className="mb-2 text-sm font-medium">
                      Related applications
                    </legend>
                    <div className="flex flex-wrap gap-4">
                      {products
                        .filter((p) => p.slug !== product.slug)
                        .map((p) => (
                          <label
                            key={p.slug}
                            className="flex items-center gap-2 text-sm"
                          >
                            <input
                              type="checkbox"
                              checked={product.related.includes(p.slug)}
                              onChange={(e) =>
                                update({
                                  related: e.target.checked
                                    ? [...product.related, p.slug]
                                    : product.related.filter(
                                        (s) => s !== p.slug,
                                      ),
                                })
                              }
                            />
                            {p.name}
                          </label>
                        ))}
                    </div>
                  </fieldset>
                  <label className="block text-sm">
                    Product release notes
                    <textarea
                      className="field mt-2 min-h-24 w-full"
                      value={product.releaseNotes}
                      maxLength={5000}
                      required
                      onChange={(e) => update({ releaseNotes: e.target.value })}
                    />
                  </label>
                </div>
                <div className="space-y-4 border-t border-[var(--border-subtle)] pt-6">
                  <h3 className="text-lg font-semibold">
                    3. Logo and screenshots
                  </h3>
                  <ProductImageUpload
                    label={
                      product.logoUrl
                        ? "Replace product logo"
                        : "Upload product logo"
                    }
                    disabled={locked}
                    onBusy={setUploading}
                    onError={setError}
                    onUploaded={(url) => update({ logoUrl: url })}
                  />
                  {product.logoUrl ? (
                    <button
                      type="button"
                      className="text-link"
                      onClick={() => update({ logoUrl: undefined })}
                    >
                      Remove logo
                    </button>
                  ) : null}
                  {product.screenshots.map((shot, index) => (
                    <div
                      key={index}
                      className="space-y-2 rounded-xl border border-[var(--border-subtle)] p-3"
                    >
                      <label className="block text-sm">
                        Screenshot {index + 1} caption
                        <input
                          className="field mt-2 w-full"
                          value={shot.caption}
                          minLength={5}
                          maxLength={300}
                          required
                          onChange={(e) =>
                            update({
                              screenshots: product.screenshots.map((s, i) =>
                                i === index
                                  ? { ...s, caption: e.target.value }
                                  : s,
                              ),
                            })
                          }
                        />
                      </label>
                      <div className="flex flex-wrap gap-4">
                        <button
                          type="button"
                          className="text-link"
                          disabled={index === 0}
                          onClick={() => {
                            const shots = [...product.screenshots];
                            [shots[index - 1], shots[index]] = [
                              shots[index],
                              shots[index - 1],
                            ];
                            update({ screenshots: shots });
                          }}
                        >
                          Move screenshot {index + 1} up
                        </button>
                        <button
                          type="button"
                          className="text-link"
                          onClick={() =>
                            update({
                              screenshots: product.screenshots.filter(
                                (_, i) => i !== index,
                              ),
                            })
                          }
                        >
                          Remove screenshot {index + 1}
                        </button>
                      </div>
                    </div>
                  ))}
                  <ProductImageUpload
                    label="Add a screenshot"
                    disabled={locked || product.screenshots.length >= 12}
                    onBusy={setUploading}
                    onError={setError}
                    onUploaded={(url) =>
                      update({
                        screenshots: [
                          ...product.screenshots,
                          {
                            url,
                            caption:
                              (product.name || "Application") + " screenshot",
                          },
                        ],
                      })
                    }
                  />
                  <p className="text-xs">
                    {product.screenshots.length}/12 screenshots
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-4 border-t border-[var(--border-subtle)] pt-5">
                  <button className="action-button" type="submit">
                    {busy ? "Saving…" : "Save draft"}
                  </button>
                  <p className="text-sm">
                    {dirty ? "Unsaved changes" : "Changes saved"}
                  </p>
                </div>
              </fieldset>
            </form>
            <section
              aria-label="Launch verification"
              className="space-y-3 border-t border-[var(--border-subtle)] pt-6"
            >
              <h3 className="text-lg font-semibold">4. Launch and downloads</h3>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  void action("verify-link");
                }}
                className="space-y-3"
              >
                <label className="block text-sm">
                  Public launch URL
                  <input
                    type="url"
                    className="field mt-2 w-full"
                    placeholder="https://your-app.example"
                    value={launchUrl}
                    required
                    disabled={locked}
                    onChange={(e) => {
                      setLaunchUrl(e.target.value);
                      setApprove(false);
                    }}
                  />
                </label>
                <button
                  className="action-button"
                  disabled={locked || dirty || revision === undefined}
                >
                  Verify launch URL
                </button>
              </form>
              <p className="break-words text-xs">
                {product.launch
                  ? "Verified entry page: " + product.launch.url
                  : "Live and beta listings need a verified public entry page before publication."}
              </p>
              {launchEdited ? (
                <p className="text-sm">
                  Verify the changed launch URL before publishing.{" "}
                  <button
                    type="button"
                    className="text-link"
                    disabled={locked}
                    onClick={() => setLaunchUrl(product.launch?.url ?? "")}
                  >
                    Use saved launch URL
                  </button>
                </p>
              ) : null}
              {revision === undefined || dirty ? (
                <p className="text-sm">
                  Save your draft before verifying a launch URL or uploading
                  release files.
                </p>
              ) : (
                <details>
                  <summary className="cursor-pointer font-medium">
                    Upload a release file
                  </summary>
                  <div className="mt-4">
                    <ReleaseUpload
                      slugs={[savedSlug]}
                      productSlug={savedSlug}
                      onBusyChange={setUploading}
                      onUploaded={async () => {
                        load(savedSlug, await onReload());
                        setNotice(
                          "Release attached. Review and publish the updated draft when ready.",
                        );
                      }}
                    />
                  </div>
                </details>
              )}
            </section>
            <section
              aria-label="Publication review"
              className="space-y-4 border-t border-[var(--border-subtle)] pt-6"
            >
              <h3 className="text-lg font-semibold">5. Review and publish</h3>
              <p className="text-sm">
                Check the preview, pricing description, images, launch link and
                releases. Published changes appear on your website.
              </p>
              <label className="flex items-start gap-3 text-sm">
                <input
                  type="checkbox"
                  className="mt-1"
                  checked={approve}
                  disabled={
                    locked || dirty || launchEdited || revision === undefined
                  }
                  onChange={(e) => setApprove(e.target.checked)}
                />
                I have reviewed this product and approve its public publication.
              </label>
              {product.visibility === "internal" ? (
                <p className="text-sm">
                  Choose Public visibility and save the draft before publishing.
                </p>
              ) : null}
              <div className="flex flex-wrap gap-4">
                <button
                  type="button"
                  className="action-button"
                  disabled={
                    locked ||
                    dirty ||
                    launchEdited ||
                    !approve ||
                    revision === undefined ||
                    product.visibility !== "public" ||
                    (active && !product.launch)
                  }
                  onClick={() => void action("publish")}
                >
                  Approve and publish
                </button>
                <button
                  type="button"
                  className="text-link"
                  disabled={locked || dirty || revision === undefined}
                  onClick={() => void action("unpublish")}
                >
                  Withdraw publication
                </button>
              </div>
            </section>
          </div>
          <ProductPreview product={product} />
        </div>
      ) : (
        <p className="text-sm text-[var(--text-subtle)]">
          Select an application to edit its details, or add a new application.
        </p>
      )}
    </Card>
  );
}
