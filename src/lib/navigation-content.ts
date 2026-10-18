import {
  getAppPrimaryAction,
  getAppsForLauncher,
} from "@/lib/ecosystem-manifest";

export type NavigationItem = {
  label: string;
  href: string;
  description?: string;
};

export type NavigationSection = {
  heading: string;
  links: NavigationItem[];
};

export type NavigationGroup = {
  key: string;
  label: string;
  sections: NavigationSection[];
  featured?: NavigationItem;
};

export const homeNavigationItem: NavigationItem = {
  label: "Home",
  href: "/#home",
};

const launcherApps = getAppsForLauncher() ?? [];
const primaryAppLinks: NavigationItem[] = launcherApps
  .slice(0, 3)
  .filter(Boolean)
  .map((app) => {
    const action = getAppPrimaryAction(app);

    return {
      label: app.name,
      href: action.external ? (app.internalRoute ?? "/apps") : action.href,
      description: app.shortDescription,
    };
  });

export const groupedNavigation: NavigationGroup[] = [
  {
    key: "ecosystem",
    label: "Ecosystem",
    sections: [
      {
        heading: "Explore",
        links: [
          {
            label: "Apps Hub",
            href: "/apps",
            description: "Launch and compare app branches.",
          },
          {
            label: "All Products",
            href: "/products",
            description: "Current and planned ecosystem products.",
          },
          {
            label: "Architecture",
            href: "/ecosystem",
            description: "Parent branch system map.",
          },
          {
            label: "Roadmap",
            href: "/roadmap",
            description: "Future branch expansion.",
          },
        ],
      },
      {
        heading: "Core Apps",
        links: primaryAppLinks.length
          ? primaryAppLinks
          : [
              {
                label: "DoCHEng Desk",
                href: "/products/desk",
                description: "Engineering-focused workspace.",
              },
            ],
      },
    ],
    featured: {
      label: "Open Apps Hub",
      href: "/apps",
      description: "View statuses, domains, and access pathways.",
    },
  },
  {
    key: "platform",
    label: "Platform",
    sections: [
      {
        heading: "Access",
        links: [
          {
            label: "Downloads",
            href: "/downloads",
            description: "Desktop and Android distribution.",
          },
          {
            label: "Pricing",
            href: "/pricing",
            description: "Plans and branch access tiers.",
          },
          {
            label: "Account",
            href: "/account",
            description: "Entitlements and account controls.",
          },
        ],
      },
      {
        heading: "Operations",
        links: [
          {
            label: "Changelog",
            href: "/changelog",
            description: "Release and update history.",
          },
          {
            label: "Support",
            href: "/support",
            description: "Assistance and escalation lanes.",
          },
        ],
      },
    ],
  },
  {
    key: "resources",
    label: "Resources",
    sections: [
      {
        heading: "Documentation",
        links: [
          {
            label: "Docs",
            href: "/docs",
            description: "Setup, workflows, and references.",
          },
          {
            label: "Guides",
            href: "/docs#knowledge-base-path",
            description: "Implementation walkthroughs.",
          },
          {
            label: "Knowledge Base",
            href: "/docs#knowledge-base-path",
            description: "Troubleshooting and answers.",
          },
        ],
      },
      {
        heading: "Learning",
        links: [
          {
            label: "Engineering Tools",
            href: "/tools",
            description: "Free calculators with equations and assumptions.",
          },
          {
            label: "Tutorials",
            href: "/docs",
            description: "Step-by-step practical tutorials.",
          },
          {
            label: "Updates",
            href: "/roadmap",
            description: "Latest ecosystem direction.",
          },
        ],
      },
    ],
  },
  {
    key: "company",
    label: "Company",
    sections: [
      {
        heading: "About",
        links: [
          {
            label: "About",
            href: "/about",
            description: "DoCHEng mission and context.",
          },
          {
            label: "Mission / Vision",
            href: "/about",
            description: "Long-term product purpose.",
          },
          {
            label: "Partnerships",
            href: "/support#business-pathway",
            description: "Institutional collaboration paths.",
          },
        ],
      },
      {
        heading: "Connect",
        links: [
          {
            label: "Contact",
            href: "/support#contact-form",
            description: "Send enquiries to the right team.",
          },
          {
            label: "Support",
            href: "/support",
            description: "Get help with products and account.",
          },
        ],
      },
    ],
  },
] as const;
