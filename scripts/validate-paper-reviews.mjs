#!/usr/bin/env node
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { loadAllPaperLogs } from "./lib/paper-content-loader.mjs";
import { PAPER_REVIEWS_DIR } from "./lib/paper-review-writer.mjs";
import { getUserSelfScore, validatePaperReview } from "./lib/paper-review-schema.mjs";

function main() {
  const papers = loadAllPaperLogs();
  const paperBySlug = new Map(papers.map((paper) => [paper.slug, paper]));
  const reviews = loadReviewFiles();
  const errors = [];

  for (const { fileName, review } of reviews) {
    try {
      validatePaperReview(review);
    } catch (error) {
      errors.push(`${fileName}: ${error.message}`);
      continue;
    }

    const paper = paperBySlug.get(review.paperSlug);
    if (!paper) {
      errors.push(`${fileName}: paperSlug "${review.paperSlug}" does not map to a file in src/content/papers/`);
      continue;
    }

    const expectedVisibility = paper.frontmatter.reviewVisibility === "hidden" ? "hidden" : "public";
    if (review.reviewVisibility !== expectedVisibility) {
      errors.push(`${fileName}: reviewVisibility "${review.reviewVisibility}" does not match paper frontmatter "${expectedVisibility}"`);
    }

    const selfScore = getUserSelfScore(paper.frontmatter.selfScore);
    if (selfScore === undefined && review.selfScoreComparison !== null) {
      errors.push(`${fileName}: selfScoreComparison must be null when paper frontmatter has no selfScore.overall`);
    }

    if (selfScore !== undefined) {
      const comparison = review.selfScoreComparison;
      if (!comparison) {
        errors.push(`${fileName}: selfScoreComparison is required when paper frontmatter has selfScore.overall`);
      } else {
        if (comparison.userScore !== selfScore) {
          errors.push(`${fileName}: selfScoreComparison.userScore must match paper selfScore.overall`);
        }

        if (comparison.aiScore !== review.overallScore) {
          errors.push(`${fileName}: selfScoreComparison.aiScore must match overallScore`);
        }

        if (comparison.difference !== comparison.userScore - comparison.aiScore) {
          errors.push(`${fileName}: selfScoreComparison.difference must equal userScore - aiScore`);
        }
      }
    }

    if (review.nextReviewDate < review.reviewedAt.slice(0, 10)) {
      errors.push(`${fileName}: nextReviewDate must not be before reviewedAt`);
    }
  }

  const publicAggregate = reviews
    .map(({ review }) => {
      const paper = paperBySlug.get(review.paperSlug);
      return paper && paper.frontmatter.reviewVisibility !== "hidden" && review.reviewVisibility !== "hidden" ? review : undefined;
    })
    .filter(Boolean);
  const hiddenReviews = reviews.filter(({ review }) => {
    const paper = paperBySlug.get(review.paperSlug);
    return review.reviewVisibility === "hidden" || paper?.frontmatter.reviewVisibility === "hidden";
  });

  for (const { review, fileName } of hiddenReviews) {
    if (publicAggregate.some((publicReview) => publicReview.paperSlug === review.paperSlug)) {
      errors.push(`${fileName}: hidden review was included in public aggregate`);
    }
  }

  if (errors.length > 0) {
    console.error(`Paper review validation failed:\n- ${errors.join("\n- ")}`);
    process.exit(1);
  }

  console.log(`Validated ${reviews.length} paper review JSON file(s).`);
}

function loadReviewFiles() {
  if (!existsSync(PAPER_REVIEWS_DIR)) return [];

  return readdirSync(PAPER_REVIEWS_DIR)
    .filter((fileName) => fileName.endsWith(".json"))
    .sort()
    .map((fileName) => {
      const filePath = join(PAPER_REVIEWS_DIR, fileName);
      return {
        fileName,
        filePath,
        review: JSON.parse(readFileSync(filePath, "utf8"))
      };
    });
}

main();
