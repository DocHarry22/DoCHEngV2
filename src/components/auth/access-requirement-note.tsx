import { DownloadCTAGroup } from "@/components/ecosystem/download-cta-group";
import { SectionEyebrow } from "@/components/ecosystem/section-eyebrow";
import { Card } from "@/components/ui/card";

type AccessRequirementNoteProps = {
  title?: string;
  detail?: string;
  pricingHref?: string;
  accountHref?: string;
};

export function AccessRequirementNote({
  title = "Access required",
  detail = "Your account is signed in, but this branch requires entitlement. Add access through pricing or manage existing plans.",
  pricingHref = "/pricing",
  accountHref = "/account"
}: AccessRequirementNoteProps) {
  return (
    <Card className="space-y-4 bg-[var(--surface-0)]">
      <SectionEyebrow>Entitlement Layer</SectionEyebrow>
      <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
      <p className="text-sm leading-relaxed text-[var(--text-subtle)]">{detail}</p>
      <DownloadCTAGroup actions={[{ label: "Get Access", href: pricingHref }, { label: "Manage Account", href: accountHref, variant: "ghost" }]} />
    </Card>
  );
}
