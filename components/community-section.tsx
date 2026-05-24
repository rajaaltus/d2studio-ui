"use client";

import * as React from "react";
import Link from "next/link";
import { CommunityRain, type RainPerson } from "@/components/community-rain";

type Platform = "x" | "threads";

type Testimonial = {
  name: string;
  handle: string;
  platform: Platform;
  href: string;
  avatar: string;
  avatarSrc?: string;
  verified?: boolean;
  quote: string;
};

const testimonials: Testimonial[] = [
  {
    name: "Navadeep Goleti",
    handle: "@navadeepgoleti",
    platform: "x",
    href: "https://x.com/navadeepgoleti/status/2046184149304983840?s=20",
    avatar: "NG",
    avatarSrc: "/navadeep-goleti.jpg",
    verified: true,
    quote:
      "This is gold 🔥 Building something in this space too. Follow along if you're interested 🚀",
  },
  {
    name: "Bartosz Wilczynski",
    handle: "@wilczyn",
    platform: "x",
    href: "https://x.com/wilczyn/status/2046274724704002425?s=20",
    avatar: "BW",
    avatarSrc: "/bartosz-wilczynski.jpg",
    verified: true,
    quote:
      "a good spinner is the one you don't notice. good job!",
  },
  {
    name: "Daniel Rachlin",
    handle: "@danielrachlin",
    platform: "x",
    href: "https://x.com/danielrachlin/status/2046253181978480728?s=20",
    avatar: "DR",
    avatarSrc: "/daniel-rachlin.jpg",
    verified: true,
    quote:
      "Nice. Always appreciate good open-source tools, especially for UX like this.",
  },
  {
    name: "The Founder",
    handle: "@GTqhqh48540",
    platform: "x",
    href: "https://x.com/GTqhqh48540/status/2056787031314022804?s=20",
    avatar: "TF",
    avatarSrc: "/the-founder.jpg",
    verified: true,
    quote: "Loving this product so much 😻😆",
  },
  {
    name: "Zayden ✧ SaaS Expert",
    handle: "@RakibullHassa13",
    platform: "x",
    href: "https://x.com/RakibullHassa13/status/2055997378944270774?s=20",
    avatar: "ZS",
    avatarSrc: "/zayden-rakibull.jpg",
    verified: true,
    quote: "Really? so this is great product",
  },
  {
    name: "Hady.",
    handle: "@saddhaddy",
    platform: "x",
    href: "https://x.com/saddhaddy/status/2045696419810471986?s=20",
    avatar: "HD",
    avatarSrc: "/hady.jpg",
    verified: true,
    quote: "Are you going to share it? Amazing work!",
  },
  {
    name: "Sammii",
    handle: "@sammiihk",
    platform: "x",
    href: "https://x.com/sammiihk/status/2045805634495357387?s=20",
    avatar: "SM",
    avatarSrc: "/sammii.jpg",
    verified: true,
    quote:
      "Pixel-based spinners are a fun constraint, and the code-based angle makes it even better because people can actually remix them. Curious if you're turning the set into a tiny component library or keeping it as standalone patterns.",
  },
  {
    name: "The Founder",
    handle: "@GTqhqh48540",
    platform: "x",
    href: "https://x.com/GTqhqh48540/status/2056363260287598765?s=20",
    avatar: "TF",
    avatarSrc: "/the-founder.jpg",
    verified: true,
    quote:
      "Well Sir. Thanks To you, My app Will feel More Premium and Clean with those Animations 😍❤️. Our UI community Is Great Because of People like You 😻👀.",
  },
  {
    name: "MAK",
    handle: "@Mak_Studioo",
    platform: "x",
    href: "https://x.com/Mak_Studioo/status/2039191058131878169?s=20",
    avatar: "MK",
    avatarSrc: "/mak-studioo.jpg",
    verified: true,
    quote:
      "nostalgia as a UX anchor is so effective — users already trust the reference. bringing it into a modern system through Figma and code is exactly how you bridge that gap without slowing down.",
  },
  {
    name: "Block By Block Solutions",
    handle: "@BlockByBlockHQ",
    platform: "x",
    href: "https://x.com/BlockByBlockHQ/status/2056052992483459217?s=20",
    avatar: "BB",
    avatarSrc: "/blockbyblock.jpg",
    verified: true,
    quote:
      "The particle effect looks pretty clean, curious to see more useful cases",
  },
  {
    name: "Daniel Dawson",
    handle: "@dpdawson",
    platform: "x",
    href: "https://x.com/dpdawson/status/1937561058077491246?s=20",
    avatar: "DD",
    avatarSrc: "/daniel-dawson.jpg",
    verified: true,
    quote: "Not a dark theme fan, but those are pretty cool",
  },
  {
    name: "The Founder",
    handle: "@GTqhqh48540",
    platform: "x",
    href: "https://x.com/GTqhqh48540/status/2056783301449515201?s=20",
    avatar: "TF",
    avatarSrc: "/the-founder.jpg",
    verified: true,
    quote: "Nudgel Getting Exited for this 😆😻",
  },
  {
    name: "Aamir Saifi",
    handle: "@AamirUX",
    platform: "x",
    href: "https://x.com/AamirUX/status/1937982345618813062?s=20",
    avatar: "AS",
    avatarSrc: "/aamir-saifi.jpg",
    verified: true,
    quote: "Cool gradients",
  },
  {
    name: "dormamu1997",
    handle: "@dormamu1997",
    platform: "threads",
    href: "https://www.threads.com/@dormamu1997/post/DYd_mEQCJnM",
    avatar: "DM",
    avatarSrc: "/dormamu1997.jpg",
    quote: "Wow this is soo cool!",
  },
  {
    name: "The Founder",
    handle: "@GTqhqh48540",
    platform: "x",
    href: "https://x.com/GTqhqh48540/status/2056358790061236351?s=20",
    avatar: "TF",
    avatarSrc: "/the-founder.jpg",
    verified: true,
    quote:
      "For The Animations of the App, I will use the D2 Studio spinner Animations, Thanks To @uxgodwin, Love These Spinner Animations So....",
  },
  {
    name: "Collective",
    handle: "@GoCollectives",
    platform: "x",
    href: "https://x.com/GoCollectives/status/1937095579567263909?s=20",
    avatar: "CO",
    avatarSrc: "/gocollectives.jpg",
    quote: "amazing man",
  },
  {
    name: "Zayden ✧ SaaS Expert",
    handle: "@RakibullHassa13",
    platform: "x",
    href: "https://x.com/RakibullHassa13/status/2056024878776832108?s=20",
    avatar: "ZS",
    avatarSrc: "/zayden-rakibull.jpg",
    verified: true,
    quote: "So i will wait for your link. Excited",
  },
  {
    name: "TheWilliamFox",
    handle: "@TheWilliamBui",
    platform: "x",
    href: "https://x.com/TheWilliamBui/status/2045438451936628934?s=20",
    avatar: "TW",
    avatarSrc: "/thewilliamfox.jpg",
    quote: "Incredible craft,...",
  },
];

