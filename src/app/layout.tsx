import type { Metadata, Viewport } from "next";
import { Figtree, Fraunces, Shantell_Sans } from "next/font/google";
import "lenis/dist/lenis.css";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Curtain } from "@/components/layout/Curtain";
import { MobileBar } from "@/components/layout/MobileBar";
import { ScrollEffects } from "@/components/layout/ScrollEffects";
import { site } from "@/lib/site";

const fraunces = Fraunces({
  subsets: ["latin"],
  axes: ["SOFT", "WONK", "opsz"],
  variable: "--font-fraunces",
  display: "swap",
});
const figtree = Figtree({ subsets: ["latin"], variable: "--font-figtree", display: "swap" });
const shantell = Shantell_Sans({
  subsets: ["latin"],
  axes: ["BNCE", "INFM"],
  variable: "--font-shantell",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name} — Premium teacup puppies in Dubai`, template: `%s | ${site.name}` },
  description: site.description,
  applicationName: site.name,
  openGraph: {
    title: `${site.name} — Premium teacup puppies in Dubai`,
    description: site.description,
    images: ["/brand/logo.png"],
  },
  twitter: { card: "summary_large_image", images: ["/brand/logo.png"] },
};

export const viewport: Viewport = {
  themeColor: "#fffdf8",
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${figtree.variable} ${shantell.variable}`}>
      <body>
        <Curtain />
        <a
          href="#main"
          className="sr-only-focusable fixed left-4 top-4 z-[100] rounded-full bg-cocoa px-5 py-3 font-semibold text-milk"
        >
          Skip to content
        </a>
        <Header />
        <main id="main" tabIndex={-1} className="relative pt-[var(--header-h)] outline-none">
          {children}
        </main>
        <Footer />
        <MobileBar />
        <ScrollEffects />
      </body>
    </html>
  );
}
