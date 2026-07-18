import type { LocaleCopy } from "./types";

export const enCopy = {
  copyUpdatedAt: "2026-07-12",
  profile: {
    headline: "I study AI systems\nand build software for research.",
    shortBio: "Right now, I’m interested in experiment infrastructure for vision-language-action models and better ways to read, revisit, and connect papers.",
    aboutIntroduction: "I have a software background, and I’m learning about AI by building experiments and research tools.",
    bio: [
      "I’m interested not only in models, but also in the process around them: setting up experiments, checking results, and preserving enough context to revisit the work later.",
      "I use this site to organize projects, notes, and papers that are ready to be shared publicly."
    ],
    researcherValues: [
      "I leave a clear note when I do not understand something yet.",
      "I record experiment settings together with their results.",
      "I keep failed attempts when the reason is useful.",
      "I check automated results myself."
    ]
  },
  systemArchitecture: {
    eyebrow: "How this site works",
    title: "From private notes to the public site",
    fullTitle: "Publishing workflow: from private notes to the public site",
    description: "Papers and writing begin in private repositories. Studio reviews what should be shared, builds a public record, and the website presents it.",
    stages: {
      sources: "Private sources",
      control: "Review and publish",
      projection: "Public record",
      presentation: "Presentation"
    },
    badges: {
      private: "Private",
      public: "Public",
      optional: "Optional"
    },
    repositories: {
      "paper-lab": {
        title: "Paper notes",
        role: "Private paper workspace",
        description: "Stores paper notes, reading sessions, reviews, and oral practice.",
        responsibilities: ["Paper notes", "Reading sessions", "Reviews", "Oral-practice source", "Implementation attempts"],
        exclusions: ["Website UI", "Blog drafts", "Public deployment"]
      },
      writing: {
        title: "Writing",
        role: "Private writing workspace",
        description: "Stores drafts, English and Korean versions, and writing assets.",
        responsibilities: ["Blog drafts", "Translations", "Writing assets", "Series metadata"],
        exclusions: ["Paper review records", "Public website UI", "Generated feed output"]
      },
      studio: {
        title: "Gnaroshi Studio",
        role: "Review and publishing control",
        description: "Creates and reviews content, tracks changes, and publishes selected material.",
        responsibilities: ["macOS app", "CLI", "Shared contracts", "Git operations", "Validation", "Publisher"],
        exclusions: ["Canonical notes", "Website presentation", "Worker runtime"]
      },
      api: {
        title: "AI service",
        role: "Optional AI request service",
        description: "Optionally handles paper review and oral-practice requests.",
        responsibilities: ["AI request handling", "Session generation", "Scoring", "Rate limits", "CORS"],
        exclusions: ["Canonical content", "Website rendering", "Publishing"]
      },
      "content-feed": {
        title: "Public content",
        role: "Generated public record",
        description: "Generated data containing only the material selected for publication.",
        responsibilities: ["Public generated records", "Public assets", "Manifest", "Public snapshots"],
        exclusions: ["Drafts", "Private notes", "Full transcripts", "Manual editing"]
      },
      website: {
        title: "Website",
        role: "Presentation and deployment",
        description: "Presents the public content in English and Korean and deploys it to gnaroshi.dev.",
        responsibilities: ["Routes", "Presentation", "Localization", "SEO", "Accessibility", "GitHub Pages deployment"],
        exclusions: ["Canonical authoring", "AI generation", "Private repository access"]
      }
    },
    responsibilityLabel: "What belongs here",
    exclusionsLabel: "What stays elsewhere",
    repositoryLinkLabel: "Open public repository",
    boundariesTitle: "Repository boundaries",
    cta: "See the full architecture",
    explorer: {
      instruction: "Select a repository to trace what feeds it, what it feeds, and what stays outside its boundary.",
      selectLabel: "Inspect repository",
      selectedLabel: "Selected repository",
      upstreamLabel: "Upstream",
      downstreamLabel: "Downstream",
      boundaryLabel: "What stays elsewhere",
      noneLabel: "None",
      clearLabel: "Clear selection",
      clearedStatus: "Repository selection cleared."
    },
    buildDetails: {
      title: "Current public build",
      websiteCommit: "Website commit",
      contentFeedCommit: "Content feed commit",
      builtAt: "Built",
      feedSchema: "Feed schema",
      unavailable: "Unavailable"
    }
  },
  managedApplications: {
    eyebrow: "Studio applications",
    title: "Independent apps coordinated by Studio",
    description: "These applications are not part of the website publishing chain. Studio can check, open, or preview a handoff to them, but each app remains independently runnable and keeps its own data.",
    caption: "Managed relationships use versioned status, launch, and preview contracts. They do not share private databases or embed another app’s full interface.",
    studio: { title: "Gnaroshi Studio", role: "Discovery, status, launch, and handoff previews" },
    applications: {
      paperflow: { title: "PaperFlow", role: "Paper-library planning and import previews" },
      "arxiv-discovery": { title: "Arxiv Discovery", role: "Recent-paper candidates" },
      runshelf: { title: "RunShelf", role: "Experiment-run summaries" },
      "tr-gpu-monitor": { title: "TR GPU Monitor", role: "Sanitized compute status" },
      contentdeck: { title: "ContentDeck", role: "Media and listening sessions" }
    }
  },
  researchAreas: {
    "practical-vla-systems": {
      question: "What kind of experiment structure makes different VLA models comparable on common ground?",
      motivation: "Different VLA repositories organize models, environments, and results in different ways. That makes the same experiment difficult to run and inspect across models.",
      hypothesis: "I’m testing whether a shared run structure can make comparisons clearer while small adapters keep model-specific behavior visible.",
      uncertainty: "The shared structure still needs to preserve details that affect correctness.",
      relatedLabels: ["gnaroshi_vla"]
    },
    "efficient-model-execution": {
      question: "How can computation be reduced without hiding changes in model behavior?",
      motivation: "Saving computation matters only when the resulting behavior can still be checked. Reused state and approximations need clear boundaries.",
      hypothesis: "I’m looking at explicit reuse and update paths that can be measured across experiments.",
      uncertainty: "The useful boundary may change with the model, observation history, and action decoder.",
      relatedLabels: ["Experiment setup"]
    },
    "human-ai-research-tools": {
      question: "How can AI tools support research without replacing the researcher’s judgment?",
      motivation: "Generated summaries and scores can save time, but they can also hide uncertainty. The original question and the researcher’s own check still need to remain visible.",
      hypothesis: "I’m exploring tools that help organize notes, suggest questions, and make revisiting easier without deciding what is true on the researcher’s behalf.",
      uncertainty: "The right amount of structure will only become clear through repeated use.",
      relatedLabels: ["Writing", "Reading"]
    }
  },
  projects: {
    "gnaroshi-vla": {
      title: "gnaroshi_vla",
      summary: "A workspace for running and comparing different VLA models through a clearer, shared experiment structure.",
      statusLabel: "In progress",
      problem: "VLA experiments are hard to compare when model code, method changes, environment setup, launch scripts, and results are tied to one repository layout.",
      designGoals: [
        "Keep model-specific integration behind small, explicit adapters.",
        "Separate shared methods from model and environment settings.",
        "Save enough context to understand how each run was configured.",
        "Keep result locations clear without treating unchecked output as a conclusion."
      ],
      architecture: [
        "architectures/ contains model adapters and preserved upstream integration points.",
        "methods/ contains methods that can be used across model integrations.",
        "configs/ separates model, method, environment, experiment, and node settings.",
        "scripts/ and tools/ record run context, environment snapshots, checks, and result locations."
      ],
      supportedAdapters: [
        "Seer integration with dedicated configuration and wrappers.",
        "SimVLA integration with dedicated configuration and wrappers."
      ],
      reproducibility: [
        "Composed configuration records the model, method, environment, experiment, and node choice.",
        "Run manifests and environment snapshots preserve the context needed to inspect a run.",
        "Results use explicit model and experiment directories."
      ],
      studioRelationship: "",
      currentState: "The public repository currently contains Seer and SimVLA integration structure, shared method modules, and tools for recording run context. It does not present benchmark results. Third-party attribution is documented in the repository.",
      openProblems: [
        "Find the smallest adapter interface that still represents each model correctly.",
        "Compare efficiency methods with consistent run manifests and reviewed results.",
        "Clarify repository-level licensing before reuse beyond the documented upstream components."
      ],
      relatedWriting: [],
      linkLabels: { repository: "Repository" }
    },
    "gnaroshi-dev": {
      title: "gnaroshi.dev",
      summary: "A personal website where papers and writing are drafted privately and only selected material is published.",
      statusLabel: "In progress",
      problem: "I wanted a personal site where writing and paper notes could be prepared privately without turning the website repository into the place where unfinished work lives.",
      designGoals: [
        "Keep unfinished paper notes and writing outside the public website repository.",
        "Publish only fields and entries that have been selected for the public site.",
        "Keep English and Korean pages structurally consistent.",
        "Hide activity views until there is enough real material to make them useful."
      ],
      architecture: [
        "Gnaroshi Studio saves changes in the private paper and writing repositories.",
        "The publisher builds a sanitized, deterministic public content feed with source commit metadata.",
        "The presentation-only Astro website validates and renders that feed.",
        "GitHub Actions deploys the static build and verifies the imported feed commit."
      ],
      supportedAdapters: [],
      reproducibility: [
        "The feed manifest records source commits, counts, schema version, and a content hash.",
        "The website records the exact feed commit in metadata and build-info.json.",
        "The public website workflow never checks out private repositories."
      ],
      studioRelationship: "",
      currentState: "The website reads blog and paper content only from the public feed. Authoring, review generation, private metrics, and API endpoints remain in separately owned repositories.",
      openProblems: [
        "Publish the first article after editorial review.",
        "Publish the first paper note after it has been written and reviewed by the owner.",
        "Keep the public site understandable as more records are added."
      ],
      relatedWriting: ["first-post", "paper-reading-method", "research-workflow"],
      linkLabels: { repository: "Repository", "live-site": "Live site" }
    },
    "gnaroshi-studio": {
      title: "Gnaroshi Studio",
      summary: "A local authoring and coordination app for reviewing research material, publishing selected work, and checking independently run companion apps.",
      statusLabel: "In development",
      problem: "Research notes, writing, publishing, and supporting tools need clear boundaries so one control screen does not become a second owner of every app’s data.",
      designGoals: [
        "Keep paper and writing authoring local and explicit.",
        "Show whether a companion app is available and what action is valid next.",
        "Use preview-first handoffs instead of direct cross-app writes.",
        "Keep each managed application independently runnable."
      ],
      architecture: [
        "The desktop app and CLI share typed contracts for application discovery, status, health, launch, and safe handoff previews.",
        "Adapters report unavailable or incompatible states without blocking the rest of Studio.",
        "Publishing repositories and managed applications remain two separate relationships."
      ],
      supportedAdapters: [],
      reproducibility: [
        "Versioned manifests declare app identity and supported entry points without tracked secrets or machine paths.",
        "Fixture tests cover missing apps, invalid manifests, timeouts, malformed responses, and upgrades while Studio is open."
      ],
      studioRelationship: "Studio is the control plane in this group: it discovers, checks, launches, and previews handoffs, while each application keeps ownership of its own data and full workflow.",
      currentState: "Authoring and publishing responsibilities are established, and the Managed Apps layer has typed contracts, adapters, CLI commands, and unavailable-state tests. Provider releases and final visual and package checks still precede a public Managed Apps release.",
      openProblems: [
        "Release provider contracts before enabling their capabilities in a Studio release.",
        "Complete owner review of application screenshots and role icons.",
        "Finish manual package and light/dark appearance checks."
      ],
      relatedWriting: [],
      linkLabels: {}
    },
    paperflow: {
      title: "PaperFlow",
      summary: "A macOS app and CLI for inspecting a Zotero library, planning organization changes, and previewing paper imports before anything is applied.",
      statusLabel: "Usable locally",
      problem: "A paper library can be difficult to reorganize safely when the proposed changes are mixed with database writes, renames, or deletion.",
      designGoals: [
        "Read Zotero through its local API without editing zotero.sqlite.",
        "Keep scan, plan, report, and import preview understandable on their own.",
        "Never delete or rename automatically.",
        "Require an explicit boundary before applying a reviewed plan."
      ],
      architecture: [
        "The Python CLI provides human-readable commands and versioned JSON status, doctor, scan, planning, and dry-run import responses.",
        "The SwiftUI/AppKit app remains a standalone macOS interface over the same safety rules.",
        "Handoffs accept selected files, URLs, arXiv identifiers, or metadata candidates and return a typed preview result."
      ],
      supportedAdapters: [],
      reproducibility: [
        "Machine-readable output keeps data on stdout, diagnostics on stderr, and returns non-zero status on errors.",
        "Regression fixtures record command output and the dry-run/apply boundary."
      ],
      studioRelationship: "Studio may request a scan, open PaperFlow, or preview a selected paper handoff. PaperFlow alone reads Zotero and owns any reviewed apply step.",
      currentState: "Library scanning, organization planning, reports, and preview imports work independently. The Studio-safe manifest, JSON commands, and handoff contract are implemented for review; final release and visual checks remain.",
      openProblems: [
        "Complete final macOS package and appearance checks.",
        "Keep the explicit apply boundary visible as the integration reaches users.",
        "Approve production screenshots and the application role icon."
      ],
      relatedWriting: [],
      linkLabels: { repository: "Repository" }
    },
    "arxiv-discovery": {
      title: "Arxiv Discovery",
      summary: "A command-line and local web tool for finding recent papers, optionally translating them, and reviewing candidates before download or handoff.",
      statusLabel: "Prototype",
      problem: "Daily paper discovery can create unwanted downloads or hide scheduling assumptions when fetching, translation, and review are tied together.",
      designGoals: [
        "Keep the existing process, serve, and all commands available.",
        "Make discovery return candidates without downloading by default.",
        "Keep categories, time window, cutoff, and result limits configurable.",
        "Require a preview before sending a candidate to another paper tool."
      ],
      architecture: [
        "A typed Python package provides discover, translate, serve, export, and doctor commands while main.py remains a compatibility wrapper.",
        "The existing Flask interface remains the standalone local review screen.",
        "Versioned candidate JSON includes source links and translation state without a local PDF path unless a download was requested."
      ],
      supportedAdapters: [],
      reproducibility: [
        "Explicit none, selected, and all download modes make file creation visible.",
        "Tests cover legacy commands, candidate schema, configurable discovery, and preview-only handoffs."
      ],
      studioRelationship: "Studio can start discovery, filter returned candidates, open arXiv, and preview a PaperFlow or Paper Lab handoff. The crawler remains responsible for discovery and any explicit download.",
      currentState: "Legacy commands and the Flask UI remain available. The packaged CLI can return versioned candidates with download disabled, and explicit download modes are covered by tests; release and UI review remain.",
      openProblems: [
        "Complete the provider release before Studio advertises discovery as available.",
        "Finish theme and workflow-state review for the local web UI.",
        "Approve a representative discovery screenshot."
      ],
      relatedWriting: [],
      linkLabels: { repository: "Repository" }
    },
    runshelf: {
      title: "RunShelf",
      summary: "A local run ledger for finding experiment records, inspecting selected metadata and metrics, and keeping large artifacts in their original locations.",
      statusLabel: "In development",
      problem: "Experiment records become hard to revisit when run metadata, results, and large artifact locations are not indexed together.",
      designGoals: [
        "Treat run metadata as a transparent local record rather than copying checkpoints into another app.",
        "Distinguish running, failed, completed, stale, and incomplete records.",
        "Keep artifact references local to RunShelf.",
        "Remain a run browser rather than an experiment launcher."
      ],
      architecture: [
        "The standalone desktop app indexes runs and presents metadata, metrics, lineage, and artifact references.",
        "Read-only provider responses expose recent and selected run summaries without private remote paths.",
        "Large files and checkpoints stay at their source locations."
      ],
      supportedAdapters: [],
      reproducibility: [
        "Run summaries keep stable identifiers, source commit context, timing, status, and selected metrics when present.",
        "Integration fixtures verify recent-run and unavailable states without moving artifacts."
      ],
      studioRelationship: "Studio can show a small recent-run summary and launch RunShelf. RunShelf remains the run browser and the owner of run indexing and artifact references.",
      currentState: "Run discovery, display, metadata, metrics, and artifact references remain in the standalone app. Read-only status and summary providers are implemented; opening a selected run from Studio is not yet available.",
      openProblems: [
        "Add a stable selected-run route before offering an Open run action in Studio.",
        "Complete release, package, and application identity review.",
        "Approve an actual run-view screenshot with non-sensitive data."
      ],
      relatedWriting: [],
      linkLabels: {}
    },
    "tr-gpu-monitor": {
      title: "TR GPU Monitor",
      summary: "A macOS monitor for checking NVIDIA GPU hosts over SSH while keeping host credentials and detailed process information inside the monitor.",
      statusLabel: "Usable locally",
      problem: "Remote compute status needs to be visible without giving a coordinating app SSH keys, passwords, raw shell access, or sensitive command lines.",
      designGoals: [
        "Keep host authentication and saved configuration in the monitor.",
        "Show reachability, stale data, utilization, memory, temperature, power, and workload state clearly.",
        "Send Studio only an actionable sanitized summary.",
        "Keep process control and arbitrary remote commands out of the first integration."
      ],
      architecture: [
        "The SwiftUI macOS app polls configured remote NVIDIA hosts over SSH and owns notifications and detailed monitoring.",
        "The JSON status provider removes credentials and sensitive process arguments.",
        "Studio actions are limited to refresh, opening a host, and opening the full monitor."
      ],
      supportedAdapters: [],
      reproducibility: [
        "Sanitized fixtures cover reachable, unreachable, stale, warning, and no-data states.",
        "Provider validation rejects credential and private-path fields."
      ],
      studioRelationship: "Studio receives a brief health summary and can open the full monitor. Host configuration, credentials, detailed processes, and notifications stay in TR GPU Monitor.",
      currentState: "Standalone host and GPU monitoring, notifications, and error states remain available. A sanitized read-only status provider and manifest are implemented for review; release and package checks remain.",
      openProblems: [
        "Complete final monitor package and menu-bar identity checks.",
        "Verify representative remote-host states without exposing private host data.",
        "Approve an actual sanitized monitoring screenshot."
      ],
      relatedWriting: [],
      linkLabels: {}
    },
    contentdeck: {
      title: "ContentDeck",
      summary: "A web and Electron player for opening supported media, repeating full or selected segments, and using subtitles during listening practice.",
      statusLabel: "Usable locally",
      problem: "Repeated listening is awkward when provider detection, subtitle availability, and loop boundaries are spread across separate tools.",
      designGoals: [
        "Keep the existing web and Electron workflows.",
        "Validate external media input and keep remote pages away from Node and shell access.",
        "Let playback, loop, and subtitle state remain owned by ContentDeck.",
        "Use only HTTPS media links in the Studio handoff."
      ],
      architecture: [
        "The React web interface and Electron app share provider detection and playback state.",
        "A local Fastify service handles the bounded yt-dlp integration.",
        "Validated deep links can open supported media without exposing arbitrary schemes or commands."
      ],
      supportedAdapters: [],
      reproducibility: [
        "Regression tests cover supported providers, loop behavior, subtitles, web mode, Electron boundaries, and yt-dlp selection.",
        "The integration returns status and recent-session summaries without moving playback state into Studio."
      ],
      studioRelationship: "Studio can launch ContentDeck, send a validated HTTPS media URL, or request a recent-session summary. Playback and subtitle state stay in ContentDeck, and Studio never embeds the player.",
      currentState: "YouTube, X, and TikTok detection, full and segment loops, subtitle handling, web mode, Electron mode, and yt-dlp integration remain in place. Status and safe media handoff are implemented for review.",
      openProblems: [
        "Complete light-theme and packaged Electron checks.",
        "Keep the ContentDeck product name while the repository naming decision remains with the owner.",
        "Approve an actual media-player screenshot and role icon."
      ],
      relatedWriting: [],
      linkLabels: { repository: "Repository" }
    }
  },
  now: {
    currentlyReading: [
      "How Seer and SimVLA expose model inputs, state, and action outputs differently.",
      "Ways to reuse model state while keeping approximation and evaluation boundaries clear."
    ],
    currentlyBuilding: [
      "A shared experiment layout for running VLA models with separate model, method, environment, and result settings.",
      "Run manifests and environment snapshots that make experiment context easier to revisit."
    ],
    currentQuestions: [
      "Which parts of a VLA experiment can be shared across models?",
      "Which representations can be reused without changing behavior in ways I cannot see?",
      "How much context is enough to understand an old experiment later?"
    ]
  },
  skillGroups: [
    { title: "Research work", skills: ["Experiment setup", "Run context", "Result checking", "Reproduction planning"] },
    { title: "AI and ML", skills: ["Vision-language-action models", "Model evaluation", "Efficient execution", "Research tools"] },
    { title: "Software", skills: ["Python", "TypeScript", "Static websites", "Git workflows"] }
  ]
} satisfies LocaleCopy;
