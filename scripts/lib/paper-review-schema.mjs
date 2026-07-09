export const PAPER_REVIEW_SCHEMA_VERSION = "1.0.0";

export const DIMENSION_KEYS = [
  "problemFraming",
  "coreIdea",
  "methodUnderstanding",
  "formulaUnderstanding",
  "experimentUnderstanding",
  "criticalThinking",
  "researchConnection",
  "retrievalReadiness",
  "threePassDiscipline",
  "noteQuality"
];

export const SCORE_LEVELS = ["seed", "developing", "solid", "strong", "excellent"];
export const REVIEW_VISIBILITIES = ["public", "hidden"];
export const CONFIDENCE_LEVELS = ["low", "medium", "high"];
export const THREE_PASS_STATUSES = ["complete", "partial", "not_started", "not_applicable"];

const dimensionSchema = {
  type: "object",
  properties: {
    score: { type: "integer", minimum: 0, maximum: 10 },
    feedback: { type: "string" },
    evidence: { type: "string" },
    nextStep: { type: "string" }
  },
  required: ["score", "feedback", "evidence", "nextStep"],
  additionalProperties: false
};

const passSchema = {
  type: "object",
  properties: {
    status: { type: "string", enum: THREE_PASS_STATUSES },
    comment: { type: "string" }
  },
  required: ["status", "comment"],
  additionalProperties: false
};

const historySchema = {
  type: "object",
  properties: {
    reviewedAt: { type: "string" },
    overallScore: { type: "integer", minimum: 0, maximum: 100 },
    scoreLevel: { type: "string", enum: SCORE_LEVELS }
  },
  required: ["reviewedAt", "overallScore", "scoreLevel"],
  additionalProperties: false
};

export const PAPER_REVIEW_SCHEMA = {
  type: "object",
  properties: {
    schemaVersion: { type: "string", enum: [PAPER_REVIEW_SCHEMA_VERSION] },
    paperSlug: { type: "string" },
    paperTitle: { type: "string" },
    reviewedAt: { type: "string" },
    model: { type: "string" },
    reviewVisibility: { type: "string", enum: REVIEW_VISIBILITIES },
    overallScore: { type: "integer", minimum: 0, maximum: 100 },
    scoreLevel: { type: "string", enum: SCORE_LEVELS },
    confidence: { type: "string", enum: CONFIDENCE_LEVELS },
    summary: { type: "string" },
    motivationMessage: { type: "string" },
    dimensions: {
      type: "object",
      properties: Object.fromEntries(DIMENSION_KEYS.map((key) => [key, dimensionSchema])),
      required: DIMENSION_KEYS,
      additionalProperties: false
    },
    threePassReview: {
      type: "object",
      properties: {
        pass1: passSchema,
        pass2: passSchema,
        pass3: passSchema
      },
      required: ["pass1", "pass2", "pass3"],
      additionalProperties: false
    },
    strengths: { type: "array", items: { type: "string" } },
    gaps: { type: "array", items: { type: "string" } },
    nextActions: {
      type: "array",
      items: {
        type: "object",
        properties: {
          type: {
            type: "string",
            enum: ["retrieval", "deepening", "implementation", "critique", "connection", "revisit"]
          },
          action: { type: "string" },
          effortMinutes: { type: "integer", minimum: 1, maximum: 240 }
        },
        required: ["type", "action", "effortMinutes"],
        additionalProperties: false
      }
    },
    retrievalQuestions: { type: "array", items: { type: "string" } },
    badge: {
      type: "object",
      properties: {
        id: { type: "string" },
        label: { type: "string" },
        reason: { type: "string" }
      },
      required: ["id", "label", "reason"],
      additionalProperties: false
    },
    limitations: { type: "array", items: { type: "string" } },
    history: { type: "array", items: historySchema }
  },
  required: [
    "schemaVersion",
    "paperSlug",
    "paperTitle",
    "reviewedAt",
    "model",
    "reviewVisibility",
    "overallScore",
    "scoreLevel",
    "confidence",
    "summary",
    "motivationMessage",
    "dimensions",
    "threePassReview",
    "strengths",
    "gaps",
    "nextActions",
    "retrievalQuestions",
    "badge",
    "limitations",
    "history"
  ],
  additionalProperties: false
};

export function calculateOverallScore(dimensions) {
  const total = DIMENSION_KEYS.reduce((sum, key) => {
    const score = Number(dimensions?.[key]?.score);
    if (!Number.isFinite(score)) {
      throw new Error(`Missing numeric score for dimension: ${key}`);
    }

    return sum + clamp(score, 0, 10);
  }, 0);

  return Math.round((total / DIMENSION_KEYS.length) * 10);
}

export function scoreLevelForScore(score) {
  if (score <= 39) return "seed";
  if (score <= 59) return "developing";
  if (score <= 74) return "solid";
  if (score <= 89) return "strong";
  return "excellent";
}

export function compactHistoryEntry(review) {
  return {
    reviewedAt: String(review.reviewedAt),
    overallScore: clamp(Math.round(Number(review.overallScore)), 0, 100),
    scoreLevel: scoreLevelForScore(clamp(Math.round(Number(review.overallScore)), 0, 100))
  };
}

