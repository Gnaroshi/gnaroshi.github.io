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
Do not over-score vague notes that only restate the title, abstract, or common field names.
Do not punish a pass1 skim note for lacking pass3 derivations.
Do penalize mismatch between declared depth/status and the actual written evidence.
Base every score on evidence from the note. If evidence is missing, lower the relevant dimension and say what evidence is missing.
Set confidence to "low" when the note is very short, mostly placeholders, mostly copied text, or missing evidence for several dimensions.

Return only JSON matching the provided schema.`;

export function buildPaperReviewUserPrompt(paper) {
  const input = getPaperReviewInput(paper);

  return `Review this paper reading note.

Scoring rule:
- Assign 0-10 for each dimension: ${DIMENSION_KEYS.join(", ")}.
- overallScore must be the rounded average of the 10 dimensions multiplied by 10.
- scoreLevel must follow: 0-39 seed, 40-59 developing, 60-74 solid, 75-89 strong, 90-100 excellent.
- Use "Evidence of understanding" framing. Never use "intelligence score", "IQ", "smart", or "dumb".
- Score only what is evidenced in the note. Do not infer understanding from the paper title, author reputation, venue, or broad topic.
- Do not over-score vague notes. A note that says "good paper, important idea, need to read more" without own explanation should stay low.
- Do not punish intentionally shallow pass1 notes too much when they clearly identify problem, claim, relevance, and next questions.
- Penalize mismatch: status pass3/depth deep with no formula, method, or experiment detail should score much lower than the declared depth suggests.
- Confidence must be "low" when the note is too short, mostly TODOs/placeholders, mostly copied abstract text, or missing evidence across multiple dimensions.

Score anchors:
- seed 0-39: Very shallow. Mostly copied title/abstract, TODOs, or vague claims. No own explanation, method, experiment, or questions.
- developing 40-59: Basic summary. Some understanding of topic or claim, but method, experiment evidence, critique, or retrieval plan is missing.
- solid 60-74: Clear problem and core idea in own words. Some method detail. Limited formula/experiment analysis or critical thinking.
- strong 75-89: Good method explanation, formula interpretation, experiment takeaway, critique, and research connection.
- excellent 90-100: The note supports reconstructing the paper from memory, explains formulas/experiments, critiques assumptions, and identifies concrete research actions.

Dimension anchors:
- 0-2: missing, placeholder, copied, or unsupported.
- 3-4: present but vague or mostly restated from metadata.
- 5-6: understandable but incomplete; useful for pass1/pass2 but missing evidence.
- 7-8: specific, in own words, with evidence and a next step.
- 9-10: reconstructable, precise, critical, and useful for future research.

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
- Include retrievalQuestions the user can use later.
- If frontmatter.selfScore exists, fill selfScoreComparison using that score and comment on calibration gently.
- Fill improvementTarget with the one most useful next improvement for reaching the next score level.
- nextReviewDate will be normalized by the writer using reviewAfterDays; still return a YYYY-MM-DD placeholder if required by schema.`;
}

export function buildManualReviewPrompt(slug) {
  return `You are reviewing my paper note for evidence of understanding, not intelligence.

Use the same constructive rules:
- Do not claim to know my true understanding beyond the note.
- Do not pretend you read the full paper unless I provide an abstract or source excerpt.
- Reward appropriate pass1/pass2/pass3 progress.
- Do not over-score vague notes.
- Set confidence low when the note is too short or missing evidence.
- Include selfScoreComparison, improvementTarget, and nextReviewDate when the schema asks for them.
- Return only JSON matching this schema.

Paper slug: ${slug}

Paste my paper frontmatter and MDX body here:

[PASTE PAPER NOTE]

JSON schema:
\`\`\`json
${JSON.stringify(PAPER_REVIEW_SCHEMA, null, 2)}
\`\`\``;
}

export function buildManualReviewPromptForPaper(input) {
  return `You are an AI-assisted paper reading reviewer for a personal research notebook.

Return only JSON. Do not wrap the JSON in Markdown.

Purpose:
- Evaluate evidence of understanding in the written note.
- Give constructive next actions that help the reader improve.
- Support motivation and calibration over time.

Safety and scope:
- Do not evaluate intelligence, IQ, worth, or potential.
- Do not claim to know true understanding beyond the written evidence.
- Do not overclaim objective correctness unless abstract or sourceExcerpt is provided.
- Do not pretend you read the full paper unless source text is included below.
- Base every score on evidence from the note.
- Do not over-score vague notes, copied abstract text, TODOs, or generic summaries.
- Do not punish intentionally shallow pass1 notes too much when they clearly record problem, claim, relevance, and next questions.
- Set confidence to "low" when the note is too short or missing evidence across several dimensions.

Scoring rubric:
${buildScoringRubricText()}

Paper metadata and note:
\`\`\`json
${JSON.stringify(input, null, 2)}
\`\`\`

Exact JSON schema:
\`\`\`json
${JSON.stringify(PAPER_REVIEW_SCHEMA, null, 2)}
\`\`\`

Return only one JSON object matching the schema.`;
}

export function buildScoringRubricText() {
  return `- Assign 0-10 for each dimension: ${DIMENSION_KEYS.join(", ")}.
- overallScore must be the rounded average of the 10 dimensions multiplied by 10.
- scoreLevel: 0-39 seed, 40-59 developing, 60-74 solid, 75-89 strong, 90-100 excellent.
- seed 0-39: Very shallow. Mostly copied title/abstract, TODOs, or vague claims. No own explanation, method, experiment, or questions.
- developing 40-59: Basic summary. Some understanding of topic or claim, but method, experiment evidence, critique, or retrieval plan is missing.
- solid 60-74: Clear problem and core idea in own words. Some method detail. Limited formula/experiment analysis or critical thinking.
- strong 75-89: Good method explanation, formula interpretation, experiment takeaway, critique, and research connection.
- excellent 90-100: The note supports reconstructing the paper from memory, explains formulas/experiments, critiques assumptions, and identifies concrete research actions.
- Dimension score 0-2: missing, placeholder, copied, or unsupported.
- Dimension score 3-4: present but vague or mostly restated from metadata.
- Dimension score 5-6: understandable but incomplete; useful for pass1/pass2 but missing evidence.
- Dimension score 7-8: specific, in own words, with evidence and a next step.
- Dimension score 9-10: reconstructable, precise, critical, and useful for future research.
- Dimensions:
  1. problemFraming: problem and why it matters.
  2. coreIdea: central idea in the reader's own words.
  3. methodUnderstanding: input, output, structure, objective, training/evaluation flow, or change from prior work.
  4. formulaUnderstanding: main formula/objective/loss in plain language.
  5. experimentUnderstanding: experiment or result supporting the central claim.
  6. criticalThinking: limitations, doubts, assumptions, missing ablations, or critique.
  7. researchConnection: connection to research, projects, or future reading.
  8. retrievalReadiness: whether the note supports later closed-book recall.
  9. threePassDiscipline: whether the note matches its declared status/depth.
  10. noteQuality: clarity, structure, specificity, and own-word explanation.`;
}
