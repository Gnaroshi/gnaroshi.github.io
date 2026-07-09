export const researchQuestions = [
  {
    title: "How can paper reading become a reliable research loop?",
    summary:
      "I want a workflow where skimming, deep reading, implementation attempts, and revisits are all visible and useful."
  },
  {
    title: "What makes vision-language systems practically useful?",
    summary:
      "I am interested in how multimodal systems are evaluated, debugged, and connected to real software workflows."
  },
  {
    title: "How should AI tools support researchers without replacing judgment?",
    summary:
      "The goal is to make reading, retrieval, comparison, and implementation faster while keeping uncertainty explicit."
  }
] as const;

export const readingMap = [
  {
    area: "Vision-language models",
    notes: "Model behavior, evaluation, grounding, multimodal reasoning, and practical failure cases."
  },
  {
    area: "Machine learning systems",
    notes: "Training and inference workflows, evaluation infrastructure, and implementation tradeoffs."
  },
  {
    area: "Research tooling",
    notes: "Tools for managing papers, notes, experiments, code, and long-running questions."
  },
  {
    area: "Human-AI workflows",
    notes: "Interfaces that help people think, read, write, and build with AI while preserving agency."
  }
] as const;

export const openProblems = [
  "Designing paper logs that reward partial progress without becoming noisy.",
  "Connecting paper notes to implementation attempts and project artifacts.",
  "Keeping research maps small enough to maintain but structured enough to be useful.",
  "Tracking uncertainty, questions, and revisits as first-class research outputs."
] as const;

export const paperStudyNotes = [
  {
    title: "Pass 1: decide relevance",
    summary: "Capture the claim, problem, contribution, and whether the paper deserves another pass."
  },
  {
    title: "Pass 2: understand structure",
    summary: "Map the method, assumptions, experiments, baselines, and key figures."
  },
  {
    title: "Pass 3: go deep",
    summary: "Derive formulas, inspect implementation details, reproduce results, or build a small extension."
  }
] as const;

