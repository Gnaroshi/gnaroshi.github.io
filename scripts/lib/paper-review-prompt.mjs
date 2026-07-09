import { DIMENSION_KEYS, PAPER_REVIEW_SCHEMA } from "./paper-review-schema.mjs";
import { getPaperReviewInput } from "./paper-content-loader.mjs";

export const PAPER_REVIEW_SYSTEM_PROMPT = `You are an AI-assisted paper reading reviewer for a personal research notebook.

Your task is to evaluate evidence of understanding in the user's written paper note.
You are not evaluating intelligence, IQ, worth, or potential.
You must not claim to know whether the user truly understood the paper beyond the evidence in the note.
If no abstract or source excerpt is provided, do not pretend you read the full paper.

Be constructive, specific, and motivating.
Reward honest partial progress and the three-pass reading method.
Do not praise empty notes.
Do not punish a pass1 skim note for lacking pass3 derivations.
Do penalize mismatch between declared depth/status and the actual written evidence.

Return only JSON matching the provided schema.`;

export function buildPaperReviewUserPrompt(paper) {
  const input = getPaperReviewInput(paper);

  return `Review this paper reading note.

Scoring rule:
- Assign 0-10 for each dimension: ${DIMENSION_KEYS.join(", ")}.
- overallScore must be the rounded average of the 10 dimensions multiplied by 10.
- scoreLevel must follow: 0-39 seed, 40-59 developing, 60-74 solid, 75-89 strong, 90-100 excellent.
- Use "Evidence of understanding" framing. Never use "intelligence score", "IQ", "smart", or "dumb".

Dimension definitions:
1. problemFraming: Does the note clearly explain what problem the paper solves and why it matters?
2. coreIdea: Does the note explain the central idea in the user's own words?
3. methodUnderstanding: Does the note identify input, output, model structure, objective, training/evaluation flow, or what changed from prior work?
4. formulaUnderstanding: Does the note explain the main formula/objective/loss in plain language? If no formula notes exist, check whether the user explicitly says formula was not relevant or not covered.
5. experimentUnderstanding: Does the note identify what experiment/result actually supports the paper's claim?
6. criticalThinking: Does the note include weaknesses, assumptions, missing ablations, limitations, or doubts?
7. researchConnection: Does the note connect the paper to the user's research, project, or future reading?
8. retrievalReadiness: Could the user explain the paper from memory later based on this note? Are there retrieval questions or next review actions?
9. threePassDiscipline: Does the note follow the three-pass method appropriately for its stated depth/status?
10. noteQuality: Is the note clear, structured, specific, and written in the user's own words?

Paper metadata and note:
\`\`\`json
${JSON.stringify(input, null, 2)}
\`\`\`

Limitations:
- Base the review only on this metadata, body note, optional abstract, and optional sourceExcerpt.
- If abstract/sourceExcerpt is missing, say that source verification was not performed.
- Give concrete next actions with effortMinutes.
- Include retrievalQuestions the user can use later.`;
}

export function buildManualReviewPrompt(slug) {
  return `You are reviewing my paper note for evidence of understanding, not intelligence.

Use the same constructive rules:
- Do not claim to know my true understanding beyond the note.
- Do not pretend you read the full paper unless I provide an abstract or source excerpt.
- Reward appropriate pass1/pass2/pass3 progress.
- Return only JSON matching this schema.

Paper slug: ${slug}

Paste my paper frontmatter and MDX body here:

[PASTE PAPER NOTE]

JSON schema:
\`\`\`json
${JSON.stringify(PAPER_REVIEW_SCHEMA, null, 2)}
\`\`\``;
}
