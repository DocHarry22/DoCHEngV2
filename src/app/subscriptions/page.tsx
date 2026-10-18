import { SubscriptionConfirm } from "@/components/marketing/subscription-confirm";
import { Section } from "@/components/ui/section";
export const metadata = {
  title: "Update preferences",
  robots: { index: false, follow: false },
  referrer: "no-referrer" as const,
};
export default async function Subscriptions({
  searchParams,
}: {
  searchParams: Promise<{ token?: string; action?: string }>;
}) {
  const { token, action } = await searchParams;
  return (
    <Section className="space-y-6 py-16">
      <h1 className="text-4xl font-semibold">Your update preferences</h1>
      <SubscriptionConfirm
        token={token}
        unsubscribe={action === "unsubscribe"}
      />
    </Section>
  );
}
