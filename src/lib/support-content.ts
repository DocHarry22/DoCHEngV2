export type SupportType =
  | "product-support"
  | "technical-help"
  | "pricing-billing"
  | "access-account"
  | "partnership-business"
  | "general-contact"
  | "documentation";

export type SupportAvailability = "open" | "scheduled" | "coming-soon";

export type SupportCategory = {
  title: string;
  slug: string;
  shortDescription: string;
  supportType: SupportType;
  recommendedAction: string;
  contactChannel: string;
  ctaLabel: string;
  ctaHref: string;
  priority: number;
  availability: SupportAvailability;
};

export type FAQItem = {
  question: string;
  answer: string;
};

export type FAQGroup = {
  title: string;
  slug: string;
  items: FAQItem[];
};

export type ContactMethod = {
  title: string;
  slug: string;
  summary: string;
  channel: string;
  responseWindow: string;
  bestFor: string;
  ctaLabel: string;
  ctaHref: string;
};

export type SupportResponseNote = {
  title: string;
  body: string;
};

export const supportCategories: SupportCategory[] = [
  {
    title: "Product support",
    slug: "product",
    shortDescription: "Choose the right branch and get guidance for setup, workflow fit, and rollout stages.",
    supportType: "product-support",
    recommendedAction: "Start with product context, then route to technical or access support if needed.",
    contactChannel: "Support form + product follow-up",
    ctaLabel: "Get Product Guidance",
    ctaHref: "#contact-form",
    priority: 1,
    availability: "open"
  },
  {
    title: "Technical help",
    slug: "technical",
    shortDescription: "Solve install, update, runtime, and release-channel issues across Desktop and Android.",
    supportType: "technical-help",
    recommendedAction: "Include platform, product branch, and current version for faster triage.",
    contactChannel: "Technical support queue",
    ctaLabel: "Request Technical Help",
    ctaHref: "#contact-form",
    priority: 2,
    availability: "open"
  },
  {
    title: "Pricing and billing",
    slug: "pricing-access",
    shortDescription: "Get help comparing models, understanding entitlements, and resolving billing questions.",
    supportType: "pricing-billing",
    recommendedAction: "Share your current plan and branch goals to get precise recommendations.",
    contactChannel: "Pricing support queue",
    ctaLabel: "Ask A Pricing Question",
    ctaHref: "#contact-form",
    priority: 3,
    availability: "open"
  },
  {
    title: "Access and account",
    slug: "account",
    shortDescription: "Fix sign-in, entitlement, and account access issues across branch products.",
    supportType: "access-account",
    recommendedAction: "Use the account email and branch slug to accelerate access validation.",
    contactChannel: "Account support queue",
    ctaLabel: "Resolve Account Access",
    ctaHref: "#contact-form",
    priority: 4,
    availability: "open"
  },
  {
    title: "Partnerships and business",
    slug: "business",
    shortDescription: "Open structured conversations for pilots, institutional rollouts, and strategic collaborations.",
    supportType: "partnership-business",
    recommendedAction: "Share organization context, timeline, and branch focus for the first call.",
    contactChannel: "Business enquiry lane",
    ctaLabel: "Start Business Enquiry",
    ctaHref: "#business-pathway",
    priority: 5,
    availability: "open"
  },
  {
    title: "General contact",
    slug: "general",
    shortDescription: "Reach DoCHEng for ecosystem-level questions not tied to a single branch.",
    supportType: "general-contact",
    recommendedAction: "Use this for parent-brand, ecosystem, or navigation questions.",
    contactChannel: "General support queue",
    ctaLabel: "Contact DoCHEng",
    ctaHref: "#contact-methods",
    priority: 6,
    availability: "open"
  },
  {
    title: "Documentation and guides",
    slug: "documentation",
    shortDescription: "Central hub for setup guides, release notes, troubleshooting playbooks, and support-linked articles.",
    supportType: "documentation",
    recommendedAction: "Start in docs for self-service answers, then escalate through support when your issue needs direct intervention.",
    contactChannel: "Documentation hub",
    ctaLabel: "Open Documentation Hub",
    ctaHref: "/docs",
    priority: 7,
    availability: "open"
  }
];

