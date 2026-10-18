import { PurchasePanel } from "@/components/commerce/purchase-panel";
import { Section } from "@/components/ui/section";
export const metadata = {
  title: "Purchase availability",
  robots: { index: false, follow: false },
};
export default function Checkout() {
  return (
    <Section className="space-y-8 py-16">
      <p className="eyebrow">Digital software access</p>
      <h1 className="text-4xl font-semibold">Review approved offers.</h1>
      <PurchasePanel />
    </Section>
  );
}
