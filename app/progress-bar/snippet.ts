import type { BarTheme } from "@/registry/default/components/progress-bar";

export const INSTALL_CMD =
  "npx shadcn@latest add https://d2studio.dev/r/progress-bar.json";

/** JSON → JS object literal. Safe here: no key or value in BarTheme contains a quote or comma. */
const literal = (v: unknown) =>
  JSON.stringify(v)
    .replace(/"([a-zA-Z]\w*)":/g, "$1: ")
    .replace(/,/g, ", ");

/** Emits a usage snippet carrying only the keys the user actually changed. */
export function usageSnippet(
  theme: BarTheme,
  base: BarTheme,
  baseName: string,
  value: number,
  label: string,
) {
  const changed = (Object.keys(theme) as (keyof BarTheme)[]).filter(
    (k) => JSON.stringify(theme[k]) !== JSON.stringify(base[k]),
  );

  // LIGHT_THEME is the component's default, so an untouched light theme needs
  // neither the import nor the prop.
  const named =
    changed.length || baseName !== "LIGHT_THEME" ? [baseName] : [];

  const props = [`  value={${value}}`];
  if (label !== "Progress..") props.push(`  label="${label}"`);
  if (changed.length) {
    props.push(
      `  theme={{\n    ...${baseName},\n${changed
        .map((k) => `    ${k}: ${literal(theme[k])},`)
        .join("\n")}\n  }}`,
    );
  } else if (named.length) {
    props.push(`  theme={${baseName}}`);
  }

  // Named imports go on their own lines: inline, `FANCY_DARK_THEME` pushes the
  // import past the width of the code block and the path gets clipped.
  return [
    named.length
      ? `import ProgressBar, {\n${named.map((n) => `  ${n},`).join("\n")}\n} from "@/components/progress-bar";`
      : `import ProgressBar from "@/components/progress-bar";`,
    "",
    "<ProgressBar",
    ...props,
    "/>",
  ].join("\n");
}
