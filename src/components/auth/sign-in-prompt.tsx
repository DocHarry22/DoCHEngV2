import { DownloadCTAGroup } from "@/components/ecosystem/download-cta-group";
import { SectionEyebrow } from "@/components/ecosystem/section-eyebrow";
import { Card } from "@/components/ui/card";

type SignInPromptProps = {
  title?: string;
  detail?: string;
  nextHref?: string;
};

export function SignInPrompt({
  title = "Sign in to continue",
  detail = "This action is protected by account access. Authenticate first to continue with ecosystem workflows.",
  nextHref = "/account"
}: SignInPromptProps) {
  const signInHref = `/signin?next=${encodeURIComponent(nextHref)}`;
  const signUpHref = `/signup?next=${encodeURIComponent(nextHref)}`;

  return (
    <Card className="space-y-4 bg-[var(--surface-0)]">
      <SectionEyebrow>Protected Action</SectionEyebrow>
      <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
      <p className="text-sm leading-relaxed text-[var(--text-subtle)]">{detail}</p>
      <DownloadCTAGroup actions={[{ label: "Sign In", href: signInHref }, { label: "Create Account", href: signUpHref, variant: "ghost" }]} />
    </Card>
  );
}
