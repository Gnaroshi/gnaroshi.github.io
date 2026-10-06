export function editorialIntroductions(document) {
  return [...document.querySelectorAll(".page-header > .lede, .paper-hero .lede, .identity-hero__bio")]
    .filter((element) => !element.closest("[hidden], [data-content-role='count']"))
    .map((element) => String(element.textContent ?? "").replace(/\s+/g, " ").trim())
    .filter(Boolean);
}

export function shellElementCount(document, selector) {
  // A locale-dependent collection must never hide a duplicate page heading.
  if (selector === "h1") return document.querySelectorAll(selector).length;
  // Locales may have different articles/year groups. Compare the shared page
  // structure, not a translation's independent published collection contents.
  return [...document.querySelectorAll(selector)]
    .filter((element) => !element.closest("[data-content-group]"))
    .length;
}
