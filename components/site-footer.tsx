"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Logo from "@/components/logo";
import { FooterIllustrationCard } from "@/components/footer-illustration-card";
import { PixelSoloTlSpinner } from "@/components/icons/pixel-solo-tl-spinner";

type PreviewProfile = {
  name: string;
  handle: string;
  avatar: string;
};

type FooterLinkItem = {
  label: string;
  href: string;
  external?: boolean;
  preview?: PreviewProfile;
};

export function SiteFooter() {
  const sections: {
    title: string;
    links: FooterLinkItem[];
  }[] = [
    {
      title: "Library",
      links: [
        { label: "Blocks", href: "/blocks" },
        { label: "Spinners", href: "/spinners" },
        { label: "Cosmo", href: "/cosmo" },
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
        {
          label: "X / @uxgodwin",
          href: "https://x.com/uxgodwin",
          external: true,
          preview: {
            name: "Godwin",
            handle: "@uxgodwin",
            avatar: "/uxgodwin.jpg",
          },
        },
        {
          label: "X / @rajaaltus",
          href: "https://x.com/rajaaltus",
          external: true,
          preview: {
            name: "Raja Altus",
            handle: "@rajaaltus",
            avatar: "/rajaaltus.jpg",
          },
        },
        {
          label: "Threads",
          href: "https://www.threads.com/@godwin.d2",
          external: true,
          preview: {
            name: "Godwin",
            handle: "@godwin.d2",
            avatar: "/godwin-d2.jpg",
          },
        },
        { label: "GitHub", href: "https://github.com/godwin159", external: true },
        { label: "Buy me a coffee", href: "https://buymeacoffee.com/godwindev", external: true },
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-px bg-border border overflow-hidden m-0 lg:rounded-xl">
          {/* Brand block – spans full row on md, 2 cols on large */}
          <div className="bg-background p-6 lg:p-8 sm:col-span-2 md:col-span-3 lg:col-span-2 flex flex-col gap-4">
            <Logo />
            <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
              A premium collection of copy &amp; paste components built with
              React, Tailwind CSS and shadcn/ui. Beautiful, accessible, and
              ready for production.
            </p>
            <div className="mt-auto inline-flex items-center gap-2 text-xs text-muted-foreground font-mono">
              <PixelSoloTlSpinner
                style={
                  {
                    "--cell": "3px",
                    "--gap": "1px",
                  } as React.CSSProperties
                }
              />
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
              href="https://www.threads.com/@godwin.d2"
              label="Threads"
            >
              <ThreadsIcon className="h-4 w-4" />
            </SocialIconLink>
            <SocialIconLink
              href="https://github.com/godwin159"
              label="GitHub"
            >
              <GitHubIcon className="h-4 w-4" />
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
  preview,
}: FooterLinkItem) {
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

  const linkEl = external ? (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      {content}
    </a>
  ) : (
    <Link href={href} className={className}>
      {content}
    </Link>
  );

  if (!preview) {
    return linkEl;
  }

  return (
    <span className="relative inline-flex group/preview">
      {linkEl}
      <span
        role="tooltip"
        aria-label={preview.name}
        className="pointer-events-none absolute left-0 bottom-full mb-2 z-20 rounded-full border border-border bg-popover p-1 shadow-lg opacity-0 -translate-y-1 transition-all duration-150 group-hover/preview:opacity-100 group-hover/preview:translate-y-0 group-focus-within/preview:opacity-100 group-focus-within/preview:translate-y-0"
      >
        <img
          src={preview.avatar}
          alt={preview.name}
          className="size-10 rounded-full object-cover"
        />
      </span>
    </span>
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

function ThreadsIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 192 192"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M141.537 88.988a66.667 66.667 0 0 0-2.518-1.143c-1.482-27.307-16.403-42.94-41.457-43.1h-.34c-14.986 0-27.449 6.396-35.12 18.036l13.779 9.452c5.73-8.695 14.724-10.548 21.348-10.548h.229c8.249.052 14.474 2.45 18.503 7.13 2.932 3.405 4.893 8.111 5.864 14.05-7.314-1.243-15.224-1.626-23.68-1.14-23.82 1.371-39.134 15.264-38.105 34.568.522 9.792 5.4 18.216 13.735 23.719 7.047 4.652 16.124 6.927 25.557 6.412 12.458-.683 22.231-5.436 29.049-14.127 5.178-6.6 8.453-15.153 9.898-25.948 5.937 3.583 10.337 8.298 12.767 13.966 4.132 9.635 4.373 25.468-8.546 38.376-11.319 11.308-24.925 16.2-45.488 16.351-22.809-.169-40.06-7.484-51.275-21.742C35.236 139.966 29.808 120.682 29.605 96c.203-24.682 5.63-43.966 16.133-57.317C56.954 24.425 74.204 17.11 97.013 16.94c22.975.17 40.526 7.52 52.171 21.847 5.71 7.026 10.015 15.86 12.853 26.162l16.147-4.308c-3.44-12.68-8.853-23.606-16.219-32.668C147.036 9.607 125.202.195 97.07 0h-.113C68.882.194 47.292 9.642 32.788 28.08 19.882 44.485 13.224 67.315 13.001 95.932L13 96l.001.068c.223 28.617 6.881 51.447 19.787 67.853C47.292 182.358 68.882 191.806 96.957 192h.113c24.96-.173 42.554-6.708 57.048-21.19 18.96-18.944 18.39-42.692 12.142-57.27-4.484-10.45-13.033-18.94-24.723-24.553Zm-43.045 36.5c-10.44.588-21.286-4.098-21.82-14.135-.396-7.442 5.296-15.746 22.461-16.735 1.966-.114 3.895-.169 5.79-.169 6.235 0 12.068.606 17.371 1.764-1.978 24.702-13.58 28.713-23.802 29.275Z" />
    </svg>
  );
}

function HeartIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 21s-7.2-4.35-9.6-9.06C.84 8.7 2.46 4.8 6 4.05c2.18-.46 4.36.56 6 2.4 1.64-1.84 3.82-2.86 6-2.4 3.54.75 5.16 4.65 3.6 7.89C19.2 16.65 12 21 12 21Z" />
    </svg>
  );
}

function HeartBeat() {
  return (
    <span className="heart-wrap" aria-hidden="true">
      <HeartIcon className="heart-main text-red-500" />
      <HeartIcon className="heart-mini heart-mini-1" />
      <HeartIcon className="heart-mini heart-mini-2" />
      <HeartIcon className="heart-mini heart-mini-3" />
      <style jsx>{`
        .heart-wrap {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          vertical-align: -0.15em;
          width: 1.25em;
          height: 1.25em;
          line-height: 1;
        }
        :global(.heart-main) {
          width: 100%;
          height: 100%;
          transform-origin: center;
          animation: heartbeat 1.2s ease-in-out infinite;
          filter: drop-shadow(0 0 6px rgba(239, 68, 68, 0.35));
        }
        :global(.heart-mini) {
          position: absolute;
          left: 50%;
          bottom: 40%;
          width: 0.6em;
          height: 0.6em;
          color: rgb(239 68 68);
          opacity: 0;
          pointer-events: none;
          animation: heart-float 2.4s ease-out infinite;
        }
        :global(.heart-mini-1) {
          animation-delay: 0s;
          --dx: -10px;
        }
        :global(.heart-mini-2) {
          animation-delay: 0.8s;
          --dx: 8px;
        }
        :global(.heart-mini-3) {
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
