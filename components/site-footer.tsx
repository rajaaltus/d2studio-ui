"use client";

import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center gap-4 text-center">
          <div className="text-sm text-muted-foreground inline-flex items-center gap-1">
            © 2026{" "}
            <a
              href="https://www.d2studio.dev/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-foreground hover:underline"
            >
              D2 Studio
            </a>
            . Built with <HeartBeat /> for the community.
          </div>
          <div className="flex items-center justify-center gap-6 text-sm">
            <Link
              href="/docs"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Docs
            </Link>
            <Link
              href="/blocks"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Components
            </Link>
            <a
              href="https://x.com/uxgodwin"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="X (formerly Twitter)"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <XIcon className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
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
