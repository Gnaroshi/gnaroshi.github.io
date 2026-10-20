import { cpSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { finalizeDerivedFixture } from "./derived-feed-fixture.mjs";

/** Test-only derived public fixture. The canonical validator owns its counts/hash. */
export function createBlogDiscoveryFixture(contractRoot) {
  const directory = mkdtempSync(join(tmpdir(), "gnaroshi-blog-discovery-"));
  try {
    cpSync(join(contractRoot, "fixtures", "one-english-blog"), directory, { recursive: true });
    const template = readFileSync(join(directory, "blog/en/english-only.mdx"), "utf8");
    const records = [
      ["korean-only-1", "ko", "korean-only-1", "source-only"],
      ["korean-only-2", "ko", "korean-only-2", "source-only"],
      ["korean-only-3", "ko", "korean-only-3", "source-only"],
      ["complete-en", "en", "complete-work", "complete"],
      ["complete-ko", "ko", "complete-work", "complete"],
      ["partial-en", "en", "partial-work", "partial"],
      ["partial-ko", "ko", "partial-work", "partial"]
    ];
    for (const [id, locale, key, status] of records) {
      const content = template
        .replace(/^id:.*$/m, `id: ${id}`)
        .replace(/^locale:.*$/m, `locale: ${locale}`)
        .replace(/^translationKey:.*$/m, `translationKey: ${key}`)
        .replace(/^translationStatus:.*$/m, `translationStatus: ${status}`)
        .replace(/^canonicalSlug:.*$/m, `canonicalSlug: ${id}`)
        .replace(/^title:.*$/m, `title: Post ${id}`)
        .replace(/^description:.*$/m, `description: Public description for ${id}.`)
        .replace(/^tags:\n  - research/m, "tags:\n  - research\n  - world model");
      mkdirSync(join(directory, "blog", locale), { recursive: true });
      writeFileSync(join(directory, "blog", locale, `${id}.mdx`), content);
    }
    finalizeDerivedFixture(directory, contractRoot);
    return { directory, dispose: () => rmSync(directory, { recursive: true, force: true }) };
  } catch (error) {
    rmSync(directory, { recursive: true, force: true });
    throw error;
  }
}
