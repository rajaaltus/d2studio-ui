import { codeToHtml } from "shiki";

/**
 * Highlighted at build time, on the server: a docs page is static, so the
 * grammar and both themes never reach the client. Colours are emitted as
 * --shiki-light / --shiki-dark variables and picked by CodeFrame off the
 * `.dark` class, so a theme switch recolours code without re-highlighting.
 */
export function highlight(code: string, lang = "tsx") {
  return codeToHtml(code, {
    lang,
    themes: { light: "github-light-default", dark: "github-dark-default" },
    defaultColor: false,
  });
}

/**
 * Registry sources import siblings as `@/registry/default/...` (the CLI
 * rewrites that on install). A reader copying by hand gets the path they will
 * actually have.
 */
export const asInstalled = (src: string) =>
  src
    .replace(/@\/registry\/default\/ui\//g, "@/components/ui/")
    .replace(/@\/registry\/default\/hooks\//g, "@/hooks/");
