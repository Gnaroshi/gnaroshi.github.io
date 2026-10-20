import { cpSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { finalizeDerivedFixture } from "./derived-feed-fixture.mjs";

export function createPaperDiscoveryFixture(contractRoot, mode = "korean-only") {
  if (!["korean-only", "mixed"].includes(mode)) throw new Error("Unknown paper discovery fixture mode");
  const directory = mkdtempSync(join(tmpdir(), `gnaroshi-paper-${mode}-`));
  try {
    cpSync(join(contractRoot, "fixtures", "translated-paper-pair"), directory, { recursive: true });
    const template = readFileSync(join(directory, "papers/ko/paper-pair-korean.mdx"), "utf8");
    const sourceOnly = (id, locale, title) => template
      .replace(/^id:.*$/m, `id: ${id}`)
      .replace(/^locale:.*$/m, `locale: ${locale}`)
      .replace(/^translationKey:.*$/m, `translationKey: ${id}`)
      .replace(/^translationStatus:.*$/m, "translationStatus: source-only")
      .replace(/^canonicalSlug:.*$/m, `canonicalSlug: ${id}`)
      .replace(/^aliases:\n(?:  -.*\n)+/m, "aliases: []\n")
      .replace(/^title:.*$/m, `title: ${title}`);
    if (mode === "korean-only") {
      rmSync(join(directory, "papers/en/paper-pair-english.mdx"));
      rmSync(join(directory, "papers/ko/paper-pair-korean.mdx"));
    }
    mkdirSync(join(directory, "papers/ko"), { recursive: true });
    writeFileSync(join(directory, "papers/ko/korean-only-paper.mdx"), sourceOnly("korean-only-paper", "ko", "한국어 논문 정리"));
    if (mode === "mixed") {
      mkdirSync(join(directory, "papers/en"), { recursive: true });
      writeFileSync(join(directory, "papers/en/english-only-paper.mdx"), sourceOnly("english-only-paper", "en", "English paper note"));
      // Equal slugs across locales are valid, but these are distinct families.
      for (const [id, locale, title, difficulty] of [
        ["collision-en", "en", "Collision A English note", 1],
        ["collision-ko", "ko", "Collision Z 한국어 정리", 5]
      ]) {
        const content = sourceOnly(id, locale, title)
          .replace(/^canonicalSlug:.*$/m, "canonicalSlug: shared-paper-slug")
          .replace(/^difficulty:.*$/m, `difficulty: ${difficulty}`);
        writeFileSync(join(directory, "papers", locale, `${id}.mdx`), content);
      }
    }
    finalizeDerivedFixture(directory, contractRoot);
    return { directory, mode, dispose: () => rmSync(directory, { recursive: true, force: true }) };
  } catch (error) {
    rmSync(directory, { recursive: true, force: true });
    throw error;
  }
}
