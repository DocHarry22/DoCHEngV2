// Original application screenshots. Private-preview examples use fictional documents.
// Captions distinguish public entry pages from preview workflows.
export const productPreviews: Record<
  string,
  { url: string; caption: string }[]
> = {
  paperplane: [
    { url: "/screenshots/paperplane-editor.png", caption: "Paperplane PDF editor with a fictional project brief, page navigation and editing controls." },
    { url: "/screenshots/paperplane-organize.png", caption: "Organize a fictional three-page PDF using page previews, reordering, rotation and page controls." },
    { url: "/screenshots/paperplane-forms.png", caption: "A fictional volunteer form filled locally in Paperplane, with the completed PDF ready to download." },
    { url: "/screenshots/paperplane-workflows.png", caption: "A saved browser workflow chains compression, a review watermark and page numbers for a fictional document." },
    { url: "/screenshots/paperplane-tools.png", caption: "Paperplane’s current tool library includes 24 browser tools, category filters and search." },
    { url: "/screenshots/paperplane-pricing.png", caption: "The private preview’s ZAR plan comparison: Free R0, draft Pro R99 and Business R249 per 30 days. Paid checkout is disabled." },
  ],
  desk: [
    {
      url: "/screenshots/desk.png",
      caption:
        "DoCHEng Desk v2 public sign-in page. Authenticated research workflows are not shown.",
    },
  ],
  resume: [
    {
      url: "/screenshots/resume-builder.png",
      caption:
        "CareerForge résumé builder: editable sections and a live A4 preview. Fictional example details.",
    },
    {
      url: "/screenshots/resume-templates.png",
      caption: "Choose from eight résumé layouts, with category filters and previews. The gallery uses fictional sample documents.",
    },
    {
      url: "/screenshots/resume-cover-letter.png",
      caption: "CareerForge cover-letter editor with guided writing steps and a live document preview. Fictional example details.",
    },
    {
      url: "/screenshots/resume-workspace.png",
      caption: "The browser workspace brings documents, applications and career tools together on this device.",
    },
    {
      url: "/screenshots/resume-checker.png",
      caption: "The current résumé checker accepts PDF and DOCX documents, with Basic, ATS and Expert feedback options.",
    },
    {
      url: "/screenshots/resume-career-plan.png",
      caption: "Create a 90-day career plan with editable goals, tasks and milestones, saved in this browser.",
    },
  ],
  "apologia-sancta": [
    { url: "/screenshots/apologia-galaxy-3d.png", caption: "The live 3D Galaxy with orbit and zoom controls, selected-node details and source context. Compatibility mode and prototype connection weights are shown." },
    { url: "/screenshots/apologia-galaxy-2d.png", caption: "The same curated argument map in 2D, with typed connections, visible-node navigation and editorial status." },
    { url: "/screenshots/apologia-graph.png", caption: "Apologia Graph’s research record with a source dossier, historical timeline and explicit editorial review state." },
    { url: "/screenshots/apologia-library.png", caption: "The public bundled library lists 22 topics, 265 questions and 494 cited references, with search and category filters." },
    { url: "/screenshots/apologia-trivia-questions.png", caption: "A real Christology question collection with multiple-choice options expanded. Library browsing does not reveal the correct answer or award a score." },
    { url: "/screenshots/apologia-trivia-live.png", caption: "The live-trivia room selector. Players choose an available host room before joining; no room was joined or score created for this screenshot." },
    { url: "/screenshots/apologia-research.png", caption: "The current research hub links to the Galaxy, Timeline, Compare and Debate, and reports the Knowledge Engine’s unavailable state." },
  ],
  "thasi-etoile": [
    {
      url: "/screenshots/thasi-etoile.png",
      caption:
        "Thasi Étoile public boutique storefront. Store transactions and fulfilment are independently operated.",
    },
  ],
  "water-nest": [
    {
      url: "/screenshots/water-nest.png",
      caption:
        "Water Nest’s public homepage, captured on 18 October 2026. Its current deployed build and storefront content were checked again on 23 October. Marketing claims shown are the store’s statements.",
    },
  ],
};
