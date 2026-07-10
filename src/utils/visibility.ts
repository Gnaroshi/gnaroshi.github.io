export type Visibility = "public" | "unlisted" | "hidden";

type VisibilityInput = {
  visibility?: Visibility;
  draft?: boolean;
};

type VisibilityOptions = {
  includeDrafts?: boolean;
  includeHidden?: boolean;
};

export function getVisibility(item?: VisibilityInput): Visibility {
  return item?.visibility ?? "public";
}

export function isPublic(item?: VisibilityInput): boolean {
  return getVisibility(item) === "public";
}

export function isUnlisted(item?: VisibilityInput): boolean {
  return getVisibility(item) === "unlisted";
}

export function isHidden(item?: VisibilityInput): boolean {
  return getVisibility(item) === "hidden";
}

export function shouldShowInIndex(item?: VisibilityInput, options: VisibilityOptions = {}): boolean {
  if (item?.draft && !options.includeDrafts) return false;
  return isPublic(item);
}

export function shouldBuildDetailPage(item?: VisibilityInput, options: VisibilityOptions = {}): boolean {
  if (item?.draft && !options.includeDrafts) return false;
  if (isHidden(item)) return Boolean(options.includeHidden);
  return isPublic(item) || isUnlisted(item);
}

export function shouldIncludeInPublicStats(item?: VisibilityInput, options: VisibilityOptions = {}): boolean {
  if (item?.draft && !options.includeDrafts) return false;
  return isPublic(item);
}
