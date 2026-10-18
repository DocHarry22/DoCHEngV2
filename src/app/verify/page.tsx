import { RecoveryForm } from "@/components/auth/recovery-form";
import { Section } from "@/components/ui/section";
export const metadata = {
  title: "Verify email",
  robots: { index: false, follow: false },
  referrer: "no-referrer" as const,
};
export default async function Verify({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  return (
    <Section className="py-16">
      <RecoveryForm mode="verify" token={token} />
    </Section>
  );
}
