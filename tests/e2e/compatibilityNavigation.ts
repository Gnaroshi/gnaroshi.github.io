import type { Page, Response } from "@playwright/test";

const compatibilityPath = /^(?:\/ko)?\/(?:papers|formula|questions)\/?$|^(?:\/ko)?\/papers\/[^/]+\/(?:formula|exam\/live)\/?$/;

function refreshTarget(html: string): string | null {
  const meta = html.match(/<meta\b(?=[^>]*\bhttp-equiv\s*=\s*["']refresh["'])[^>]*>/i)?.[0];
  const content = meta?.match(/\bcontent\s*=\s*(?:"([^"]*)"|'([^']*)')/i)?.slice(1).find((value) => value !== undefined);
  const target = content?.match(/^\s*\d+(?:\.\d+)?\s*;\s*url\s*=\s*(.+?)\s*$/i)?.[1];
  return target?.replace(/^['"]|['"]$/g, "").replaceAll("&amp;", "&") ?? null;
}

/** Wait for the actual static compatibility destination, never for an arbitrary delay. */
export async function gotoPublicRoute(page: Page, route: string): Promise<Response | null> {
  let destination: URL | null = null;
  if (compatibilityPath.test(new URL(route, "http://local.invalid").pathname)) {
    let document = await page.request.get(route);
    const origin = new URL(document.url()).origin;
    let current = new URL(document.url());
    for (let redirects = 0; redirects < 5; redirects += 1) {
      const target = refreshTarget(await document.text());
      if (!target) break;
      const next = new URL(target, current);
      if (next.origin !== origin) throw new Error(`Compatibility route leaves the local site: ${route}`);
      destination = next;
      document = await page.request.get(next.href);
      current = next;
      if (redirects === 4 && refreshTarget(await document.text())) throw new Error(`Compatibility redirect loop: ${route}`);
    }
  }
  const response = await page.goto(route);
  if (destination) {
    await page.waitForURL(destination.href, { waitUntil: "domcontentloaded" });
    await page.locator("main#content").waitFor({ state: "visible" });
  }
  return response;
}
