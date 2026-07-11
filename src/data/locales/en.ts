import type { LocaleCopy } from "./types";

export const enCopy = {
  copyUpdatedAt: "2026-07-11",
  profile: {
    headline: "AI researcher and software engineer working on vision-language-action systems",
    currentRole: "AI researcher and software engineer",
    location: "South Korea",
    shortBio: "I build research infrastructure for vision-language-action experiments and study how AI systems can be evaluated with clearer evidence.",
    bio: [
      "I work across AI research and software engineering, with a current focus on vision-language-action systems and the infrastructure needed to compare them carefully.",
      "My public work emphasizes explicit experiment structure, reproducible run context, and a clear boundary between private notes and claims that have enough evidence to publish.",
      "This site collects project documentation, technical writing, and paper notes when those records are ready for public review."
    ],
    researchBackground: [
      "My current engineering work separates model architecture, research method, environment configuration, and results so that experiments can be inspected without relying on one repository layout.",
      "I am also interested in efficient model execution and research tools that preserve questions, assumptions, and implementation decisions alongside code."
    ],
    researcherValues: [
      "State what the available evidence supports, and leave unsupported outcomes unstated.",
      "Keep experiment configuration, environment context, and results traceable.",
      "Treat failed and incomplete work as useful records when their limits are explicit.",
      "Use automation to improve repeatability without replacing technical judgment."
    ]
  },
  researchAreas: {
    "practical-vla-systems": {
      question: "How can VLA systems be compared without tying the experiment to one architecture?",
      motivation: "VLA repositories often mix model-specific setup, environment assumptions, methods, and result handling. That makes a change difficult to compare across architectures.",
      hypothesis: "An architecture-neutral experiment layer can keep shared methods and run contracts stable while adapters isolate model-specific behavior.",
      uncertainty: "The abstraction boundary must stay thin enough to preserve architecture-specific details that matter for correctness.",
      relatedLabels: ["gnaroshi_vla"]
    },
    "efficient-model-execution": {
      question: "Which intermediate representations can be reused without hiding changes in model behavior?",
      motivation: "Efficient execution is useful only when saved computation, state reuse, and approximation boundaries can be measured and inspected.",
      hypothesis: "Explicit interfaces around reusable state and update paths can make efficiency methods easier to compare than ad hoc modifications inside each model.",
      uncertainty: "The useful interface may differ substantially across architectures, observation histories, and action decoders.",
      relatedLabels: ["Experiment workspace"]
    },
    "human-ai-research-tools": {
      question: "How should research tools support judgment while keeping evidence visible?",
      motivation: "Summaries and scores are easy to generate, but they are not substitutes for source notes, retrieval, implementation, or reviewed experimental evidence.",
      hypothesis: "Tools are more useful when private source material, public projection, and presentation are separate and every public metric has an eligibility rule.",
      uncertainty: "The right amount of structure must be tested through repeated use; excessive process can be as harmful as missing context.",
      relatedLabels: ["Writing", "Paper Lab"]
    }
  },
  projects: {
    "gnaroshi-vla": {
      title: "gnaroshi_vla",
      summary: "An architecture-neutral workspace for organizing VLA experiments across model adapters, shared methods, environment configuration, and explicit result directories.",
      statusLabel: "Active infrastructure work",
      problem: "VLA experiments become difficult to compare when architecture code, method changes, environment setup, launch scripts, and results are coupled inside one model repository.",
      designGoals: [
        "Keep architecture-specific integration behind explicit adapters.",
        "Separate shared methods from model and environment configuration.",
        "Make every run's configuration and environment context inspectable.",
        "Keep result locations explicit without presenting unreviewed outputs as conclusions."
      ],
      architecture: [
        "architectures/ contains model adapters and preserved upstream integration points.",
        "methods/ contains architecture-independent research methods and reference modules.",
        "configs/ separates architecture, method, environment, experiment, and node settings.",
        "scripts/ and tools/ capture run context, environment snapshots, checks, and result handling."
      ],
      supportedAdapters: [
        "Seer infrastructure with dedicated configuration and wrappers.",
        "SimVLA infrastructure with dedicated configuration and wrappers."
      ],
      reproducibility: [
        "Composed configuration makes the architecture, method, environment, experiment, and node choice explicit.",
        "Run-context and environment-snapshot tools preserve the settings needed to inspect a run.",
        "Results are assigned to explicit architecture and experiment directories rather than inferred from a dashboard."
      ],
      currentState: "The public repository contains Seer and SimVLA integration structure, shared method modules, and run-context tooling. No benchmark result is published here; the current evidence is infrastructure. Third-party attribution is documented in the repository.",
      openProblems: [
        "Define the smallest adapter contract that remains faithful to each architecture.",
        "Compare efficiency methods with consistent run manifests and reviewed evidence.",
        "Clarify repository-level licensing before broader reuse beyond the documented upstream components."
      ],
      relatedWriting: [],
      linkLabels: { repository: "Repository" }
    },
    "gnaroshi-dev": {
      title: "gnaroshi.dev",
      summary: "A bilingual Astro presentation layer that renders a deterministic public projection of privately authored research and writing.",
      statusLabel: "Active",
      problem: "A public research site needs durable authoring and clear privacy boundaries without making the website repository the source of truth for private notes or generated analysis.",
      designGoals: [
        "Keep paper and writing sources canonical in private repositories.",
        "Publish only explicitly selected public fields through a generated feed.",
        "Keep English and Korean presentation structurally equivalent.",
        "Show metrics only when the public feed contains enough eligible evidence."
      ],
      architecture: [
        "Gnaroshi Studio checkpoints private paper and writing sources.",
        "The publisher creates a sanitized, deterministic public content feed with source commit metadata.",
        "The presentation-only Astro website validates and renders that public feed.",
        "GitHub Actions deploys the static build to GitHub Pages and verifies the imported feed commit."
      ],
      supportedAdapters: [],
      reproducibility: [
        "The feed manifest records source commits, counts, schema version, and a content hash.",
        "The website build records the exact feed commit in metadata and build-info.json.",
        "Private repositories are never checked out by the public website workflow."
      ],
      currentState: "The website consumes only the public feed for blog and paper content. Authoring, AI workflows, private metrics, and API endpoints remain in separately owned repositories.",
      openProblems: [
        "Publish the first substantive article after editorial review.",
        "Publish the first genuine paper note only after the reading record is owner-authored.",
        "Keep public evidence rules understandable as the record grows."
      ],
      relatedWriting: ["first-post", "paper-reading-method", "research-workflow"],
      linkLabels: { repository: "Repository", "live-site": "Live site" }
    }
  },
  now: {
    currentlyReading: [
      "VLA architecture interfaces and the assumptions that change across Seer and SimVLA integrations.",
      "Methods for reusing model state while keeping approximation and evaluation boundaries explicit."
    ],
    currentlyBuilding: [
      "An architecture-neutral VLA experiment workspace with separate model, method, environment, and result layers.",
      "Run manifests and environment snapshots that make experiment context easier to inspect."
    ],
    currentQuestions: [
      "What belongs in a shared VLA experiment contract, and what must remain architecture-specific?",
      "Which representations can be reused without obscuring behavior changes?",
      "What evidence is sufficient before an experiment result becomes a public claim?"
    ]
  },
  skillGroups: [
    { title: "Research systems", skills: ["Experiment structure", "Run context", "Result traceability", "Reproduction planning"] },
    { title: "AI and ML", skills: ["Vision-language-action systems", "Model evaluation", "Efficient execution", "Research tooling"] },
    { title: "Software", skills: ["Python", "TypeScript", "Static publishing", "Git workflows"] }
  ]
} satisfies LocaleCopy;
