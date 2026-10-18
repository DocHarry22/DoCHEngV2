import { Section } from "@/components/ui/section";
import Link from "next/link";
export const metadata = {
  title: "Privacy and data controls",
  alternates: { canonical: "/privacy" },
};
export default function Privacy() {
  return (
    <Section className="prose-surface space-y-6 py-16">
      <p className="eyebrow">DoCHEng privacy notice</p>
      <h1 className="text-4xl font-semibold">Your information and choices</h1>
      <p>
        This notice describes the data handled by the DoCHEng parent platform.
        Each independent application must explain its own data practices before
        you upload documents or create an account there.
      </p>
      <h2 className="text-2xl font-semibold">Accounts and support</h2>
      <p>
        We store your name, email address, a salted password hash, account role
        and email verification status. Sessions use random, revocable HttpOnly
        cookies; raw passwords and payment card details are not stored. Support
        enquiries contain the contact details and message you submit, a ticket
        reference, replies and handling status.
      </p>
      <h2 className="text-2xl font-semibold">Purpose and access</h2>
      <p>
        Account data is used to authenticate you and manage explicitly granted
        product access. Enquiry data is used to handle your request.
        Administrative access is restricted by server-side roles, and privileged
        changes are logged. The platform&apos;s operational store is hosted on
        the configured hosting account. When email is configured, the selected
        delivery provider processes the recipient address and message for
        delivery.
      </p>
      <h2 className="text-2xl font-semibold">Updates and analytics</h2>
      <p>
        Product announcements require a separate opt-in and email confirmation.
        You can unsubscribe using the link in the confirmation message. The
        platform currently loads no third-party advertising or visitor-tracking
        service. Engineering calculations and product-finder questions run in
        your browser.
      </p>
      <h2 className="text-2xl font-semibold">Export, correction and erasure</h2>
      <p>
        Your account provides a personal-data export, display-name correction,
        session revocation and a way to request erasure. Requests are reviewed
        against applicable retention obligations. A final retention schedule,
        information-officer details and business legal identity must be
        confirmed by the operator before commercial launch; this notice does not
        claim a completed POPIA compliance review.
      </p>
      <p>
        Support submissions should not contain passwords, payment-card data or
        unnecessary sensitive information. Unverified email messages remain in a
        protected delivery queue until a sending service is configured.
      </p>
      <div className="flex flex-wrap gap-5">
        <Link className="text-link" href="/account">
          Account data controls
        </Link>
        <Link className="text-link" href="/support#contact-form">
          Privacy enquiries
        </Link>
      </div>
    </Section>
  );
}
