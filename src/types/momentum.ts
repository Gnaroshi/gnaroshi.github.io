export type MomentumVisibility = "public" | "unlisted" | "hidden";
export type ContentStage = "seed" | "working" | "substantive";

export type EvidenceMetadata = {
  contentStage?: ContentStage;
  metricEligible?: boolean;
  graphEligible?: boolean;
  weeklyReviewEligible?: boolean;
};

export type MomentumPaperStatus = "planned" | "pass1" | "pass2" | "pass3" | "read" | "implemented" | "abandoned";
export type MomentumPaperDepth = "skim" | "understand" | "deep" | "reproduce" | "implement";

export type Paper = EvidenceMetadata & {
  slug: string;
  title: string;
  readDate?: string;
  status: MomentumPaperStatus;
  depth: MomentumPaperDepth;
  difficulty: number;
  draft?: boolean;
  visibility?: MomentumVisibility;
  projectUrl?: string;
  noteCompleteness?: number;
  noteWordCount?: number;
  selfScore?: number;
};

export type PaperReviewDimension = {
  score: number;
  evidence?: string;
};

export type PaperReview = EvidenceMetadata & {
  paperSlug: string;
  reviewedAt: string;
  overallScore: number;
  reviewVisibility?: MomentumVisibility;
  confidence?: "low" | "medium" | "high";
  dimensions?: Record<string, PaperReviewDimension>;
  selfScoreComparison?: {
    userScore: number;
    aiScore: number;
    difference: number;
  } | null;
};

export type OralExamScore = EvidenceMetadata & {
  paperSlug?: string;
  date: string;
  overallScore?: number;
  retrievalScore?: number;
  explanationScore?: number;
  precisionScore?: number;
  uncertaintyScore?: number;
  questionsAnswered?: number;
  totalQuestions?: number;
  completed?: boolean;
  questionTypeScores?: Record<string, number>;
  visibility?: MomentumVisibility;
};

export type GitHubContributionDay = EvidenceMetadata & {
  date: string;
  count: number;
  visibility?: MomentumVisibility;
};

export type BlogPost = EvidenceMetadata & {
  slug: string;
  pubDate: string;
  draft?: boolean;
  visibility?: MomentumVisibility;
  sourcePaper?: string;
};

export type Project = EvidenceMetadata & {
  slug: string;
  updatedAt?: string;
  status?: string;
  visibility?: MomentumVisibility;
};

export type Implementation = EvidenceMetadata & {
  slug: string;
  date: string;
  status: string;
  result?: string;
  failureReason?: string;
  lessons?: string[];
  relatedPapers?: string[];
  relatedProjects?: string[];
  visibility?: MomentumVisibility;
};

export type ReviewDueItem = EvidenceMetadata & {
  paperSlug: string;
  dueDate?: string;
  completedAt?: string;
  visibility?: MomentumVisibility;
};

export type FormulaRecallAttempt = EvidenceMetadata & {
  paperSlug?: string;
  date: string;
  score?: number;
  completed?: boolean;
  visibility?: MomentumVisibility;
};

export type QuestionPracticeAttempt = EvidenceMetadata & {
  questionId?: string;
  questionType?: string;
  date: string;
  score?: number;
  previousScore?: number;
  visibility?: MomentumVisibility;
};

export type MomentumInput = {
  today: string;
  papers: Paper[];
  paperReviews: PaperReview[];
  oralExams: OralExamScore[];
  githubContributions: GitHubContributionDay[];
  blogPosts: BlogPost[];
  projects: Project[];
  implementations: Implementation[];
  reviewDueItems: ReviewDueItem[];
  formulaRecallAttempts?: FormulaRecallAttempt[];
  questionPracticeAttempts?: QuestionPracticeAttempt[];
};

export type MomentumComponent = {
  score: number;
  weight: number;
  available: boolean;
  confidence: number;
  label: string;
  explanation: string;
  evidence: string[];
};

export type MomentumLevel = "seed" | "building" | "steady" | "strong" | "compounding";

export type MomentumResult = {
  score: number;
  level: MomentumLevel;
  confidence: {
    score: number;
    label: "low" | "medium" | "high";
    reasons: string[];
  };
  components: {
    readingConsistency: MomentumComponent;
    understandingQuality: MomentumComponent;
    retrievalStrength: MomentumComponent;
    researchOutput: MomentumComponent;
    revisitDiscipline: MomentumComponent;
    balanceIntegrity: MomentumComponent;
  };
  antiGamingFlags: string[];
  missingEvidence: string[];
  nextActions: string[];
  explanation: string;
};
