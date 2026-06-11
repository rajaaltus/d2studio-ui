import type { RainPerson } from "@/components/community-rain";

export type Platform = "x" | "threads";

export type Testimonial = {
  name: string;
  handle: string;
  platform: Platform;
  href: string;
  avatar: string;
  avatarSrc?: string;
  verified?: boolean;
  quote: string;
  fullWidth?: boolean;
  half?: boolean;
};

/** Local cached X avatar — no runtime API calls */
export function xAvatar(handle: string): string {
  return `/community-avatars/${handle}.jpg`;
}

/** Local cached Threads avatar — no runtime API calls */
export function threadsAvatar(slug: string): string {
  return `/community-avatars/threads/${slug}.jpg`;
}

export const testimonials: Testimonial[] = [
  {
    name: "Martin",
    handle: "@martin_valchev_",
    platform: "x",
    href: "https://x.com/martin_valchev_/status/2065012953754026229?s=20",
    avatar: "MV",
    avatarSrc: xAvatar("martin_valchev_"),
    verified: true,
    quote:
      "Those spinners look slick and the export feature is super handy. Nice work.",
    half: true,
  },
  {
    name: "aimltutorviktoria",
    handle: "@aimltutorviktoria",
    platform: "threads",
    href: "https://www.threads.com/@aimltutorviktoria/post/DYxxmJajUzr?xmt=AQG0RVS-F7RJNvWYYwe0FvRSUIoli7ztghRwbPJJAp4uGQ",
    avatar: "AV",
    avatarSrc: threadsAvatar("aimltutorviktoria"),
    quote: "Wow i love to drag theese, design is crazy",
  },
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
    avatarSrc: threadsAvatar("dormamu1997"),
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

export const xEngagers: RainPerson[] = [
  {
    name: "Simon Hansson",
    platform: "x",
    avatarSrc: xAvatar("_simonhansson"),
  },
  {
    name: "Celaro",
    platform: "x",
    avatarSrc: xAvatar("celaroapp"),
  },
  {
    name: "franklin john",
    platform: "x",
    avatarSrc: xAvatar("rajaaltus"),
  },
  {
    name: "Gioda",
    platform: "x",
    avatarSrc: xAvatar("c0de_artist"),
  },
  {
    name: "Robyn B",
    platform: "x",
    avatarSrc: xAvatar("robynrbieber"),
  },
  {
    name: "soup time",
    platform: "x",
    avatarSrc: xAvatar("warren_buffett"),
  },
  {
    name: "Ren",
    platform: "x",
    avatarSrc: xAvatar("agua90era"),
  },
  {
    name: "김성보",
    platform: "x",
    avatarSrc: xAvatar("21ksi"),
  },
  {
    name: "Shahin",
    platform: "x",
    avatarSrc: xAvatar("_nerd_"),
  },
  {
    name: "just Lainfall",
    platform: "x",
    avatarSrc: xAvatar("justLainfall"),
  },
  {
    name: "Valentin Chernik",
    platform: "x",
    avatarSrc: xAvatar("saaatchu"),
  },
  {
    name: "JordiMVV",
    platform: "x",
    avatarSrc: xAvatar("JordiMVV"),
  },
  {
    name: "Kevin Xu",
    platform: "x",
    avatarSrc: xAvatar("kevinxuinux"),
  },
  {
    name: "frankiescott",
    platform: "x",
    avatarSrc: xAvatar("frankiescott864"),
  },
  {
    name: "Nicolo Gomez",
    platform: "x",
    avatarSrc: xAvatar("nicologomez"),
  },
  {
    name: "John Smirb",
    platform: "x",
    avatarSrc: xAvatar("shmurbf"),
  },
  {
    name: "altair",
    platform: "x",
    avatarSrc: xAvatar("altair275529"),
  },
  {
    name: "Zlolow",
    platform: "x",
    avatarSrc: xAvatar("Zylow_SSH"),
  },
  {
    name: "Steven",
    platform: "x",
    avatarSrc: xAvatar("stevensarmi"),
  },
  {
    name: "McEees",
    platform: "x",
    avatarSrc: xAvatar("mc_ees"),
  },
  {
    name: "Rajdeep Ghosh",
    platform: "x",
    avatarSrc: xAvatar("rajdeep__"),
  },
  {
    name: "Amit Gajare",
    platform: "x",
    avatarSrc: xAvatar("AmitGajare4"),
  },
  {
    name: "karrio",
    platform: "x",
    avatarSrc: xAvatar("karriodev"),
  },
  {
    name: "michael",
    platform: "x",
    avatarSrc: xAvatar("1800gophyx"),
  },
  {
    name: "Chambrin.dev",
    platform: "x",
    avatarSrc: xAvatar("Chambrin"),
  },
  {
    name: "Khôi Nguyễn Quang",
    platform: "x",
    avatarSrc: xAvatar("Khoirua_design"),
  },
  {
    name: "nottt",
    platform: "x",
    avatarSrc: xAvatar("peacepauseplace"),
  },
  {
    name: "MisterELF",
    platform: "x",
    avatarSrc: xAvatar("MisterELFer"),
  },
  {
    name: "Niklas",
    platform: "x",
    avatarSrc: xAvatar("Niklas_Sikorra"),
  },
  {
    name: "Navid Alizadeh",
    platform: "x",
    avatarSrc: xAvatar("navidalizadeh_"),
  },
  {
    name: "Three.js",
    platform: "x",
    avatarSrc: xAvatar("threejs"),
  },
  {
    name: "XEXE",
    platform: "x",
    avatarSrc: xAvatar("xexesir"),
  },
  {
    name: "HD Superman",
    platform: "x",
    avatarSrc: xAvatar("zhdsuperman"),
  },
  {
    name: "Taufik Hidayat",
    platform: "x",
    avatarSrc: xAvatar("taufikinsaas"),
  },
  {
    name: "machonezze",
    platform: "x",
    avatarSrc: xAvatar("IvanMihienko"),
  },
  {
    name: "Tian Qin",
    platform: "x",
    avatarSrc: xAvatar("Tiango0703"),
  },
  {
    name: "Oleg VLD",
    platform: "x",
    avatarSrc: xAvatar("OMandrik29874"),
  },
  {
    name: "Germán Merlo",
    platform: "x",
    avatarSrc: xAvatar("elgermerlo"),
  },
  {
    name: "César Álvarez",
    platform: "x",
    avatarSrc: xAvatar("cesaralvarezll"),
  },
  {
    name: "Nucleo Icons",
    platform: "x",
    avatarSrc: xAvatar("nucleoicons"),
  },
  {
    name: "Kailash",
    platform: "x",
    avatarSrc: xAvatar("kail_designs"),
  },
  {
    name: "TravelerOfCode",
    platform: "x",
    avatarSrc: xAvatar("TravelerOfCode"),
  },
  {
    name: "Matt Ölschlegel",
    platform: "x",
    avatarSrc: xAvatar("Matthias_Oel"),
  },
  {
    name: "Evgenii Shmoish",
    platform: "x",
    avatarSrc: xAvatar("evgenii_shmoish"),
  },
  {
    name: "Wiam",
    platform: "x",
    avatarSrc: xAvatar("wiamxyz"),
  },
  {
    name: "virgil pana",
    platform: "x",
    avatarSrc: xAvatar("virgil_pana"),
  },
  {
    name: "Mikolaj Kopciowski",
    platform: "x",
    avatarSrc: xAvatar("mikopciowski"),
  },
  {
    name: "Max ✦",
    platform: "x",
    avatarSrc: xAvatar("MaxVOAO"),
  },
  {
    name: "Odrilow",
    platform: "x",
    avatarSrc: xAvatar("Odrilow"),
  },
  {
    name: "Mridul Joshi",
    platform: "x",
    avatarSrc: xAvatar("mriduljoshi_"),
  },
  {
    name: "Girish",
    platform: "x",
    avatarSrc: xAvatar("GirishR88486448"),
  },
  {
    name: "DevTenta",
    platform: "x",
    avatarSrc: xAvatar("DevTenta"),
  },
  {
    name: "Batsou",
    platform: "x",
    avatarSrc: xAvatar("BatsouElef"),
  },
];

export const threadsEngagers: RainPerson[] = [
  { name: "ZaneChen", platform: "threads" },
  { name: "Digi pro", platform: "threads" },
  {
    name: "Aditya Mali",
    platform: "threads",
    avatarSrc: threadsAvatar("aditya-mali"),
  },
  { name: "inmsr", platform: "threads", avatarSrc: threadsAvatar("inmsr") },
  { name: "shadow", platform: "threads" },
  {
    name: "Michele Dipalma",
    platform: "threads",
    avatarSrc: threadsAvatar("michele-dipalma"),
  },
  { name: "Randy Counsman", platform: "threads" },
  {
    name: "Aaron Heth",
    platform: "threads",
    avatarSrc: threadsAvatar("aaron-heth"),
  },
  { name: "justverybroken", platform: "threads" },
  {
    name: "Hồng Linh",
    platform: "threads",
    avatarSrc: threadsAvatar("hong-linh"),
  },
  { name: "anaqi", platform: "threads", avatarSrc: threadsAvatar("anaqi") },
  { name: "Kirill", platform: "threads", avatarSrc: threadsAvatar("kirill") },
  { name: "Bismark Gyau", platform: "threads" },
  { name: "Baptiste Ducrocq", platform: "threads" },
  {
    name: "Nadim Massih",
    platform: "threads",
    avatarSrc: threadsAvatar("nadim-massih"),
  },
  { name: "Alex", platform: "threads" },
  { name: "almatador", platform: "threads" },
  { name: "scars.in.heaven", platform: "threads" },
  { name: "Haoxi", platform: "threads", avatarSrc: threadsAvatar("haoxi") },
  {
    name: "Sohum M",
    platform: "threads",
    avatarSrc: threadsAvatar("sohum-m"),
  },
  {
    name: "Akmal Alif",
    platform: "threads",
    avatarSrc: threadsAvatar("akmal-alif"),
  },
  {
    name: "Bánh mì bò kho",
    platform: "threads",
    avatarSrc: threadsAvatar("banh-mi-bo-kho"),
  },
  {
    name: "Vitor Nunes Vanjura",
    platform: "threads",
    avatarSrc: threadsAvatar("vitor-nunes-vanjura"),
  },
  {
    name: "Zuxriddin Astanakulov",
    platform: "threads",
    avatarSrc: threadsAvatar("zuxriddin-astanakulov"),
  },
  {
    name: "mHazel",
    platform: "threads",
    avatarSrc: threadsAvatar("mhazel"),
  },
  {
    name: "aimltutorviktoria",
    platform: "threads",
    avatarSrc: threadsAvatar("aimltutorviktoria"),
  },
];

export const rainPeople: RainPerson[] = Array.from(
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
