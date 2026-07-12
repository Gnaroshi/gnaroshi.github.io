import { existsSync, readFileSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { extname, resolve, sep } from "node:path";

const metadataPath = resolve("artifacts/project-showcases/candidates.json");
function candidates() { return existsSync(metadataPath) ? JSON.parse(readFileSync(metadataPath, "utf8")).candidates ?? [] : []; }
export function getStaticPaths() { if (process.env.NODE_ENV === "production") return []; return candidates().flatMap((item:any) => [item.avif, item.webp].map((path:string) => ({ params: { path } }))); }
export async function GET({ params }:{params:{path?:string}}) { const requested=params.path??""; const allowed=new Set(candidates().flatMap((item:any)=>[item.avif,item.webp])); if(!allowed.has(requested)) return new Response("Not found",{status:404}); const root=resolve("artifacts/project-showcases"); const path=resolve(root,requested); if(!path.startsWith(`${root}${sep}`)) return new Response("Not found",{status:404}); return new Response(await readFile(path),{headers:{"Content-Type":extname(path)===".avif"?"image/avif":"image/webp","Cache-Control":"no-store"}}); }
