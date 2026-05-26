import type { Metadata } from "next";
import { Inter, Geist_Mono, Playfair_Display } from "next/font/google";
import { cookies } from "next/headers";
import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeFlashScript } from "@/components/theme-flash-script";
import "./globals.css";
import ConvexClientProvider from "@/components/ConvexClientProvider";
import { FloatingDock } from "@/components/floating-dock";
import { GoogleAnalytics } from "@/components/google-analytics";
import { Toaster } from "@/components/ui/sonner";
import { SkipToContent } from "@/components/skip-to-content";
import { RouteProgress } from "@/components/route-progress";
import { CommandPalette } from "@/components/command-palette";

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
    icon: [
      {
        url: "/icon-dark.png",
        media: "(prefers-color-scheme: dark)",
        type: "image/png",
      },
      {
        url: "/icon-light.png",
        media: "(prefers-color-scheme: light)",
        type: "image/png",
      },
    ],
    shortcut: "/icon-light.png",
    apple: "/icon-light.png",
  },
  manifest: "/site.webmanifest",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://ui.d2studio.dev",
    siteName: "D2 Studio",
    title: "D2 Studio | Modern Component Library",
    description:
      "Premium collection of 50+ copy-and-paste React components built with shadcn/ui, Tailwind CSS, and TypeScript. Beautiful, accessible, and production-ready.",
    images: [
      {
        url: "https://ui.d2studio.dev/og-ui.png",
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
    images: ["https://ui.d2studio.dev/og-ui.png"],
  },
  verification: {
    google: "google-verification-code",
    yandex: "yandex-verification-code",
    yahoo: "yahoo-verification-code",
  },
  alternates: {
    canonical: "https://ui.d2studio.dev",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const cookieTheme = cookieStore.get("theme")?.value;
  const initialResolvedTheme: "light" | "dark" =
    cookieTheme === "light" || cookieTheme === "dark" ? cookieTheme : "dark";

  return (
    <ConvexAuthNextjsServerProvider>
      <html
        lang="en"
        className={initialResolvedTheme === "dark" ? "dark" : undefined}
        style={{ colorScheme: initialResolvedTheme }}
        suppressHydrationWarning
      >
        <head>
          <ThemeFlashScript />
          <GoogleAnalytics />
        </head>
        <body
          className={`${inter.variable} ${geistMono.variable} ${playfairDisplay.variable} antialiased font-sans`}
        >
          <ThemeProvider
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
            initialTheme={initialResolvedTheme}
            initialResolvedTheme={initialResolvedTheme}
          >
            <SkipToContent />
            <RouteProgress />
            <ConvexClientProvider>{children}</ConvexClientProvider>
            <CommandPalette />
            <FloatingDock />
            <Toaster richColors closeButton />
          </ThemeProvider>
        </body>
      </html>
    </ConvexAuthNextjsServerProvider>
  );
}
