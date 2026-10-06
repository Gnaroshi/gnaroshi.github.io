import assert from "node:assert/strict";
import test from "node:test";
import { parseHTML } from "linkedom";
import { editorialIntroductions, shellElementCount } from "./public-tone-structure.mjs";

test("collection counts are not editorial introductions, while real repeated copy remains checkable", () => {
  const { document } = parseHTML('<header class="page-header"><p class="lede" data-content-role="count">1개</p><p class="lede">실제 소개 문장</p><p class="lede" hidden>숨김</p></header>');
  assert.deepEqual(editorialIntroductions(document), ["실제 소개 문장"]);
});

test("empty and Korean-only populated archives share a shell without requiring fabricated English articles", () => {
  const empty = parseHTML('<main><h1>Archive</h1><section><div>No posts</div></section></main>').document;
  const populated = parseHTML('<main><h1>글 보관함</h1><section><section data-content-group><h2>2026</h2><article>글</article></section></section></main>').document;
  assert.equal(shellElementCount(empty, "main section"), 1);
  assert.equal(shellElementCount(populated, "main section"), 1);
  assert.equal(shellElementCount(empty, "h1"), shellElementCount(populated, "h1"));
});

test("a missing real layout section is still detected", () => {
  const complete = parseHTML('<main><section></section><section></section></main>').document;
  const broken = parseHTML('<main><section></section></main>').document;
  assert.notEqual(shellElementCount(complete, "main section"), shellElementCount(broken, "main section"));
});

test("content groups cannot hide duplicate page headings", () => {
  const document = parseHTML('<main><h1>Writing</h1><section data-content-group><h1>Duplicate</h1></section></main>').document;
  assert.equal(shellElementCount(document, "h1"), 2);
});
