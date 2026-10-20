import assert from "node:assert/strict";
import test from "node:test";
import { deduplicateTranslations } from "../../src/utils/localizedContent.ts";

const entry = (id, locale, translationKey = id, translationStatus = "source-only") => ({
  id, data: { locale, translationKey, translationStatus }
});

test("single-language works remain discoverable from either interface locale", () => {
  const en = entry("en-only", "en");
  const ko = entry("ko-only", "ko");
  for (const locale of ["en", "ko"]) {
    assert.deepEqual(deduplicateTranslations([en, ko], locale), [en, ko]);
  }
});

test("complete and partial pairs prefer an existing requested locale exactly once", () => {
  for (const state of ["complete", "partial"]) {
    const en = entry("english-slug", "en", "same-work", state);
    const ko = entry("different-korean-slug", "ko", "same-work", state);
    for (const input of [[en, ko], [ko, en]]) {
      assert.deepEqual(deduplicateTranslations(input, "en"), [en]);
      assert.deepEqual(deduplicateTranslations(input, "ko"), [ko]);
    }
  }
});

test("a later real translation replaces only the preferred representation", () => {
  const ko = entry("note-ko", "ko", "note");
  const en = entry("note-en", "en", "note", "complete");
  assert.deepEqual(deduplicateTranslations([ko], "en"), [ko]);
  assert.deepEqual(deduplicateTranslations([ko, en], "en"), [en]);
  assert.deepEqual(deduplicateTranslations([ko, en], "ko"), [ko]);
});

test("unrelated works are never paired by slug, title or array position", () => {
  const en = entry("same-slug", "en", "first-work");
  const ko = entry("same-slug", "ko", "second-work");
  assert.deepEqual(deduplicateTranslations([en, ko], "ko"), [en, ko]);
});

test("selection does not mutate input records or order", () => {
  const ko = entry("ko", "ko", "pair");
  const en = entry("en", "en", "pair");
  const other = entry("other", "ko");
  const input = [ko, other, en];
  const before = structuredClone(input);
  assert.deepEqual(deduplicateTranslations(input, "en"), [en, other]);
  assert.deepEqual(input, before);
});