export const supportFaqGroups: FAQGroup[] = [
  {
    title: "Product and fit",
    slug: "faq-product",
    items: [
      {
        question: "How do I choose the right DoCHEng product?",
        answer:
          "Start with the branch outcome: Desk for technical workspace execution, Resume for career positioning, and Compass for academic pathway planning. If uncertain, send your use case through product support and we will map the right branch path."
      },
      {
        question: "Can I use more than one branch?",
        answer:
          "Yes. Branches are designed to stay aligned through the parent ecosystem while serving different execution workflows."
      }
    ]
  },
  {
    title: "Pricing, billing, and access",
    slug: "faq-pricing",
    items: [
      {
        question: "Where do I ask pricing or plan questions?",
        answer:
          "Use pricing support in this hub. Include your current branch and expected usage so recommendations align with your execution context."
      },
      {
        question: "How do I resolve access issues after sign-in?",
        answer:
          "Use account support and include the email on your account plus the affected branch. Entitlement validation is then routed to the access queue."
      }
    ]
  },
  {
    title: "Technical and business",
    slug: "faq-technical-business",
    items: [
      {
        question: "Where do I get technical help?",
        answer:
          "Use technical support for install failures, runtime errors, version mismatch, or release channel confusion. Include product slug, platform, and version to accelerate triage."
      },
      {
        question: "Who handles partnerships or business enquiries?",
        answer:
          "Use the business pathway for pilots, institutional discussions, and strategic partnerships. This lane is separate from general support to keep responses focused."
      }
    ]
  }
];

export const supportContactMethods: ContactMethod[] = [
  {
    title: "General and product enquiries",
    slug: "general-product",
    summary: "Best for product selection, ecosystem direction, and initial support routing.",
    channel: "Support form",
    responseWindow: "Typically within 1-2 business days",
    bestFor: "General questions, product fit, and first-time guidance",
    ctaLabel: "Use Support Form",
    ctaHref: "#contact-form"
  },
  {
    title: "Pricing, billing, and access",
    slug: "pricing-access-contact",
    summary: "Structured path for plan comparisons, billing clarifications, and account access issues.",
    channel: "Pricing and access queue",
    responseWindow: "Typically within 1 business day",
    bestFor: "Billing, entitlements, plan mapping, and account-level issues",
    ctaLabel: "Open Pricing Support",
    ctaHref: "#contact-form"
  },
  {
    title: "Business and partnerships",
    slug: "business-contact",
    summary: "For organizations evaluating pilots, deployment partnerships, or branch integrations.",
    channel: "Business enquiry lane",
    responseWindow: "Typically within 2-3 business days",
    bestFor: "Partnerships, institutional pilots, and strategic collaborations",
    ctaLabel: "Start Business Enquiry",
    ctaHref: "#business-pathway"
  }
];

export const supportResponseNotes: SupportResponseNote[] = [
  {
    title: "Response expectations",
    body: "Support requests are triaged by enquiry type and branch context. Complete submissions with product, platform, and use-case details are prioritized for faster resolution."
  },
  {
    title: "Documentation expansion",
    body: "The docs hub now hosts structured setup and support articles, and it can expand by category without changing support IA."
  }
] as const;

export const supportEnquiryTypes = [
  { value: "general", label: "General enquiry" },
  { value: "product", label: "Product question" },
  { value: "pricing", label: "Pricing or billing" },
  { value: "technical", label: "Technical support" },
  { value: "business", label: "Partnership or business" },
  { value: "account", label: "Account or access" }
] as const;

export const supportProductOptions = [
  { value: "desk", label: "DoCHEng Desk" },
  { value: "resume", label: "DoCHEng Resume" },
  { value: "compass", label: "DoCHEng Compass" },
  { value: "ecosystem", label: "Parent ecosystem" }
] as const;
