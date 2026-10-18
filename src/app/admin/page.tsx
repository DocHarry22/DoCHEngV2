import { redirect, notFound } from "next/navigation";
import { serverSession } from "@/lib/server/auth";
import { AdminPanel } from "@/components/admin/admin-panel";
import { Section } from "@/components/ui/section";
export const dynamic = "force-dynamic";
export const metadata = {
  title: "Administration",
  robots: { index: false, follow: false },
};
export default async function Admin() {
  const session = await serverSession();
  if (!session.user) redirect("/signin?next=%2Fadmin");
  if (session.user.role !== "admin") notFound();
  return (
    <Section className="py-16">
      <p className="eyebrow">DoCHEng administration</p>
      <h1 className="mb-8 mt-3 text-4xl font-semibold">
        Product and customer operations
      </h1>
      <AdminPanel />
    </Section>
  );
}