const xEngagers: RainPerson[] = [
  {
    name: "Simon Hansson",
    platform: "x",
    avatarSrc: "https://unavatar.io/x/_simonhansson",
  },
  {
    name: "Celaro",
    platform: "x",
    avatarSrc: "https://unavatar.io/x/celaroapp",
  },
  {
    name: "franklin john",
    platform: "x",
    avatarSrc: "https://unavatar.io/x/rajaaltus",
  },
  {
    name: "Gioda",
    platform: "x",
    avatarSrc: "https://unavatar.io/x/c0de_artist",
  },
  {
    name: "Robyn B",
    platform: "x",
    avatarSrc: "https://unavatar.io/x/robynrbieber",
  },
  {
    name: "soup time",
    platform: "x",
    avatarSrc: "https://unavatar.io/x/warren_buffett",
  },
  {
    name: "Ren",
    platform: "x",
    avatarSrc: "https://unavatar.io/x/agua90era",
  },
  {
    name: "김성보",
    platform: "x",
    avatarSrc: "https://unavatar.io/x/21ksi",
  },
  {
    name: "Shahin",
    platform: "x",
    avatarSrc: "https://unavatar.io/x/_nerd_",
  },
  {
    name: "just Lainfall",
    platform: "x",
    avatarSrc: "https://unavatar.io/x/justLainfall",
  },
  {
    name: "Valentin Chernik",
    platform: "x",
    avatarSrc: "https://unavatar.io/x/saaatchu",
  },
  {
    name: "JordiMVV",
    platform: "x",
    avatarSrc: "https://unavatar.io/x/JordiMVV",
  },
  {
    name: "Kevin Xu",
    platform: "x",
    avatarSrc: "https://unavatar.io/x/kevinxuinux",
  },
  {
    name: "frankiescott",
    platform: "x",
    avatarSrc: "https://unavatar.io/x/frankiescott864",
  },
  {
    name: "Nicolo Gomez",
    platform: "x",
    avatarSrc: "https://unavatar.io/x/nicologomez",
  },
  {
    name: "John Smirb",
    platform: "x",
    avatarSrc: "https://unavatar.io/x/shmurbf",
  },
  {
    name: "altair",
    platform: "x",
    avatarSrc: "https://unavatar.io/x/altair275529",
  },
  {
    name: "Zlolow",
    platform: "x",
    avatarSrc: "https://unavatar.io/x/Zylow_SSH",
  },
  {
    name: "Steven",
    platform: "x",
    avatarSrc: "https://unavatar.io/x/stevensarmi",
  },
  {
    name: "McEees",
    platform: "x",
    avatarSrc: "https://unavatar.io/x/mc_ees",
  },
  {
    name: "Rajdeep Ghosh",
    platform: "x",
    avatarSrc: "https://unavatar.io/x/rajdeep__",
  },
  {
    name: "Amit Gajare",
    platform: "x",
    avatarSrc: "https://unavatar.io/x/AmitGajare4",
  },
  {
    name: "karrio",
    platform: "x",
    avatarSrc: "https://unavatar.io/x/karriodev",
  },
  {
    name: "michael",
    platform: "x",
    avatarSrc: "https://unavatar.io/x/1800gophyx",
  },
  {
    name: "Chambrin.dev",
    platform: "x",
    avatarSrc: "https://unavatar.io/x/Chambrin",
  },
  {
    name: "Khôi Nguyễn Quang",
    platform: "x",
    avatarSrc: "https://unavatar.io/x/Khoirua_design",
  },
  {
    name: "nottt",
    platform: "x",
    avatarSrc: "https://unavatar.io/x/peacepauseplace",
  },
  {
    name: "MisterELF",
    platform: "x",
    avatarSrc: "https://unavatar.io/x/MisterELFer",
  },
  {
    name: "Niklas",
    platform: "x",
    avatarSrc: "https://unavatar.io/x/Niklas_Sikorra",
  },
  {
    name: "Navid Alizadeh",
    platform: "x",
    avatarSrc: "https://unavatar.io/x/navidalizadeh_",
  },
  {
    name: "Three.js",
    platform: "x",
    avatarSrc: "https://unavatar.io/x/threejs",
  },
  {
    name: "XEXE",
    platform: "x",
    avatarSrc: "https://unavatar.io/x/xexesir",
  },
  {
    name: "HD Superman",
    platform: "x",
    avatarSrc: "https://unavatar.io/x/zhdsuperman",
  },
  {
    name: "Taufik Hidayat",
    platform: "x",
    avatarSrc: "https://unavatar.io/x/taufikinsaas",
  },
  {
    name: "machonezze",
    platform: "x",
    avatarSrc: "https://unavatar.io/x/IvanMihienko",
  },
  {
    name: "Tian Qin",
    platform: "x",
    avatarSrc: "https://unavatar.io/x/Tiango0703",
  },
  {
    name: "Oleg VLD",
    platform: "x",
    avatarSrc: "https://unavatar.io/x/OMandrik29874",
  },
  {
    name: "Germán Merlo",
    platform: "x",
    avatarSrc: "https://unavatar.io/x/elgermerlo",
  },
  {
    name: "César Álvarez",
    platform: "x",
    avatarSrc: "https://unavatar.io/x/cesaralvarezll",
  },
  {
    name: "Nucleo Icons",
    platform: "x",
    avatarSrc: "https://unavatar.io/x/nucleoicons",
  },
  {
    name: "Kailash",
    platform: "x",
    avatarSrc: "https://unavatar.io/x/kail_designs",
  },
  {
    name: "TravelerOfCode",
    platform: "x",
    avatarSrc: "https://unavatar.io/x/TravelerOfCode",
  },
  {
    name: "Matt Ölschlegel",
    platform: "x",
    avatarSrc: "https://unavatar.io/x/Matthias_Oel",
  },
  {
    name: "Evgenii Shmoish",
    platform: "x",
    avatarSrc: "https://unavatar.io/x/evgenii_shmoish",
  },
  {
    name: "Wiam",
    platform: "x",
    avatarSrc: "https://unavatar.io/x/wiamxyz",
  },
  {
    name: "virgil pana",
    platform: "x",
    avatarSrc: "https://unavatar.io/x/virgil_pana",
  },
  {
    name: "Mikolaj Kopciowski",
    platform: "x",
    avatarSrc: "https://unavatar.io/x/mikopciowski",
  },
  {
    name: "Max ✦",
    platform: "x",
    avatarSrc: "https://unavatar.io/x/MaxVOAO",
  },
  {
    name: "Odrilow",
    platform: "x",
    avatarSrc: "https://unavatar.io/x/Odrilow",
  },
  {
    name: "Mridul Joshi",
    platform: "x",
    avatarSrc: "https://unavatar.io/x/mriduljoshi_",
  },
];

