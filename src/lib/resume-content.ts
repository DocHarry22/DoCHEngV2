// Live interfaces checked on 21 October 2026. Optional backup prices come from
// CareerForge's prepared commerce catalogue; those plans are not published yet.
export const resumeAppUrl = "https://resume.docheng.co.za";

export const resumeFeatures = [
  {
    title: "Build a CV that feels like you",
    description:
      "Write with a live A4 preview, arrange your sections, add a photo and adjust colours, fonts and spacing. Choose from Modern, Classic, Minimal, Professional, Creative, Elegant, Executive and Technical layouts.",
    path: "/builder/?new=1",
    action: "Open the résumé builder",
  },
  {
    title: "Write a matching cover letter",
    description:
      "Work through your details, the recipient, the opportunity and your letter with guided steps, six letterhead designs and a live preview. Save separate letters for different applications.",
    path: "/cover-letter/",
    action: "Create a cover letter",
  },
  {
    title: "Check your résumé and job fit",
    description:
      "Upload a PDF or DOCX up to 2 MB. Choose Basic, ATS or Expert feedback and add a job description to review relevant terms, structure and writing. Feedback helps you edit; it does not predict hiring decisions.",
    path: "/resume-scanner/",
    action: "Try the résumé checker",
  },
  {
    title: "Keep your job search together",
    description:
      "Organize résumés and letters in your browser workspace. Search supported job sources, save opportunities, track application stages and prepare application documents for your own review and submission.",
    path: "/dashboard/",
    action: "Explore your workspace",
  },
  {
    title: "Tailor, compare and keep versions",
    description:
      "Create a separate résumé for each role, compare the wording with a job description and keep document snapshots in version history. Compare your own pay scenarios with the salary analyzer.",
    path: "/tailor/",
    action: "Explore résumé tailoring",
  },
  {
    title: "Plan your next step and practise",
    description:
      "Build an editable 90-day career plan with milestones and tasks. Prepare interview answers with Situation, Task, Action and Result prompts, rehearse with a timer and download your notes.",
    path: "/career-plan/",
    action: "Start a career plan",
  },
];

export const resumeBackupPlans = [
  { name: "Free", zar30: "R0", zar365: "R0", usd30: "$0", usd365: "$0", backups: 1 },
  { name: "Plus", zar30: "R19", zar365: "R190", usd30: "$1.49", usd365: "$14.90", backups: 10 },
  { name: "Pro", zar30: "R39", zar365: "R390", usd30: "$2.99", usd365: "$29.90", backups: 50 },
] as const;

export const resumeFaq = [
  {
    question: "What can I use for free?",
    answer:
      "The browser career tools, all eight résumé layouts, cover letters, local document library, job tracker, tailoring, career plans and interview practice are free. You can start without an account or payment card.",
  },
  {
    question: "Where is my work saved?",
    answer:
      "Drafts save in this browser on this device. Download editable JSON backups before clearing browser data or moving to another device, then import them to continue. Cloud accounts and automatic cross-device sync are not available in the current live edition.",
  },
  {
    question: "What can I import and download?",
    answer:
      "Import an existing PDF, DOCX or TXT through the document service, or restore a JSON backup in your browser. The editor offers PDF, DOCX, TXT and JSON downloads. Print / Save PDF preserves the live template design; service-generated exports can use a different layout. Imports, checking and service exports depend on document service availability.",
  },
  {
    question: "Are Plus and Pro available to buy?",
    answer:
      "Not yet. The prices shown here preview optional cloud-backup plans. Paid passes would add backup capacity for 30 or 365 days with one payment and no automatic renewal. Account services and checkout still need to be published and connected. Your browser career tools remain free.",
  },
  {
    question: "Does Auto Apply submit applications for me?",
    answer:
      "The application workspace prepares your chosen documents and a review queue for supported employer postings. You review the application on the employer’s site and make the final submission yourself. A job search or prepared application is not a confirmed submission.",
  },
];
