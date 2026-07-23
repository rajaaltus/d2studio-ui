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
  baseName: "LIGHT_THEME" | "DARK_THEME",
  value: number,
  label: string,
) {
  const changed = (Object.keys(theme) as (keyof BarTheme)[]).filter(
    (k) => JSON.stringify(theme[k]) !== JSON.stringify(base[k]),
  );

  const named = [
    ...(baseName === "DARK_THEME" ? ["DARK_THEME"] : []),
    ...(changed.length && baseName === "LIGHT_THEME" ? ["LIGHT_THEME"] : []),
  ];

  const props = [`  value={${value}}`];
  if (label !== "Progress..") props.push(`  label="${label}"`);
  if (changed.length) {
    props.push(
      `  theme={{\n    ...${baseName},\n${changed
        .map((k) => `    ${k}: ${literal(theme[k])},`)
        .join("\n")}\n  }}`,
    );
  } else if (baseName === "DARK_THEME") {
    props.push(`  theme={DARK_THEME}`);
  }

  return [
    `import ProgressBar${named.length ? `, { ${named.join(", ")} }` : ""} from "@/components/progress-bar";`,
    "",
    "<ProgressBar",
    ...props,
    "/>",
  ].join("\n");
}
