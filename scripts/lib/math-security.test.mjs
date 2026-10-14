import assert from "node:assert/strict";
import test from "node:test";
import katex from "katex";
import { parseHTML } from "linkedom";

test("KaTeX is outside the reported vulnerable version range",()=>{
  const [major,minor,patch]=katex.version.split(".").map(Number);
  assert.ok(major>0||minor>18||(minor===18&&patch>=2));
});
test("ordinary formula output retains MathML and visual math",()=>{
  const {document}=parseHTML(katex.renderToString("\\frac{a}{b}+x^2",{trust:false}));
  assert.ok(document.querySelector("math"));
  assert.ok(document.querySelector(".katex-html"));
});
test("untrusted URL and HTML commands do not become links or executable markup",()=>{
  for(const source of ["\\href{javascript:alert(1)}{x}","\\href{https://example.org}{x}","\\htmlClass{injected}{x}"]){
    const {document}=parseHTML(katex.renderToString(source,{trust:false,throwOnError:false,strict:false}));
    assert.equal(document.querySelectorAll("a,script,.injected").length,0);
  }
});
