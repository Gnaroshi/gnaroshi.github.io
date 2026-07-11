import type { PaperEntry } from "./papers";

export type FormulaRecallRecord = {
  id: string;
  title: string;
  href: string;
  mainFormula: string;
  formulaInterpretation: string;
  formulaTerms: Array<{ symbol: string; meaning: string }>;
  tags: string[];
};

export function hasFormulaRecallMaterial(paper: PaperEntry): boolean {
  return Boolean(
    paper.data.mainFormula ||
      paper.data.formulaInterpretation ||
      (paper.data.formulaTerms?.length ?? 0) > 0
  );
}

export function toFormulaRecallRecord(paper: PaperEntry): FormulaRecallRecord {
  return {
    id: paper.data.canonicalSlug,
    title: paper.data.title,
    href: `/papers/${paper.data.canonicalSlug}/`,
    mainFormula: paper.data.mainFormula ?? "",
    formulaInterpretation: paper.data.formulaInterpretation ?? "",
    formulaTerms: paper.data.formulaTerms ?? [],
    tags: paper.data.tags
  };
}
