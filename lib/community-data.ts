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
  /** What the reply is about, when it is not this site — e.g. "pro.d2studio.dev" */
  about?: string;
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
    name: "kim3wc",
    handle: "@kim3wc",
    platform: "threads",
    href: "https://www.threads.com/@kim3wc/post/DceiDXlH_70?xmt=AQG0GCVcJDbF418_BKk9_Knsk4pbH5sy0b358zmLL2X6jp4qXGscOJbo15rFKtZQzkajcyg",
    avatar: "KW",
    avatarSrc: threadsAvatar("kim3wc"),
    quote:
      "Love this. The more AI builds out apps the more generic they look. It's going to be designers creating cool packs like this that will keep the personality of the web going. Loved playing with it, may well become a customer, definitely buying you a coffee \u2615",
    about: "pro.d2studio.dev",
  },
  {
    name: "ant.mancini",
    handle: "@ant.mancini",
    platform: "threads",
    href: "https://www.threads.com/@ant.mancini",
    avatar: "AM",
    avatarSrc: threadsAvatar("ant.mancini"),
    quote:
      "Dude, these are legitimately amazing resources, and I'm blown away by some of the visuals on here and I will absolutely be recommending and using some of this",
    about: "pro.d2studio.dev",
  },
  {
    name: "atit_at_it",
    handle: "@atit_at_it",
    platform: "threads",
    href: "https://www.threads.com/@atit_at_it/post/DcfdlpADcZU",
    avatar: "AA",
    avatarSrc: threadsAvatar("atit_at_it"),
    quote: "Awesome site, can I write a linkedin post around this?",
    about: "pro.d2studio.dev",
  },
  {
    name: "twt_wilson",
    handle: "@twt_wilson",
    platform: "threads",
    href: "https://www.threads.com/@twt_wilson/post/DcfiyYTFchE",
    avatar: "TW",
    avatarSrc: threadsAvatar("twt_wilson"),
    quote: "Your site looks cool",
    about: "pro.d2studio.dev",
  },
  {
    name: "chat_with_niwa",
    handle: "@chat_with_niwa",
    platform: "threads",
    href: "https://www.threads.com/@chat_with_niwa/post/DceSitvguDH",
    avatar: "CN",
    avatarSrc: threadsAvatar("chat_with_niwa"),
    quote:
      "Overall, it looks very nice, and I may even start another project using something like this because I just like how it looks. It's so aesthetic and would be great inside some custom coding agent that I can develop for myself, or maybe even a custom GUI for a Pi agent or something like that. It just moves me toward making something, so I'm glad that I saw something like this.",
    about: "pro.d2studio.dev",
  },
  {
    name: "TheDesignInspo",
    handle: "@thedesigninspo",
    platform: "x",
    href: "https://x.com/thedesigninspo/status/2092301650732208435?s=20",
    avatar: "TD",
    avatarSrc: xAvatar("thedesigninspo"),
    verified: true,
    quote:
      "Right, mate! Knew it the moment I laid eyes on that proper polished video of yours. You've clearly got some serious graft in you for filmmaking & building gear. What other secret talents are you keeping under your hat, eh? Absolute belter of a job, smashing it all round. Good luck!",
    about: "pro.d2studio.dev",
  },
  {
    name: "The Founder",
    handle: "@ElyrianForge_HQ",
    platform: "x",
    href: "https://x.com/ElyrianForge_HQ/status/2092287292031541544?s=20",
    avatar: "TF",
    avatarSrc: xAvatar("ElyrianForge_HQ"),
    quote: "Insane UI Design Upgrade 🤩",
    about: "pro.d2studio.dev",
  },
  {
    name: "Imran Hossen",
    handle: "@uiuximran",
    platform: "x",
    href: "https://x.com/uiuximran/status/2092450056305836339?s=20",
    avatar: "IH",
    avatarSrc: xAvatar("uiuximran"),
    verified: true,
    quote: "super design",
    about: "pro.d2studio.dev",
  },
  {
    name: "Kushnir",
    handle: "@KushnirUI",
    platform: "x",
    href: "https://x.com/kushnirui/status/2092895761679733024?s=46",
    avatar: "KU",
    avatarSrc: xAvatar("KushnirUI"),
    quote: "Very nice",
    about: "pro.d2studio.dev",
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
    name: "Martin",
    handle: "@martin_valchev_",
    platform: "x",
    href: "https://x.com/martin_valchev_/status/2065012953754026229?s=20",
    avatar: "MV",
    avatarSrc: xAvatar("martin_valchev_"),
    verified: true,
    quote:
      "Those spinners look slick and the export feature is super handy. Nice work.",
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
    name: "Eugen Kozulski",
    handle: "@EugenKozulski",
    platform: "x",
    href: "https://x.com/eugenkozulski/status/2088658975545851942?s=46",
    avatar: "EK",
    avatarSrc: xAvatar("EugenKozulski"),
    verified: true,
    quote:
      "Built from DMs and community requests is the best reason to build anything. You already knew someone wanted it before you wrote a line. Open sourcing it is a lot of goodwill handed to the frontend crowd",
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
    name: "Alexa | Startup founder",
    handle: "@alexabelonix",
    platform: "x",
    href: "https://x.com/alexabelonix/status/2075595178123854238?s=46",
    avatar: "AB",
    avatarSrc: xAvatar("alexabelonix"),
    verified: true,
    quote:
      "Heck yes, 90+ patterns is wild. Open source for the win, gonna nerd out and plug these into everything.",
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
  // hidden
  // {
  //   name: "Block By Block Solutions",
  //   handle: "@BlockByBlockHQ",
  //   platform: "x",
  //   href: "https://x.com/BlockByBlockHQ/status/2056052992483459217?s=20",
  //   avatar: "BB",
  //   avatarSrc: "/blockbyblock.jpg",
  //   verified: true,
  //   quote:
  //     "The particle effect looks pretty clean, curious to see more useful cases",
  // },
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
  // hidden
  // {
  //   name: "The Founder",
  //   handle: "@GTqhqh48540",
  //   platform: "x",
  //   href: "https://x.com/GTqhqh48540/status/2056783301449515201?s=20",
  //   avatar: "TF",
  //   avatarSrc: "/the-founder.jpg",
  //   verified: true,
  //   quote: "Nudgel Getting Exited for this 😆😻",
  // },
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
    name: "Rakibul",
    handle: "@rakibulism",
    platform: "x",
    href: "https://x.com/rakibulism/status/2091113042545369350?s=46",
    avatar: "RA",
    avatarSrc: xAvatar("rakibulism"),
    verified: true,
    quote: "cool really !",
  },
  {
    name: "Dev Patel",
    handle: "@DevDsgn",
    platform: "x",
    href: "https://x.com/devdsgn/status/2091058956621815846?s=46",
    avatar: "DP",
    avatarSrc: xAvatar("DevDsgn"),
    verified: true,
    quote: "Love that button broooo",
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
