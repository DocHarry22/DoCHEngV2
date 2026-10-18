import type { Metadata } from "next";

import { SectionEyebrow } from "@/components/ecosystem/section-eyebrow";
import { DownloadCTAGroup } from "@/components/ecosystem/download-cta-group";
import { FAQGroup } from "@/components/support/faq-group";
import { ContactFormShell } from "@/components/support/contact-form-shell";
import { ContactMethodCard } from "@/components/support/contact-method-card";
import { EscalationStrip } from "@/components/support/escalation-strip";
import { ResponseExpectationNote } from "@/components/support/response-expectation-note";
import { SupportCategoryCard } from "@/components/support/support-category-card";
import { SupportHero } from "@/components/support/support-hero";
import { Reveal } from "@/components/motion/reveal";
import { Card } from "@/components/ui/card";
import { Section } from "@/components/ui/section";
import {
  supportCategories,
  supportContactMethods,
  supportEnquiryTypes,
  supportFaqGroups,
  supportProductOptions,
  supportResponseNotes
} from "@/lib/support-content";

export const metadata: Metadata = {
  title: "Support",
  alternates: { canonical: "/support" },
  description:
    "Support and contact center for DoCHEng product guidance, technical help, pricing and access questions, and business enquiries."
};

const orderedSupportCategories = [...supportCategories].sort((a, b) => a.priority - b.priority);

export default function SupportPage() {
  return (
    <>
      <Section className="scroll-mt-24 pb-10 pt-14 sm:pt-20">
        <Reveal>
          <SupportHero
            title="One support layer for product, pricing, access, and technical guidance."
            summary="Use this help center to get routed to the right DoCHEng pathway quickly. Product questions, billing and access requests, technical support, and business enquiries are organized into clear lanes so responses stay focused."
          />
        </Reveal>
      </Section>

      <Section id="categories" className="scroll-mt-24 py-10 sm:py-12">
        <Reveal>
          <SectionEyebrow>Support Categories</SectionEyebrow>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Find the right help lane in one step.</h2>
        </Reveal>

        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {orderedSupportCategories.map((category, index) => (
            <Reveal key={category.slug} delayMs={index * 70}>
              <div id={category.slug} className="scroll-mt-24 h-full">
                <SupportCategoryCard category={category} />
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section id="faq" className="scroll-mt-24 py-10 sm:py-12">
        <Reveal>
          <SectionEyebrow>Quick Answers</SectionEyebrow>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Practical answers to common support questions.</h2>
        </Reveal>

        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          {supportFaqGroups.map((group, index) => (
            <Reveal key={group.slug} delayMs={index * 75}>
              <FAQGroup group={group} />
            </Reveal>
          ))}
        </div>
      </Section>

      <Section id="contact-methods" className="scroll-mt-24 py-10 sm:py-12">
        <Reveal>
          <SectionEyebrow>Contact Pathways</SectionEyebrow>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Use the channel designed for your enquiry.</h2>
        </Reveal>

        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          {supportContactMethods.map((method, index) => (
            <Reveal key={method.slug} delayMs={index * 70}>
              <div id={method.slug === "business-contact" ? "business-pathway" : undefined} className="h-full scroll-mt-24">
                <ContactMethodCard method={method} />
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section className="py-10 sm:py-12">
        <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
          <Reveal>
            <div id="contact-form" className="scroll-mt-24">
              <ContactFormShell enquiryTypes={supportEnquiryTypes} productOptions={supportProductOptions} />
            </div>
          </Reveal>

          <Reveal delayMs={120}>
            <div className="space-y-5">
              {supportResponseNotes.map((note) => (
                <ResponseExpectationNote key={note.title} note={note} />
              ))}
              <Card id="documentation-path" className="space-y-3 bg-[var(--surface-0)]">
                <SectionEyebrow>Documentation Path</SectionEyebrow>
                <h3 className="text-xl font-semibold tracking-tight">Browse setup guides and support articles in one hub.</h3>
                <p className="text-sm leading-relaxed text-[var(--text-subtle)]">
                  Documentation is now live at `/docs` with structured categories for onboarding, product workflows, setup, pricing/access, account, and business pathways.
                </p>
                <DownloadCTAGroup actions={[{ label: "Open Documentation", href: "/docs", variant: "ghost" }]} />
              </Card>
            </div>
          </Reveal>
        </div>
      </Section>

      <Section className="pb-16 pt-10 sm:pb-20 sm:pt-12">
        <Reveal>
          <EscalationStrip
            title="Still need help? We will route you to the right team."
            summary="If your request spans multiple areas, send one structured enquiry and DoCHEng will route it across product, technical, pricing, and business pathways without forcing you to repeat context."
          />
        </Reveal>
      </Section>
    </>
  );
}
