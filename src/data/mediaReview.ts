export const heroCandidates = [
  { id: "hero-a-01", direction: "A", label: "Editorial material abstraction 01", file: "hero-a-01.png", focalPoint: "62% 48%" },
  { id: "hero-a-02", direction: "A", label: "Editorial material abstraction 02", file: "hero-a-02.png", focalPoint: "60% 50%" },
  { id: "hero-b-01", direction: "B", label: "Research materials 01", file: "hero-b-01.png", focalPoint: "63% 50%" },
  { id: "hero-b-02", direction: "B", label: "Research materials 02", file: "hero-b-02.png", focalPoint: "60% 54%" },
  { id: "hero-c-01", direction: "C", label: "Original identity abstraction 01", file: "hero-c-01.png", focalPoint: "62% 50%" },
  { id: "hero-c-02", direction: "C", label: "Original identity abstraction 02", file: "hero-c-02.png", focalPoint: "64% 50%" }
] as const;

export const brandCandidates = [
  {
    id: "brand-a",
    direction: "Abstract G monogram",
    viewBox: "0 0 64 64",
    paths: ["M47 17A22 22 0 1 0 48.5 44H35V34h20v18A29 29 0 1 1 52 12l-5 5Z"]
  },
  {
    id: "brand-b",
    direction: "Interlocking paper and path",
    viewBox: "0 0 64 64",
    paths: ["M13 10h27l11 11v33H13V10Zm8 9v26h22V26H35V19H21Z", "M25 31h14v6H25v-6Z"]
  },
  {
    id: "brand-c",
    direction: "Original asymmetric silhouette",
    viewBox: "0 0 64 64",
    paths: ["M8 42 25 12l9 14 18-8-7 17 11 9-20 8-11-9-17-1Z"]
  },
  {
    id: "brand-d",
    direction: "Research node and cut-paper mark",
    viewBox: "0 0 64 64",
    paths: ["M11 11h42v42H11V11Zm8 8v26h26V19H19Z", "M26 26h12v12H26V26Z"]
  }
] as const;
