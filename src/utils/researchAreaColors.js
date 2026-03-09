const BASE_PASTEL_POOL = [
  "#EAF2FF",
  "#EEF7E8",
  "#FFF2E5",
  "#F3ECFF",
  "#EAF7F5",
  "#FFF0F5",
  "#F8F3E8",
  "#F1F6E9",
  "#EEF0FF",
  "#FDEFF7",
];

const PRESET_AREA_INDEX = {
  core: 0,
  biomedical: 1,
  application: 2,
  "multi-modal": 3,
};

const hashString = (value) => {
  let hash = 0;

  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) | 0;
  }

  return Math.abs(hash);
};

const clampChannel = (value) => Math.max(0, Math.min(255, Math.round(value)));

const hexToRgb = (hex) => {
  const normalized = String(hex).replace("#", "").trim();

  if (normalized.length !== 6) {
    return { r: 241, g: 245, b: 249 };
  }

  return {
    r: parseInt(normalized.slice(0, 2), 16),
    g: parseInt(normalized.slice(2, 4), 16),
    b: parseInt(normalized.slice(4, 6), 16),
  };
};

const rgbToHex = ({ r, g, b }) =>
  `#${clampChannel(r).toString(16).padStart(2, "0")}${clampChannel(g)
    .toString(16)
    .padStart(2, "0")}${clampChannel(b).toString(16).padStart(2, "0")}`.toUpperCase();

const mixRgb = (base, target, targetWeight) => {
  const baseWeight = 1 - targetWeight;

  return {
    r: base.r * baseWeight + target.r * targetWeight,
    g: base.g * baseWeight + target.g * targetWeight,
    b: base.b * baseWeight + target.b * targetWeight,
  };
};

const buildAreaPalette = (tint) => {
  const tintRgb = hexToRgb(tint);
  const borderRgb = mixRgb(tintRgb, { r: 148, g: 163, b: 184 }, 0.36);
  const accentRgb = mixRgb(tintRgb, { r: 30, g: 41, b: 59 }, 0.78);

  return {
    tint,
    border: rgbToHex(borderRgb),
    accent: rgbToHex(accentRgb),
  };
};

export const getResearchAreaPalette = (areaKey = "") => {
  const normalizedKey = String(areaKey).trim().toLowerCase();
  const presetIndex = PRESET_AREA_INDEX[normalizedKey];
  const resolvedIndex =
    typeof presetIndex === "number"
      ? presetIndex
      : hashString(normalizedKey || "research-area") % BASE_PASTEL_POOL.length;
  const tint = BASE_PASTEL_POOL[resolvedIndex];

  return buildAreaPalette(tint);
};
