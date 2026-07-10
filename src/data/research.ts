export const researchAreas = [
  {
    slug: "research-reading-loop",
    question: "How can paper reading become a reliable research loop?",
    motivation:
      "A useful reading record should preserve relevance decisions, uncertainty, retrieval failures, and implementation ideas instead of only marking papers as finished.",
    hypothesis:
      "A small sequence of skim, structure, retrieval, and revisit records can make paper knowledge easier to recover without forcing every paper into a deep read.",
    currentReading: "Paper reading methods, retrieval practice, and lightweight knowledge workflows.",
    currentBuild: "A static Paper Lab that reveals activity and analysis only when enough meaningful evidence exists.",
    uncertainty:
      "The right amount of structure is still unclear: too little loses context, while too much makes daily notes expensive.",
    related: [
      { label: "Research writing", href: "/blog/" },
      { label: "Paper Lab", href: "/papers" }
    ]
  },
  {
    slug: "practical-vlm-systems",
    question: "What makes vision-language systems practically useful?",
    motivation:
      "Benchmark scores alone do not explain grounding failures, data assumptions, interaction costs, or whether a multimodal system fits a real software workflow.",
    hypothesis:
      "Evaluation becomes more useful when model behavior is connected to task framing, failure analysis, implementation constraints, and the decisions a user must make.",
    currentReading: "Vision-language evaluation, grounding, multimodal reasoning, and failure analysis.",
    currentBuild: "A reading map for connecting model claims to evaluation questions and implementation attempts.",
    uncertainty:
      "It remains difficult to separate genuine multimodal capability from benchmark-specific prompting, preprocessing, and data effects.",
    related: [{ label: "Research map", href: "/research" }]
  },
  {
    slug: "human-ai-research-tools",
    question: "How should AI tools support researchers without replacing judgment?",
    motivation:
      "AI can accelerate summarization and questioning, but research still depends on evidence, calibrated uncertainty, and decisions the researcher can inspect.",
    hypothesis:
      "AI is most useful as a retrieval examiner, comparison aid, and prompt generator when every output stays tied to source notes and an explicit confidence boundary.",
    currentReading: "Human-AI workflows, evidence calibration, retrieval practice, and research tooling.",
    currentBuild: "A public research record that keeps generated evidence separate from the presentation layer.",
    uncertainty:
      "The boundary between helpful friction and unnecessary workflow overhead needs evidence from repeated real use.",
    related: [
      { label: "Research writing", href: "/blog/" },
      { label: "gnaroshi.dev project", href: "/projects/gnaroshi-dev/" }
    ]
  }
] as const;

export const researchQuestions = researchAreas.map((area) => ({
  title: area.question,
  summary: area.motivation
}));
