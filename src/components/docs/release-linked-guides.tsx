import { Card } from "@/components/ui/card";
import { DownloadCTAGroup } from "@/components/ecosystem/download-cta-group";

type ReleaseLinkedGuide = {
  releaseTitle: string;
  releaseVersion: string;
  releaseDate: string;
  releaseRoute: string;
  guideTitle: string;
  guideSlug: string;
  guideSummary: string;
};

type ReleaseLinkedGuidesProps = {
  guides: ReleaseLinkedGuide[];
};

export function ReleaseLinkedGuides({ guides }: ReleaseLinkedGuidesProps) {
  if (!guides.length) {
    return (
      <Card className="bg-[var(--surface-0)]">
        <p className="text-sm leading-relaxed text-[var(--text-subtle)]">No release-linked guides are published yet.</p>
      </Card>
    );
  }

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      {guides.map((item) => (
        <Card key={`${item.releaseVersion}-${item.guideSlug}`} className="space-y-4 bg-[var(--surface-0)]">
          <div>
            <p className="text-xs uppercase tracking-[0.12em] text-[var(--text-muted)]">
              {item.releaseVersion} · {item.releaseDate}
            </p>
            <h3 className="mt-2 text-lg font-semibold tracking-tight">{item.releaseTitle}</h3>
          </div>

          <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-1)] p-4">
            <p className="text-sm font-semibold">{item.guideTitle}</p>
            <p className="mt-2 text-sm leading-relaxed text-[var(--text-subtle)]">{item.guideSummary}</p>
          </div>

          <DownloadCTAGroup
            actions={[
              { label: "Open Guide", href: `/docs/${item.guideSlug}` },
              { label: "Open Release", href: item.releaseRoute, variant: "ghost" }
            ]}
          />
        </Card>
      ))}
    </div>
  );
}
