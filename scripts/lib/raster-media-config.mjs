export const rasterMedia = [
  {
    key: "homeResearchConstellation",
    id: "home-research-constellation",
    ratio: [5, 4],
    source: "artifacts/raster-selected/home-research-constellation.png",
    candidates: [
      "artifacts/raster-candidates/home-research-constellation-c.png",
      "artifacts/raster-candidates/home-research-constellation-d.png"
    ],
    selectedCandidate: "candidate-c",
    focalPoint: "center center",
    references: ["src/components/home/Hero.astro"],
    hero: true
  },
  {
    key: "researchVla",
    id: "research-vla",
    ratio: [4, 3],
    source: "artifacts/raster-selected/research-vla.png",
    candidates: ["artifacts/raster-candidates/research-vla-a.png", "artifacts/raster-candidates/research-vla-b.png"],
    selectedCandidate: "candidate-b",
    focalPoint: "center center",
    references: ["src/views/ResearchView.astro"]
  },
  {
    key: "researchEfficientSystems",
    id: "research-efficient-systems",
    ratio: [4, 3],
    source: "artifacts/raster-selected/research-efficient-systems.png",
    candidates: [
      "artifacts/raster-candidates/research-efficient-systems-a.png",
      "artifacts/raster-candidates/research-efficient-systems-b.png"
    ],
    selectedCandidate: "candidate-b",
    focalPoint: "center center",
    references: ["src/views/ResearchView.astro"]
  },
  {
    key: "researchWorkflow",
    id: "research-workflow",
    ratio: [4, 3],
    source: "artifacts/raster-selected/research-workflow.png",
    candidates: ["artifacts/raster-candidates/research-workflow-a.png", "artifacts/raster-candidates/research-workflow-b.png"],
    selectedCandidate: "candidate-a",
    focalPoint: "center center",
    references: ["src/views/ResearchView.astro"]
  },
  {
    key: "projectGnaroshiVla",
    id: "project-gnaroshi-vla",
    ratio: [16, 10],
    source: "artifacts/raster-selected/project-gnaroshi-vla.png",
    candidates: ["artifacts/raster-candidates/project-gnaroshi-vla-a.png", "artifacts/raster-candidates/project-gnaroshi-vla-b.png"],
    selectedCandidate: "candidate-b",
    focalPoint: "center center",
    references: ["src/data/facts/projects.ts"]
  },
  {
    key: "projectGnaroshiDev",
    id: "project-gnaroshi-dev",
    ratio: [16, 10],
    source: "artifacts/raster-selected/project-gnaroshi-dev.png",
    candidates: ["artifacts/raster-candidates/project-gnaroshi-dev-a.png", "artifacts/raster-candidates/project-gnaroshi-dev-b.png"],
    selectedCandidate: "candidate-b",
    focalPoint: "center center",
    references: ["src/data/facts/projects.ts"]
  },
  {
    key: "paperLabCycle",
    id: "paper-lab-cycle",
    ratio: [16, 10],
    source: "artifacts/raster-selected/paper-lab-cycle.png",
    candidates: ["artifacts/raster-candidates/paper-lab-cycle-a.png", "artifacts/raster-candidates/paper-lab-cycle-b.png"],
    selectedCandidate: "candidate-b",
    focalPoint: "center center",
    references: ["src/components/papers/PaperDashboard.astro", "src/views/HomeView.astro"]
  },
  {
    key: "growthEvidence",
    id: "growth-evidence",
    ratio: [16, 10],
    source: "artifacts/raster-selected/growth-evidence.png",
    candidates: ["artifacts/raster-candidates/growth-evidence-a.png", "artifacts/raster-candidates/growth-evidence-b.png"],
    selectedCandidate: "candidate-b",
    focalPoint: "center center",
    references: ["src/views/GrowthView.astro"]
  }
];

export const variantLabels = [480, 768, 1200, 1600];
