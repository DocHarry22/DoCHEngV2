import Link from "next/link";
import { publishedCatalogue } from "@/lib/server/catalogue";
import { Section } from "@/components/ui/section";
import { Card } from "@/components/ui/card";
import { releaseDownloadLink } from "@/lib/product-links";
export const dynamic = "force-dynamic";
export const metadata = {
  title: "Verified downloads",
  description:
    "Verified DoCHEng release files, SHA-256 checksums, system requirements and installation guidance.",
  alternates: { canonical: "/downloads" },
};
export default function Downloads() {
  const products = publishedCatalogue();
  return (
    <Section className="space-y-8 py-16">
      <p className="eyebrow">Software distribution</p>
      <h1 className="text-4xl font-semibold sm:text-5xl">
        Downloads you can verify.
      </h1>
      <p className="max-w-3xl text-lg text-[var(--text-subtle)]">
        Find published release files, checksums, platform requirements and
        release notes. Web availability is separate from Windows and Android
        installer availability.
      </p>
      {!products
        .filter((p) => ["desk", "resume", "compass"].includes(p.slug))
        .some((p) => p.releases.length) ? (
        <Card className="space-y-4">
          <h2 className="text-2xl font-semibold">
            Core DoCHEng installers are not yet verified
          </h2>
          <p className="leading-relaxed text-[var(--text-subtle)]">
            The repository release collections checked for Desk, Resume and
            Paperplane do not contain downloadable releases. Previously
            displayed installer versions have been withdrawn until actual files
            can be verified.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link className="text-link" href="/apps">
              Explore web applications
            </Link>
            <Link className="text-link" href="/support#contact-form">
              Ask about installation or release updates
            </Link>
          </div>
        </Card>
      ) : null}
      {products.map((p) => (
        <section id={p.slug} key={p.id} className="scroll-mt-24 space-y-4">
          <h2 className="text-2xl font-semibold">{p.name}</h2>
          {p.releases.length ? (
            p.releases.map((r) => {
              const download = releaseDownloadLink(r);
              return (
              <Card key={r.id} className="space-y-3">
                <h3 className="text-xl font-semibold">
                  {r.version} · {r.platform}
                </h3>
                <p>
                  {r.channel} · {r.releasedAt} ·{" "}
                  {(r.bytes / 1024 / 1024).toFixed(1)} MB
                </p>
                <p>{r.notes}</p>
                <p>
                  <strong>Requirements:</strong> {r.requirements}
                </p>
                <p className="break-all font-mono text-xs">
                  SHA-256: {r.sha256}
                </p>
                <a
                  className="action-button"
                  href={download.href}
                  target={download.external ? "_blank" : undefined}
                  rel={download.external ? "noopener noreferrer" : undefined}
                >
                  {download.label}
                </a>
                {r.publisherUrl ? (
                  <a
                    className="text-link ml-4"
                    href={r.publisherUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Publisher release notes
                  </a>
                ) : null}
              </Card>
              );
            })
          ) : (
            <p className="text-sm text-[var(--text-subtle)]">
              No Windows or Android installer has been independently verified
              for this product.
            </p>
          )}
          {p.launch && (p.status === "live" || p.status === "beta") ? (
            <a
              className="text-link inline-block"
              href={p.launch.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              Open {p.name} website
            </a>
          ) : null}
        </section>
      ))}
      <Card className="space-y-4">
        <h2 className="text-2xl font-semibold">
          Check an installer before running it
        </h2>
        <p>
          On Windows, use PowerShell to compare the downloaded file with its
          published checksum:
        </p>
        <pre className="overflow-x-auto rounded-lg bg-[var(--surface-0)] p-4 text-sm">
          Get-FileHash -Algorithm SHA256 -LiteralPath .\installer.exe
        </pre>
        <p className="text-sm">
          A checksum confirms file integrity against the published value. It
          does not establish publisher signing or prove that software is safe.
        </p>
        <p>
          <strong>Stable:</strong> approved releases. <strong>Beta:</strong>{" "}
          test releases. <strong>Preview:</strong> early evaluations. No
          development build is automatically promoted to stable.
        </p>
        <Link className="text-link" href="/support#contact-form">
          Installation troubleshooting
        </Link>
      </Card>
    </Section>
  );
}
