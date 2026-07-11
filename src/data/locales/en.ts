import type { LocaleCopy } from "./types";

export const enCopy = {
  copyUpdatedAt: "2026-07-12",
  profile: {
    headline: "I study AI systems\nand build software for research.",
    shortBio: "Right now, I’m interested in experiment infrastructure for vision-language-action models and better ways to read, revisit, and connect papers.",
    aboutIntroduction: "My background is in software, and I’m currently learning about AI through experiments and tools in a university research lab.",
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
      relatedLabels: ["Writing", "Papers"]
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
      currentState: "The website reads blog and paper content only from the public feed. Authoring, review generation, private metrics, and API endpoints remain in separately owned repositories.",
      openProblems: [
        "Publish the first article after editorial review.",
        "Publish the first paper note after it has been written and reviewed by the owner.",
        "Keep the public site understandable as more records are added."
      ],
      relatedWriting: ["first-post", "paper-reading-method", "research-workflow"],
      linkLabels: { repository: "Repository", "live-site": "Live site" }
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
