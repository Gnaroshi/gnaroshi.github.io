import {existsSync,readdirSync,readFileSync} from "node:fs";
import {join} from "node:path";
import {parseFrontmatter} from "@astrojs/markdown-remark";
import {contentFeedRoot} from "../../src/utils/contentFeed";

export function hasLocalePapers(locale:"en"|"ko"):boolean {
  const directory=join(contentFeedRoot,"papers",locale);
  return existsSync(directory) && readdirSync(directory,{recursive:true}).some(file=>{
    if(typeof file !== "string" || !/\.mdx?$/.test(file))return false;
    return parseFrontmatter(readFileSync(join(directory,file),"utf8")).frontmatter.visibility === "public";
  });
}

export function hasPublicPaperCollection(): boolean {
  return hasLocalePapers("en") || hasLocalePapers("ko");
}
