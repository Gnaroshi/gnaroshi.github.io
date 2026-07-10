import type { PaperEntry } from "./papers";
import { getContentSlug } from "./localizedContent";

export type FormulaRecallRecord = {
  id: string;
  title: string;
  href: string;
  mainFormula: string;
  formulaInterpretation: string;
  formulaTerms: Array<{ symbol: string; meaning: string }>;
  formulaRecallPrompts: string[];
  tags: string[];
};

export function hasFormulaRecallMaterial(paper: PaperEntry): boolean {
  return Boolean(
    paper.data.mainFormula ||
      paper.data.formulaInterpretation ||
      paper.data.formulaTerms.length > 0 ||
      paper.data.formulaRecallPrompts.length > 0
  );
}

export function toFormulaRecallRecord(paper: PaperEntry): FormulaRecallRecord {
  return {
    id: getContentSlug(paper.id),
    title: paper.data.title,
    href: `/papers/${getContentSlug(paper.id)}/`,
    mainFormula: paper.data.mainFormula,
    formulaInterpretation: paper.data.formulaInterpretation,
    formulaTerms: paper.data.formulaTerms,
    formulaRecallPrompts: paper.data.formulaRecallPrompts,
    tags: paper.data.tags
  };
}
