import { ArrowUpRight, GitFork, Github, Star } from "lucide-react";

import { D2Card } from "@/components/ui/d2-card";

export type GithubRepo = {
  /** owner/name, exactly as it reads on github.com. */
  owner: string;
  name: string;
  description: string;
  language: string;
  /** Any CSS colour: GitHub's own language colour, or your own. */
  languageColor: string;
  stars: number;
  forks: number;
  href: string;
};

// Sample rows so the block renders on its own. Swap them for your own list,
// or pass `repos` from the GitHub API — the shape is the same either way.
const DEFAULT_REPOS: GithubRepo[] = [
  {
    owner: "shadcn-ui",
    name: "ui",
    description:
      "Components you can copy and paste into your apps. Accessible, customizable, open source.",
    language: "TypeScript",
    languageColor: "#3178c6",
    stars: 96400,
    forks: 6300,
    href: "https://github.com/shadcn-ui/ui",
  },
  {
    owner: "vercel",
    name: "next.js",
    description:
      "The React framework: file-system routing, server components and hybrid rendering out of the box.",
    language: "JavaScript",
    languageColor: "#f1e05a",
    stars: 133000,
    forks: 28600,
    href: "https://github.com/vercel/next.js",
  },
  {
    owner: "tailwindlabs",
    name: "tailwindcss",
    description:
      "A utility-first CSS framework for rapidly building custom user interfaces.",
    language: "TypeScript",
    languageColor: "#3178c6",
    stars: 88900,
    forks: 4600,
    href: "https://github.com/tailwindlabs/tailwindcss",
  },
  {
    owner: "motiondivision",
    name: "motion",
    description:
      "A production-ready animation library for React and vanilla JavaScript, built on the Web Animations API.",
    language: "TypeScript",
    languageColor: "#3178c6",
    stars: 28900,
    forks: 990,
    href: "https://github.com/motiondivision/motion",
  },
  {
    owner: "TanStack",
    name: "query",
    description:
      "Asynchronous state management: caching, background refetching and pagination without the boilerplate.",
    language: "TypeScript",
    languageColor: "#3178c6",
    stars: 46800,
    forks: 3400,
    href: "https://github.com/TanStack/query",
  },
  {
    owner: "biomejs",
    name: "biome",
    description:
      "One fast Rust toolchain that formats and lints JavaScript, TypeScript, JSON and CSS.",
    language: "Rust",
    languageColor: "#dea584",
    stars: 20800,
    forks: 830,
    href: "https://github.com/biomejs/biome",
  },
];

const compact = new Intl.NumberFormat("en", {
  notation: "compact",
  maximumFractionDigits: 1,
});

export default function GithubRepos({
  title = "Top GitHub repositories",
  description = "The tools we reach for most. Every one of them free, open source and worth the stars.",
  repos = DEFAULT_REPOS,
}: {
  title?: string;
  description?: string;
  repos?: GithubRepo[];
}) {
  return (
    <section className="@container font-sans w-full py-12 @md:py-16">
      <div className="mx-auto w-full max-w-6xl px-4 @md:px-6">
        <div className="mb-10 flex flex-col gap-4 @xl:flex-row @xl:items-end @xl:justify-between">
          <div className="space-y-3">
            <span className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs text-muted-foreground">
              <Github className="size-3.5" aria-hidden />
              Open source
            </span>
            <h2 className="text-3xl @md:text-4xl font-bold tracking-tight">
              {title}
            </h2>
            <p className="max-w-[560px] text-muted-foreground @md:text-lg">
              {description}
            </p>
          </div>
        </div>

        <ul className="grid gap-4 @md:grid-cols-2 @xl:grid-cols-3">
          {repos.map((repo) => (
            <li key={repo.href}>
              <D2Card className="group h-full py-0 transition-colors hover:border-foreground/20">
                <a
                  href={repo.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="flex h-full flex-col gap-4 p-5 outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-2xl"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-xs text-muted-foreground">
                        {repo.owner}
                      </p>
                      <p className="truncate font-semibold">{repo.name}</p>
                    </div>
                    <ArrowUpRight
                      className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      aria-hidden
                    />
                  </div>

                  <p className="line-clamp-3 flex-1 text-sm text-muted-foreground">
                    {repo.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5">
                      <span
                        aria-hidden
                        className="size-2.5 rounded-full"
                        style={{ backgroundColor: repo.languageColor }}
                      />
                      {repo.language}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Star className="size-3.5" aria-hidden />
                      {compact.format(repo.stars)}
                      <span className="sr-only"> stars</span>
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <GitFork className="size-3.5" aria-hidden />
                      {compact.format(repo.forks)}
                      <span className="sr-only"> forks</span>
                    </span>
                  </div>
                </a>
              </D2Card>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
