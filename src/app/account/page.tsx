import { redirect } from "next/navigation";
import { serverSession } from "@/lib/server/auth";
import { AccountPanel } from "@/components/auth/account-panel";
import { Section } from "@/components/ui/section";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const metadata = {
  title: "Your account",
  robots: { index: false, follow: false },
};
export default async function AccountPage() {
  const session = await serverSession();
  if (!session.user) redirect("/signin?next=%2Faccount");
  return (
    <Section className="py-14">
      <p className="eyebrow">Customer workspace</p>
      <h1 className="mb-8 mt-3 text-4xl font-semibold">Your DoCHEng account</h1>
      <AccountPanel />
    </Section>
  );
}