export function normalizePaperReview(rawReview, { paper, model, reviewedAt = new Date().toISOString(), existingReview } = {}) {
  const review = JSON.parse(JSON.stringify(rawReview));
  const overallScore = calculateOverallScore(review.dimensions);
  const scoreLevel = scoreLevelForScore(overallScore);
  const reviewVisibility = paper?.frontmatter?.reviewVisibility === "hidden" ? "hidden" : "public";

  review.schemaVersion = PAPER_REVIEW_SCHEMA_VERSION;
  review.paperSlug = paper?.slug ?? review.paperSlug;
  review.paperTitle = paper?.frontmatter?.title ?? review.paperTitle;
  review.reviewedAt = reviewedAt;
  review.model = model ?? review.model;
  review.reviewVisibility = reviewVisibility;
  review.overallScore = overallScore;
  review.scoreLevel = scoreLevel;
  review.strengths = coerceStringArray(review.strengths);
  review.gaps = coerceStringArray(review.gaps);
  review.retrievalQuestions = coerceStringArray(review.retrievalQuestions);
  review.limitations = ensureStandardLimitations(coerceStringArray(review.limitations));
  review.nextActions = Array.isArray(review.nextActions) ? review.nextActions : [];
  review.history = mergeHistory(existingReview, review);

  validatePaperReview(review);
  return review;
}

export function validatePaperReview(review) {
  const errors = [];

  for (const key of PAPER_REVIEW_SCHEMA.required) {
    if (!(key in review)) errors.push(`Missing top-level field: ${key}`);
  }

  if (review.schemaVersion !== PAPER_REVIEW_SCHEMA_VERSION) {
    errors.push(`schemaVersion must be ${PAPER_REVIEW_SCHEMA_VERSION}`);
  }

  if (!REVIEW_VISIBILITIES.includes(review.reviewVisibility)) {
    errors.push("reviewVisibility must be public or hidden");
  }

  if (!SCORE_LEVELS.includes(review.scoreLevel)) {
    errors.push(`scoreLevel must be one of ${SCORE_LEVELS.join(", ")}`);
  }

  if (!CONFIDENCE_LEVELS.includes(review.confidence)) {
    errors.push(`confidence must be one of ${CONFIDENCE_LEVELS.join(", ")}`);
  }

  for (const key of DIMENSION_KEYS) {
    const dimension = review.dimensions?.[key];
    if (!dimension) {
      errors.push(`Missing dimension: ${key}`);
      continue;
    }

    if (!Number.isInteger(dimension.score) || dimension.score < 0 || dimension.score > 10) {
      errors.push(`Dimension ${key}.score must be an integer from 0 to 10`);
    }

    for (const textKey of ["feedback", "evidence", "nextStep"]) {
      if (typeof dimension[textKey] !== "string") {
        errors.push(`Dimension ${key}.${textKey} must be a string`);
      }
    }
  }

  for (const passKey of ["pass1", "pass2", "pass3"]) {
    const pass = review.threePassReview?.[passKey];
    if (!pass) {
      errors.push(`Missing threePassReview.${passKey}`);
      continue;
    }

    if (!THREE_PASS_STATUSES.includes(pass.status)) {
      errors.push(`threePassReview.${passKey}.status is invalid`);
    }
  }

  if (calculateOverallScore(review.dimensions) !== review.overallScore) {
    errors.push("overallScore must equal rounded average of dimension scores multiplied by 10");
  }

  if (scoreLevelForScore(review.overallScore) !== review.scoreLevel) {
    errors.push("scoreLevel does not match overallScore");
  }

  for (const listKey of ["strengths", "gaps", "nextActions", "retrievalQuestions", "limitations", "history"]) {
    if (!Array.isArray(review[listKey])) errors.push(`${listKey} must be an array`);
  }

  if (typeof review.badge?.id !== "string" || typeof review.badge?.label !== "string" || typeof review.badge?.reason !== "string") {
    errors.push("badge must include id, label, and reason strings");
  }

  if (errors.length > 0) {
    throw new Error(`Invalid paper review JSON:\n- ${errors.join("\n- ")}`);
  }

  return review;
}

export function isPublicReview(review) {
  return review?.reviewVisibility !== "hidden";
}

function mergeHistory(existingReview, nextReview) {
  const entries = [];

  if (Array.isArray(existingReview?.history)) {
    entries.push(...existingReview.history);
  }

  if (existingReview?.reviewedAt) {
    entries.push(compactHistoryEntry(existingReview));
  }

  entries.push(compactHistoryEntry(nextReview));

  const seen = new Set();
  return entries.filter((entry) => {
    const key = `${entry.reviewedAt}:${entry.overallScore}:${entry.scoreLevel}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function ensureStandardLimitations(limitations) {
  const standard = "This score is based only on the submitted paper note, not on a full independent verification of the paper.";
  return limitations.some((item) => item.toLowerCase().includes("submitted paper note")) ? limitations : [...limitations, standard];
}

function coerceStringArray(value) {
  return Array.isArray(value) ? value.map((item) => String(item)).filter(Boolean) : [];
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}
