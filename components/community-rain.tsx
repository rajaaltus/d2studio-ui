"use client";

import * as React from "react";
import { AnimatePresence, motion } from "motion/react";

export type RainPlatform = "x" | "threads";

export interface RainPerson {
  name: string;
  platform: RainPlatform;
  avatarSrc?: string;
}

interface RisingHeart {
  id: number;
  name: string;
  platform: RainPlatform;
  avatarSrc?: string;
  x: number;
  duration: number;
}

const AVATAR_GRADIENTS = [
  "linear-gradient(135deg, #a78bfa, #ec4899)",
  "linear-gradient(135deg, #60a5fa, #a78bfa)",
  "linear-gradient(135deg, #34d399, #22d3ee)",
  "linear-gradient(135deg, #f59e0b, #ef4444)",
  "linear-gradient(135deg, #ec4899, #f43f5e)",
  "linear-gradient(135deg, #06b6d4, #3b82f6)",
  "linear-gradient(135deg, #f472b6, #fb7185)",
  "linear-gradient(135deg, #818cf8, #c084fc)",
];

function getInitials(name: string): string {
  const cleaned = name.replace(/[^\p{L}\p{N}\s]/gu, "").trim();
  const words = cleaned.split(/\s+/).filter(Boolean);
  if (words.length >= 2) {
    return (words[0][0] + words[words.length - 1][0]).toUpperCase();
  }
  return cleaned.slice(0, 2).toUpperCase() || "?";
}

function getAvatarGradient(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  }
  return AVATAR_GRADIENTS[hash % AVATAR_GRADIENTS.length];
}

const DUMMY_PEOPLE: RainPerson[] = [
  // Threads engagers
  { name: "ZaneChen", platform: "threads" },
  { name: "Digi pro", platform: "threads" },
  { name: "Aditya Mali", platform: "threads" },
  { name: "inmsr", platform: "threads" },
  { name: "shadow", platform: "threads" },
  { name: "Michele Dipalma", platform: "threads" },
  { name: "Randy Counsman", platform: "threads" },
  { name: "Aaron Heth", platform: "threads" },
  { name: "justverybroken", platform: "threads" },
  { name: "Hồng Linh", platform: "threads" },
  { name: "anaqi", platform: "threads" },
  { name: "Kirill", platform: "threads" },
  { name: "Bismark Gyau", platform: "threads" },
  { name: "Baptiste Ducrocq", platform: "threads" },
  { name: "Nadim Massih", platform: "threads" },
  { name: "Alex", platform: "threads" },
  { name: "almatador", platform: "threads" },
  { name: "scars.in.heaven", platform: "threads" },
  { name: "Haoxi", platform: "threads" },
  { name: "Sohum M", platform: "threads" },
  // X engagers
  { name: "Alex Rivera", platform: "x" },
  { name: "Marcus Park", platform: "x" },
  { name: "Lina Bose", platform: "x" },
  { name: "Maya Khan", platform: "x" },
  { name: "Ren Tanaka", platform: "x" },
  { name: "Oliver Schmidt", platform: "x" },
  { name: "Zara Ali", platform: "x" },
  { name: "Yuki Sato", platform: "x" },
  { name: "Theo Brown", platform: "x" },
  { name: "Aisha Patel", platform: "x" },
  { name: "Diego Morales", platform: "x" },
  { name: "Nora Lindqvist", platform: "x" },
  { name: "Kenji Tanaka", platform: "x" },
  { name: "Amira Hassan", platform: "x" },
  { name: "Leo Park", platform: "x" },
  { name: "ihirwart", platform: "x" },
  { name: "navidalizadeh", platform: "x" },
  { name: "kritikakodes", platform: "x" },
  { name: "EscrowGate", platform: "x" },
  { name: "uix_yana", platform: "x" },
];

const HEART_COLOR: Record<RainPlatform, string> = {
  x: "#f91880",
  threads: "#ff3040",
};

const HEART_PATH =
  "M12 21 C12 21 3 14 3 8 C3 5 6 3 8.5 4 C10 4.5 11 5.5 12 7 C13 5.5 14 4.5 15.5 4 C18 3 21 5 21 8 C21 14 12 21 12 21 Z";

interface CommunityRainProps {
  people?: RainPerson[];
  className?: string;
  spawnIntervalMs?: number;
}

function shuffle<T>(arr: readonly T[], avoidFirst?: T): T[] {
  const result = arr.slice();
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  if (avoidFirst && result.length > 1 && result[0] === avoidFirst) {
    [result[0], result[1]] = [result[1], result[0]];
  }
  return result;
}