const threadsEngagers: RainPerson[] = [
  { name: "ZaneChen", platform: "threads" },
  { name: "Digi pro", platform: "threads" },
  {
    name: "Aditya Mali",
    platform: "threads",
    avatarSrc: "/𝓐𝓭𝓲𝓽𝔂𝓪 𝓜𝓪𝓵𝒾.jpg",
  },
  { name: "inmsr", platform: "threads" },
  { name: "shadow", platform: "threads" },
  {
    name: "Michele Dipalma",
    platform: "threads",
    avatarSrc: "/𝙼𝚒𝚌𝚑𝚎𝚕𝚎 𝙳𝚒𝚙𝚊𝚕𝚖𝚊.jpg",
  },
  { name: "Randy Counsman", platform: "threads" },
  {
    name: "Aaron Heth",
    platform: "threads",
    avatarSrc: "/Aaron Heth.jpg",
  },
  { name: "justverybroken", platform: "threads" },
  {
    name: "Hồng Linh",
    platform: "threads",
    avatarSrc: "/Hồng Linh.jpg",
  },
  { name: "anaqi", platform: "threads", avatarSrc: "/anaqi.jpg" },
  { name: "Kirill", platform: "threads", avatarSrc: "/Kirill.jpg" },
  { name: "Bismark Gyau", platform: "threads" },
  { name: "Baptiste Ducrocq", platform: "threads" },
  {
    name: "Nadim Massih",
    platform: "threads",
    avatarSrc: "/Nadim Massih.jpg",
  },
  { name: "Alex", platform: "threads" },
  { name: "almatador", platform: "threads" },
  { name: "scars.in.heaven", platform: "threads" },
  { name: "Haoxi", platform: "threads", avatarSrc: "/Haoxi.jpg" },
  { name: "Sohum M", platform: "threads", avatarSrc: "/dormamu1997.jpg" },
  {
    name: "Akmal Alif",
    platform: "threads",
    avatarSrc: "/Akmal Alif.jpg",
  },
  {
    name: "Bánh mì bò kho",
    platform: "threads",
    avatarSrc: "/Bánh mì bò kho.jpg",
  },
  {
    name: "Vitor Nunes Vanjura",
    platform: "threads",
    avatarSrc: "/Vitor Nunes Vanjura.jpg",
  },
  {
    name: "Zuxriddin Astanakulov",
    platform: "threads",
    avatarSrc: "/Zuxriddin Astanakulov.jpg",
  },
  {
    name: "mHazel",
    platform: "threads",
    avatarSrc: "/mHazel .jpg",
  },
];

