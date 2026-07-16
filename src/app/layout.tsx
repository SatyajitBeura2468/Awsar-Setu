import type { Metadata, Viewport } from "next";
import "@fontsource-variable/noto-sans";
import "@fontsource-variable/noto-sans-devanagari";
import "./globals.css";
import "./v5.css";
import { AppProviders } from "@/components/app/app-providers";
import { AppShell } from "@/components/app/app-shell";

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://awsarsetu.app";

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: {
    default: "AwsarSetu | Public opportunity discovery for India",
    template: "%s | AwsarSetu",
  },
  description:
    "Find scholarships, vacancies, schemes, training and support through a clear, source-first public opportunity platform.",
  manifest: "/manifest.webmanifest",
  applicationName: "AwsarSetu",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "AwsarSetu",
    description:
      "A citizen-first platform for scholarships, vacancies, schemes, training and support across India.",
    url: appUrl,
    siteName: "AwsarSetu",
    type: "website",
  },
  appleWebApp: {
    capable: true,
    title: "AwsarSetu",
    statusBarStyle: "default",
  },
  icons: {
    icon: "/brand/awsarsetu-logo.svg",
  },
};

export const viewport: Viewport = {
  themeColor: "#F4F8FC",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full scroll-smooth">
      <body className="min-h-full">
        <AppProviders>
          <AppShell>{children}</AppShell>
        </AppProviders>
      </body>
    </html>
  );
}
