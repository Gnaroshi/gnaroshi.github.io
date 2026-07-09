import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { normalizePaperReview, validatePaperReview } from "./paper-review-schema.mjs";

export const PAPER_REVIEWS_DIR = join(process.cwd(), "src", "generated", "paper-reviews");

export function getReviewPathForSlug(slug) {
  return join(PAPER_REVIEWS_DIR, `${slug}.json`);
}

export function readExistingReview(slug) {
  const reviewPath = getReviewPathForSlug(slug);
  if (!existsSync(reviewPath)) return undefined;
  return JSON.parse(readFileSync(reviewPath, "utf8"));
}

export function hasExistingReview(slug) {
  return existsSync(getReviewPathForSlug(slug));
}

export function writePaperReview(rawReview, { paper, model, force = false } = {}) {
  mkdirSync(PAPER_REVIEWS_DIR, { recursive: true });

  const existingReview = readExistingReview(paper.slug);
  if (existingReview && !force) {
    return {
      status: "skipped",
      path: getReviewPathForSlug(paper.slug),
      review: existingReview,
      message: `Review already exists for ${paper.slug}. Use --force to re-review.`
    };
  }

  const review = normalizePaperReview(rawReview, {
    paper,
    model,
    existingReview
  });
  validatePaperReview(review);

  const reviewPath = getReviewPathForSlug(paper.slug);
  writeFileSync(reviewPath, `${JSON.stringify(review, null, 2)}\n`, { flag: "w" });

  return {
    status: existingReview ? "updated" : "created",
    path: reviewPath,
    review,
    message: `${existingReview ? "Updated" : "Created"} ${reviewPath}`
  };
}