const rainPeople: RainPerson[] = Array.from(
  new Map(
    [
      ...testimonials.map((t) => ({
        name: t.name,
        platform: t.platform,
        avatarSrc: t.avatarSrc,
      })),
      ...xEngagers,
      ...threadsEngagers,
    ].map((p) => [p.name, p]),
  ).values(),
);

export function CommunitySection() {
  return (
    <section className="max-w-6xl w-full border-x mx-auto bg-border">
      <div className="relative lg:rounded-xl border m-0 bg-background py-16 lg:py-24 px-4 sm:px-6 lg:px-10">
        <CommunityRain
          people={rainPeople}
          className="pointer-events-none absolute inset-x-0 top-0 h-[64px] lg:h-[96px] overflow-hidden z-10"
        />
        <div className="relative text-center mb-10 lg:mb-14 flex flex-col items-center gap-3 z-20">
          <h2 className="font-sans text-lg font-medium tracking-tight md:text-xl lg:text-2xl">
            What Community Say
          </h2>
          <p className="text-sm text-muted-foreground max-w-xl">
            Real reactions from builders shipping with D2 Studio on X and
            Threads.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border border rounded-xl overflow-hidden">
          {testimonials.map((t, i) => (
            <TestimonialCard key={i} testimonial={t} />
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  const { name, handle, platform, href, avatar, avatarSrc, verified, quote } =
    testimonial;
  const PlatformIcon = platform === "x" ? XIcon : ThreadsIcon;
  const platformLabel = platform === "x" ? "View on X" : "View on Threads";

  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${platformLabel} — ${name}`}
      className="testimonial-shimmer relative overflow-hidden bg-background p-6 flex flex-col gap-4 group transition-colors hover:bg-foreground/[0.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
    >
      <header className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          {avatarSrc ? (
            <img
              src={avatarSrc}
              alt={name}
              className="size-9 shrink-0 rounded-full object-cover border border-border"
            />
          ) : (
            <div
              aria-hidden="true"
              className="size-9 shrink-0 rounded-full bg-foreground/5 border border-border flex items-center justify-center text-[11px] font-semibold tracking-wide text-foreground/70"
            >
              {avatar}
            </div>
          )}
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-medium truncate flex items-center gap-1">
              <span className="truncate">{name}</span>
              {verified && (
                <VerifiedBadge
                  className="h-3.5 w-3.5 shrink-0 text-[#1d9bf0]"
                  platform={platform}
                />
              )}
            </span>
            <span className="text-xs text-muted-foreground truncate">
              {handle}
            </span>
          </div>
        </div>
        <span
          aria-hidden="true"
          className="size-8 shrink-0 rounded-md flex items-center justify-center text-muted-foreground transition-colors group-hover:text-foreground"
        >
          <PlatformIcon className="h-3.5 w-3.5" />
        </span>
      </header>
      <p className="text-sm leading-relaxed text-foreground/80">
        &ldquo;{quote}&rdquo;
      </p>
    </Link>
  );
}

function VerifiedBadge({
  className,
  platform,
}: {
  className?: string;
  platform: Platform;
}) {
  if (platform === "x") {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 22 22"
        fill="currentColor"
        aria-label="Verified account"
        role="img"
        className={className}
      >
        <path d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.854-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.688-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.606-.274 1.263-.144 1.896.13.634.433 1.218.877 1.688.47.443 1.054.747 1.687.878.633.132 1.29.084 1.897-.136.274.586.705 1.084 1.246 1.439.54.354 1.17.551 1.816.569.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.239 1.266.296 1.903.164.636-.132 1.22-.447 1.68-.907.46-.46.776-1.044.908-1.681s.075-1.299-.165-1.903c.586-.274 1.084-.705 1.439-1.246.354-.54.551-1.17.569-1.816zM9.662 14.85l-3.429-3.428 1.293-1.302 2.072 2.072 4.4-4.794 1.347 1.246z" />
      </svg>
    );
  }
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-label="Verified account"
      role="img"
      className={className}
    >
      <path d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91s-2.52-1.27-3.91-.81c-.66-1.31-1.91-2.19-3.34-2.19s-2.67.88-3.33 2.19c-1.4-.46-2.91-.2-3.92.81s-1.26 2.52-.8 3.91c-1.31.67-2.2 1.91-2.2 3.34s.89 2.67 2.2 3.34c-.46 1.39-.21 2.9.8 3.91s2.52 1.26 3.91.81c.67 1.31 1.91 2.19 3.34 2.19s2.68-.88 3.34-2.19c1.39.45 2.9.2 3.91-.81s1.27-2.52.81-3.91c1.31-.67 2.19-1.91 2.19-3.34zm-11.71 4.2L6.8 12.46l1.41-1.42 2.26 2.26 4.8-5.23 1.47 1.36-6.2 6.77z" />
    </svg>
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
