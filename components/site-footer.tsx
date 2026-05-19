"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Logo from "@/components/logo";
import { FooterIllustrationCard } from "@/components/footer-illustration-card";

export function SiteFooter() {
  const sections: {
    title: string;
    links: { label: string; href: string; external?: boolean }[];
  }[] = [
    {
      title: "Library",
      links: [
        { label: "Blocks", href: "/blocks" },
        { label: "Spinners", href: "/spinners" },
        { label: "Components", href: "/blocks" },
        { label: "Docs", href: "/docs" },
      ],
    },
    {
      title: "Resources",
      links: [
        { label: "Getting started", href: "/docs" },
        { label: "Changelog", href: "/docs#changelog" },
        { label: "shadcn/ui", href: "https://ui.shadcn.com", external: true },
        { label: "Tailwind CSS", href: "https://tailwindcss.com", external: true },
      ],
    },
    {
      title: "Connect",
      links: [
        { label: "X / Twitter", href: "https://x.com/uxgodwin", external: true },
        { label: "GitHub", href: "https://github.com/rajaaltus", external: true },
        { label: "Buy me a coffee", href: "https://buymeacoffee.com/godwindev", external: true },
        { label: "rajaaltus@gmail.com", href: "mailto:rajaaltus@gmail.com", external: true },
      ],
    },
  ];

  return (
    <footer className="w-full [--pattern-fg:var(--color-black)]/10 dark:[--pattern-fg:var(--color-white)]/10">
      {/* Top divider line */}
      <div className="w-full max-w-6xl border-x border-t mx-auto" />

      {/* Diagonal pattern strip */}
      <div className="w-full border-x min-h-[2.5rem] mx-auto max-w-6xl border-x-(--pattern-fg) bg-[image:repeating-linear-gradient(315deg,_var(--pattern-fg)_0,_var(--pattern-fg)_1px,_transparent_0,_transparent_50%)] bg-[size:10px_10px] bg-fixed">
        <div className="w-full h-[2.5rem] max-w-6xl border-x mx-auto"></div>
      </div>

      {/* Main grid */}
      <section className="max-w-6xl w-full border-x mx-auto bg-border">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-px bg-border border overflow-hidden m-0 lg:rounded-xl">
          {/* Brand block – spans 2 cols on large */}
          <div className="bg-background p-6 lg:p-8 sm:col-span-2 flex flex-col gap-4">
            <Logo />
            <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
              A premium collection of copy &amp; paste components built with
              React, Tailwind CSS and shadcn/ui. Beautiful, accessible, and
              ready for production.
            </p>
            <div className="mt-auto inline-flex items-center gap-2 text-xs text-muted-foreground font-mono">
              <span className="inline-block size-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_oklch(0.7_0.2_150/0.8)]" />
              New blocks shipping every weekend
            </div>
          </div>

          {/* Link columns */}
          {sections.map((section) => (
            <div
              key={section.title}
              className="bg-background p-6 lg:p-8 flex flex-col gap-3"
            >
              <h3 className="font-semibold text-sm font-sans tracking-tight">
                {section.title}
              </h3>
              <ul className="flex flex-col gap-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <FooterLink {...link} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom bar */}
      <section className="max-w-6xl w-full border-x mx-auto">
        <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-4 px-4 lg:px-6 py-5 border-t">
          <div className="text-xs text-muted-foreground inline-flex items-center gap-1.5 font-mono">
            © {new Date().getFullYear()}{" "}
            <a
              href="https://www.d2studio.dev/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-foreground hover:underline"
            >
              D2 Studio
            </a>
            <span className="opacity-60">·</span> Built with <HeartBeat /> for
            the community.
          </div>

          <div className="flex items-center gap-1">
            <SocialIconLink
              href="https://x.com/uxgodwin"
              label="X (formerly Twitter)"
            >
              <XIcon className="h-3.5 w-3.5" />
            </SocialIconLink>
            <SocialIconLink
              href="https://github.com/rajaaltus"
              label="GitHub"
            >
              <GitHubIcon className="h-4 w-4" />
            </SocialIconLink>
            <SocialIconLink
              href="mailto:rajaaltus@gmail.com"
              label="Email"
            >
              <MailIcon className="h-4 w-4" />
            </SocialIconLink>
          </div>
        </div>
      </section>

      <FooterIllustrationCard />
    </footer>
  );
}

function FooterLink({
  label,
  href,
  external,
}: {
  label: string;
  href: string;
  external?: boolean;
}) {
  const className =
    "group inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors";

  const content = (
    <>
      <span>{label}</span>
      {external && (
        <ArrowUpRight className="h-3 w-3 opacity-0 -translate-x-1 group-hover:opacity-60 group-hover:translate-x-0 transition-all" />
      )}
    </>
  );

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {content}
    </Link>
  );
}

function SocialIconLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="inline-flex items-center justify-center size-8 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
    >
      {children}
    </a>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1200 1227"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M714.163 519.284 1160.89 0h-105.86L667.137 450.887 357.328 0H0l468.492 681.821L0 1226.37h105.866l409.625-476.152 327.181 476.152H1200L714.137 519.284h.026ZM569.165 687.828l-47.468-67.894-377.686-540.24h162.604l304.797 435.991 47.468 67.894 396.2 566.721H892.476L569.165 687.854v-.026Z" />
    </svg>
  );
}

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.31.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2Z"
      />
    </svg>
  );
}

function MailIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

function HeartBeat() {
  return (
    <span className="heart-wrap" aria-hidden="true">
      <span className="text-red-500 heart-main">❤</span>
      <span className="heart-mini heart-mini-1">❤</span>
      <span className="heart-mini heart-mini-2">❤</span>
      <span className="heart-mini heart-mini-3">❤</span>
      <style jsx>{`
        .heart-wrap {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          vertical-align: middle;
          width: 1em;
          height: 1em;
          line-height: 1;
        }
        .heart-main {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          line-height: 1;
          transform-origin: center;
          animation: heartbeat 1.2s ease-in-out infinite;
        }
        .heart-mini {
          position: absolute;
          left: 50%;
          bottom: 40%;
          color: rgb(239 68 68);
          font-size: 0.5em;
          opacity: 0;
          pointer-events: none;
          animation: heart-float 2.4s ease-out infinite;
        }
        .heart-mini-1 {
          animation-delay: 0s;
          --dx: -10px;
        }
        .heart-mini-2 {
          animation-delay: 0.8s;
          --dx: 8px;
        }
        .heart-mini-3 {
          animation-delay: 1.6s;
          --dx: -2px;
        }
        @keyframes heartbeat {
          0%,
          100% {
            transform: scale(1);
          }
          25% {
            transform: scale(1.25);
          }
          50% {
            transform: scale(0.95);
          }
          75% {
            transform: scale(1.15);
          }
        }
        @keyframes heart-float {
          0% {
            opacity: 0;
            transform: translate(-50%, 0) scale(0.5);
          }
          15% {
            opacity: 1;
          }
          100% {
            opacity: 0;
            transform: translate(calc(-50% + var(--dx, 0)), -32px) scale(0.9);
          }
        }
      `}</style>
    </span>
  );
}
