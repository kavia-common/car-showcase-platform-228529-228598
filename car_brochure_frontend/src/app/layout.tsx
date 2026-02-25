import type { Metadata } from "next";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "ChromeRetro — Car Brochure",
    template: "%s • ChromeRetro",
  },
  description:
    "A retro-themed car brochure experience: browse models, view specs and trims, compare cars, and send leads.",
  metadataBase: new URL("https://example.com"),
  openGraph: {
    title: "ChromeRetro — Car Brochure",
    description:
      "Browse models, explore trims and specs, compare cars, and send leads — all in a neon retro interface.",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <div className="app-shell">
          <SiteHeader />
          <main className="container w-full flex-1 py-8">{children}</main>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
