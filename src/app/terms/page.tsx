import { Section } from "@/components/ui/section";
import Link from "next/link";
export const metadata = {
  title: "Terms and release policies",
  alternates: { canonical: "/terms" },
};
export default function Terms() {
  return (
    <Section className="space-y-6 py-16">
      <p className="eyebrow">Access and release policies</p>
      <h1 className="text-4xl font-semibold">Clear expectations</h1>
      <h2 className="text-2xl font-semibold">Product availability</h2>
      <p>
        Beta and preview products are evaluations with product-specific
        limitations. A verified entry page is not a guarantee that every
        workflow is production-ready. Each application enforces its own data
        permissions and account policies. Planned products have no promised
        launch date unless a verified announcement states one.
      </p>
      <h2 className="text-2xl font-semibold">Pricing and payments</h2>
      <p>
        Existing price amounts are proposals and are not active offers. Paid
        checkout, automatic renewals, trials that convert to paid plans and card
        collection are not activated. Before commercial launch, the operator
        must approve provider products, prices, VAT treatment, contracting
        entity, refund/cancellation terms and any applicable consumer rights. No
        paid entitlement is issued from a browser success message.
      </p>
      <h2 className="text-2xl font-semibold">Downloads</h2>
      <p>
        Only explicitly published artifacts are offered. Check the published
        SHA-256 value before running a file. A checksum is an integrity check
        and does not replace publisher signing, malware checks or installation
        testing. Preview builds are not automatically stable releases.
      </p>
      <h2 className="text-2xl font-semibold">Engineering tools</h2>
      <p>
        Calculators perform simplified screening arithmetic under stated
        assumptions. They do not replace independent engineering design, plant
        procedures, professional review or safety verification. A result does
        not establish equipment suitability, drinking-water safety or regulatory
        compliance.
      </p>
      <Link className="text-link" href="/support#contact-form">
        Ask about these policies
      </Link>
    </Section>
  );
}