export function CommunityRain({
  people = DUMMY_PEOPLE,
  className,
  spawnIntervalMs = 650,
}: CommunityRainProps) {
  const [hearts, setHearts] = React.useState<RisingHeart[]>([]);
  const [height, setHeight] = React.useState(0);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const counterRef = React.useRef(0);
  const queueRef = React.useRef<RainPerson[]>([]);
  const lastPersonRef = React.useRef<RainPerson | undefined>(undefined);

  React.useEffect(() => {
    if (!containerRef.current) return;
    const el = containerRef.current;
    const update = () => setHeight(el.getBoundingClientRect().height);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  React.useEffect(() => {
    if (people.length === 0 || height === 0) return;

    queueRef.current = shuffle(people);
    lastPersonRef.current = undefined;

    const spawn = () => {
      if (queueRef.current.length === 0) {
        queueRef.current = shuffle(people, lastPersonRef.current);
      }
      const pick = queueRef.current.shift()!;
      lastPersonRef.current = pick;
      const id = ++counterRef.current;
      setHearts((cur) => [
        ...cur,
        {
          id,
          name: pick.name,
          platform: pick.platform,
          avatarSrc: pick.avatarSrc,
          x: 12 + Math.random() * 76,
          duration: 1.5 + Math.random() * 0.7,
        },
      ]);
    };

    spawn();
    const interval = window.setInterval(spawn, spawnIntervalMs);
    return () => window.clearInterval(interval);
  }, [people, spawnIntervalMs, height]);

  const handleDone = React.useCallback((id: number) => {
    setHearts((cur) => cur.filter((h) => h.id !== id));
  }, []);

  const travel = height + 80;

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={
        className ??
        "pointer-events-none absolute inset-x-0 top-0 h-[175px] lg:h-[235px] overflow-hidden"
      }
      style={{
        WebkitMaskImage:
          "linear-gradient(to bottom, transparent 0%, black 30%, black 100%)",
        maskImage:
          "linear-gradient(to bottom, transparent 0%, black 30%, black 100%)",
      }}
    >
      <AnimatePresence>
        {hearts.map((h) => (
          <HeartPill
            key={h.id}
            heart={h}
            travel={travel}
            onDone={() => handleDone(h.id)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

function HeartPill({
  heart,
  travel,
  onDone,
}: {
  heart: RisingHeart;
  travel: number;
  onDone: () => void;
}) {
  const heartColor = HEART_COLOR[heart.platform];

  React.useEffect(() => {
    const timer = window.setTimeout(onDone, heart.duration * 1000);
    return () => window.clearTimeout(timer);
  }, [heart.duration, onDone]);

  return (
    <motion.div
      className="absolute bottom-0 flex items-center gap-1.5 whitespace-nowrap rounded-full border border-border/70 bg-background/85 px-2.5 py-1 shadow-[0_4px_16px_-6px_rgba(0,0,0,0.4)] backdrop-blur-sm"
      style={{
        left: `${heart.x}%`,
        transformOrigin: "50% 0%",
      }}
      initial={{ x: "-50%", y: 0, opacity: 0, scale: 0.85, filter: "blur(8px)" }}
      animate={{
        x: "-50%",
        y: -travel,
        opacity: [0, 1, 1, 0],
        scale: [0.85, 1, 1, 0.2],
        filter: ["blur(8px)", "blur(0px)", "blur(0px)", "blur(6px)"],
      }}
      exit={{
        opacity: 0,
        scale: 0.2,
        filter: "blur(8px)",
        transition: { duration: 0.2 },
      }}
      transition={{
        y: { duration: heart.duration, ease: "linear" },
        opacity: {
          duration: heart.duration,
          times: [0, 0.08, 0.68, 1],
          ease: "easeOut",
        },
        scale: {
          duration: heart.duration,
          times: [0, 0.12, 0.68, 1],
          ease: [0.4, 0, 0.6, 1],
        },
        filter: {
          duration: heart.duration,
          times: [0, 0.12, 0.68, 1],
          ease: "easeOut",
        },
      }}
    >
      <Avatar
        name={heart.name}
        avatarSrc={heart.avatarSrc}
        heartColor={heartColor}
      />
      <span className="text-[11px] font-medium text-foreground/90">
        {heart.name}
      </span>
      {heart.platform === "x" ? (
        <>
          <XVerifiedBadge className="size-3 shrink-0 text-[#1d9bf0]" />
          <RainXIcon className="size-2.5 text-muted-foreground" />
        </>
      ) : (
        <RainThreadsIcon className="size-2.5 text-muted-foreground" />
      )}
    </motion.div>
  );
}

function Avatar({
  name,
  avatarSrc,
  heartColor,
}: {
  name: string;
  avatarSrc?: string;
  heartColor: string;
}) {
  return (
    <span className="relative shrink-0">
      {avatarSrc ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={avatarSrc}
          alt=""
          aria-hidden="true"
          className="size-5 rounded-full object-cover border border-border/60"
        />
      ) : (
        <span
          aria-hidden="true"
          className="size-5 rounded-full flex items-center justify-center text-[8px] font-bold text-white tracking-tight border border-border/60"
          style={{ background: getAvatarGradient(name) }}
        >
          {getInitials(name)}
        </span>
      )}
      <span
        aria-hidden="true"
        className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full flex items-center justify-center ring-1 ring-background"
        style={{ background: heartColor }}
      >
        <svg viewBox="0 0 24 24" className="size-1.5">
          <path d={HEART_PATH} fill="white" />
        </svg>
      </span>
    </span>
  );
}

function XVerifiedBadge({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 22 22"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.854-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.688-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.606-.274 1.263-.144 1.896.13.634.433 1.218.877 1.688.47.443 1.054.747 1.687.878.633.132 1.29.084 1.897-.136.274.586.705 1.084 1.246 1.439.54.354 1.17.551 1.816.569.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.239 1.266.296 1.903.164.636-.132 1.22-.447 1.68-.907.46-.46.776-1.044.908-1.681s.075-1.299-.165-1.903c.586-.274 1.084-.705 1.439-1.246.354-.54.551-1.17.569-1.816zM9.662 14.85l-3.429-3.428 1.293-1.302 2.072 2.072 4.4-4.794 1.347 1.246z" />
    </svg>
  );
}

function RainXIcon({ className }: { className?: string }) {
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

function RainThreadsIcon({ className }: { className?: string }) {
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

export default CommunityRain;
