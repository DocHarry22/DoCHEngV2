import { RecoveryForm } from "@/components/auth/recovery-form";
import { Section } from "@/components/ui/section";
export const metadata = {
  title: "Choose a new password",
  robots: { index: false, follow: false },
  referrer: "no-referrer" as const,
};
export default async function Reset({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  return (
    <Section className="py-16">
      <RecoveryForm mode="reset" token={token} />
    </Section>
  );
}
