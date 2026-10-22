// Public interfaces checked on 22 October 2026. No paid offer is published.
export const apologiaAppUrl = "https://sandybrown-bear-488955.hostingersite.com";
export const apologiaGraphUrl = "https://mediumvioletred-kingfisher-797460.hostingersite.com";

export const apologiaFeatures = [
  {
    title: "Explore the 3D Galaxy",
    description: "Orbit, pan and zoom around a connected argument map. Select a proposition, objection, response or source to inspect its context. Adjust exploration depth, use the keyboard-accessible node list, or switch to the 2D view.",
    href: apologiaGraphUrl + "/graph",
    action: "Open the 3D Galaxy",
  },
  {
    title: "Follow the graph to its sources",
    description: "Browse apologetics topics by tradition and subject. Open an argument’s overview, Catholic response, source dossier and historical timeline. Follow reference links, copy citations, bookmark records or export a research record.",
    href: apologiaGraphUrl + "/",
    action: "Browse Apologia Graph",
  },
  {
    title: "Browse the question library",
    description: "Search 22 topics and 265 questions with 494 cited references in the current bundled catalogue. Filter by subject, difficulty, era and content type; open a collection to browse questions and expand their multiple-choice options.",
    href: apologiaAppUrl + "/library/",
    action: "Explore the library",
  },
  {
    title: "Join Catholic trivia and live quizzes",
    description: "Choose a host’s room or use a shared room link. The quiz interface brings timed multiple-choice questions, locked answer selections, teaching moments and room or global rankings together. Live play and scoring require an available quiz service and an active room.",
    href: apologiaAppUrl + "/mobile/",
    action: "Open live trivia",
  },
  {
    title: "Research with context",
    description: "Move between claims, objections, responses and evidence. The research hub also provides Timeline, Compare, Debate and saved-journey entry points. These advanced modes depend on the Knowledge Engine; the current graph runs with its curated compatibility catalogue.",
    href: apologiaAppUrl + "/research/",
    action: "Visit the research hub",
  },
  {
    title: "Learn across your devices",
    description: "Use the browser experience, install the web app where supported, or choose the published Android wrapper. Learning programmes and official progress depend on published lessons, an account and the learning service; the current live learning catalogue has no published lessons yet.",
    href: apologiaAppUrl + "/learn/",
    action: "Check the learning catalogue",
  },
] as const;

export const apologiaAvailability = [
  { feature: "Library and question collections", status: "Public beta", detail: "Bundled topics and questions can be browsed without signing in. Answers are hidden in library browsing." },
  { feature: "Graph and 3D / 2D views", status: "Available in compatibility mode", detail: "The curated catalogue and visual map are accessible. Records still display their editorial review state." },
  { feature: "Live trivia", status: "Room and connection required", detail: "Choose an available room. A preview question or timer before joining is not proof of an active scored game." },
  { feature: "Learning and advanced research", status: "Service dependent", detail: "The Knowledge Engine was unavailable during this check. No live lessons were published, and solo practice could not load." },
] as const;

export const apologiaFaq = [
  {
    question: "What does Apologia Sancta cost?",
    answer: "The current public library and graph can be opened without a checkout. No paid plan prices or subscription checkout are published in these interfaces, so this page does not quote an unconfirmed price or sell access. Availability and future pricing may change during the beta.",
  },
  {
    question: "Are the graph’s connection weights truth scores?",
    answer: "No. The current strength overlays are labelled as prototypes or structural estimates. They help visualize connections; they do not establish that a theological claim is true, accepted or reviewed. Check the record’s sources and editorial status. Seed catalogue records still require accountable theological and primary-source review.",
  },
  {
    question: "How are the 3D Galaxy and 2D graph different?",
    answer: "They offer two views of the same selected argument map. The 3D view supports orbit, pan and zoom; the 2D view provides a flatter layout. Selecting a node opens its details and source context. A keyboard-accessible node list provides another way to navigate the visible graph.",
  },
  {
    question: "Can I practise or play trivia offline?",
    answer: "The bundled library provides a question-browsing fallback when the Engine is unavailable. Live trivia, accepted answers, rankings and official learning progress require the relevant online services. The separate solo-practice service could not load during this check, so offline scored practice is not advertised here.",
  },
  {
    question: "Where are bookmarks and research paths saved?",
    answer: "Guest graph bookmarks and paths save in this browser on this device. Account-backed research saves require the learner-account connection and available services. Guest data does not upload automatically. Keep exported copies of work you want to retain before clearing browser storage or changing devices.",
  },
  {
    question: "Can I install it on Android or iPhone?",
    answer: "Android 1.0.3 is the currently published APK and is listed in the DoCHEng download centre as a preview. Its published file and checksum are verified; installation and signing have not been independently accepted here. It wraps the hosted app and still depends on its services. Supported browsers can install the web app; on iPhone, use Safari’s Add to Home Screen.",
  },
] as const;
