"use client";

import * as React from "react";

/**
 * The pro library's screen recording, looped and silent. It only plays on its
 * own when the visitor has not asked for reduced motion; otherwise it rests on
 * its first frame.
 */
export function IllustrationReel({ className }: { className?: string }) {
  const ref = React.useRef<HTMLVideoElement>(null);

  React.useEffect(() => {
    const video = ref.current;
    if (!video) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Autoplay can be refused (battery saver, data saver); the first frame stays.
    video.play().catch(() => {});
  }, []);

  return (
    <video
      ref={ref}
      src="/illustrations.webm"
      muted
      loop
      playsInline
      preload="metadata"
      aria-hidden
      className={className}
    />
  );
}
