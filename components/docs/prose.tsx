import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

// The type scale every docs page shares: /docs and each /components page set
// headings, lead and body copy through these, so the two read as one manual.

export function Section({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24">
      {children}
    </section>
  );
}

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
      {children}
    </p>
  );
}

export function H2({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2 className="group mb-3 flex items-baseline gap-2 text-2xl font-medium tracking-tight">
      <a href={`#${id}`} className="outline-none focus-visible:underline">
        {children}
      </a>
      <span
        aria-hidden
        className="font-mono text-base text-muted-foreground/50 opacity-0 transition-opacity duration-150 ease-out group-hover:opacity-100"
      >
        #
      </span>
    </h2>
  );
}

export function H3({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mb-2.5 text-sm font-medium text-foreground">{children}</h3>
  );
}

export function Lead({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-base leading-relaxed text-pretty text-muted-foreground">
      {children}
    </p>
  );
}

export function P({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p
      className={`text-sm leading-relaxed text-pretty text-muted-foreground ${className}`}
    >
      {children}
    </p>
  );
}

export function Code({ children }: { children: React.ReactNode }) {
  return (
    <code className="rounded border bg-muted/50 px-1 py-px font-mono text-[0.8125rem] text-foreground">
      {children}
    </code>
  );
}

export function TextLink({
  href,
  external,
  children,
}: {
  href: string;
  external?: boolean;
  children: React.ReactNode;
}) {
  const className =
    "inline-flex items-center gap-0.5 font-medium text-foreground underline decoration-foreground/25 underline-offset-4 transition-[text-decoration-color] duration-150 ease-out hover:decoration-foreground";
  if (!external) {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
      {children}
      <ArrowUpRight aria-hidden className="size-3.5 text-muted-foreground" />
    </a>
  );
}

export function Step({
  n,
  title,
  children,
}: {
  n: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <li className="relative pl-10">
      <span
        aria-hidden
        className="absolute left-0 top-0 flex size-6 items-center justify-center rounded-md border bg-background font-mono text-xs text-muted-foreground"
      >
        {n}
      </span>
      <h3 className="mb-1.5 text-base font-medium leading-6 text-foreground">
        {title}
      </h3>
      <div className="space-y-4">{children}</div>
    </li>
  );
}
