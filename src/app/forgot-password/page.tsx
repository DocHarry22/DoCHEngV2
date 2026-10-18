import { RecoveryForm } from "@/components/auth/recovery-form";
import { Section } from "@/components/ui/section";
export const metadata = {
  title: "Reset password",
  robots: { index: false, follow: false },
};
export default function Forgot() {
  return (
    <Section className="py-16">
      <RecoveryForm mode="forgot" />
    </Section>
  );
}
