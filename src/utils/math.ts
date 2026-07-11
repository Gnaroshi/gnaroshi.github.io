const MATH_PATTERNS = [
  /\$\$[\s\S]+?\$\$/,
  /(^|[^\\])\$(?!\s)[^$\n]+?\$/m,
  /\\\([\s\S]+?\\\)/,
  /\\\[[\s\S]+?\\\]/,
  /\\begin\{(?:equation|align|gather|multline)\*?\}/
];

export function hasMathSyntax(source?: string): boolean {
  return Boolean(source && MATH_PATTERNS.some((pattern) => pattern.test(source)));
}
