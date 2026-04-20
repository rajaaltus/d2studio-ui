import type { Metadata } from "next";
import { Inter, Geist_Mono, Playfair_Display } from "next/font/google";
import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeFlashScript } from "@/components/theme-flash-script";
import "./globals.css";
import ConvexClientProvider from "@/components/ConvexClientProvider";
import { BuyMeCoffeeFab } from "@/components/buy-me-coffee-fab";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400"],
  style: ["italic"],
});

export const metadata: Metadata = {
  title: {
    default: "D2 Studio | Modern Component Library",
    template: "%s | D2 Studio",
  },
  description:
    "Premium collection of 50+ copy-and-paste React components built with shadcn/ui, Tailwind CSS, and TypeScript. Beautiful, accessible, and production-ready.",
  keywords: [
    "React components",
    "shadcn/ui",
    "Tailwind CSS",
    "TypeScript",
    "UI library",
    "component library",
    "copy paste components",
    "Next.js components",
    "design system",
    "open source",
  ],
  authors: [{ name: "D2 Studio" }],
  creator: "D2 Studio",
  publisher: "D2 Studio",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/fav1.png",
    shortcut: "/fav1.png",
    apple: "/fav1.png",
  },
  manifest: "/site.webmanifest",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://d2studio.dev",
    siteName: "D2 Studio",
    title: "D2 Studio | Modern Component Library",
    description:
      "Premium collection of 50+ copy-and-paste React components built with shadcn/ui, Tailwind CSS, and TypeScript. Beautiful, accessible, and production-ready.",
    images: [
      {
        url: "https://d2studio.dev/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "D2 Studio - Modern Component Library",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "D2 Studio | Modern Component Library",
    description:
      "Premium collection of 50+ copy-and-paste React components built with shadcn/ui, Tailwind CSS, and TypeScript.",
    site: "@d2studio",
    creator: "@d2studio",
    images: ["https://d2studio.dev/og-image.jpg"],
  },
  verification: {
    google: "google-verification-code",
    yandex: "yandex-verification-code",
    yahoo: "yahoo-verification-code",
  },
  alternates: {
    canonical: "https://d2studio.dev",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ConvexAuthNextjsServerProvider>
      <html lang="en" suppressHydrationWarning>
        <head>
          <ThemeFlashScript defaultTheme="dark" />
        </head>
        <body
          className={`${inter.variable} ${geistMono.variable} ${playfairDisplay.variable} antialiased font-sans`}
        >
          <ThemeProvider
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <ConvexClientProvider>{children}</ConvexClientProvider>
            <BuyMeCoffeeFab />
          </ThemeProvider>
        </body>
      </html>
    </ConvexAuthNextjsServerProvider>
  );
}
