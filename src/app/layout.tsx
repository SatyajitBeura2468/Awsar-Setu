import type { Metadata, Viewport } from "next";
import "@fontsource-variable/noto-sans";
import "@fontsource-variable/noto-sans-devanagari";
import "./globals.css";
import { AppProviders } from "@/components/app/app-providers";
import { AppShell } from "@/components/app/app-shell";

export const metadata: Metadata = {
  metadataBase: new URL("https://awsarsetu.app"),
  title: {
    default: "AwsarSetu | Find opportunities made for your next step",
    template: "%s | AwsarSetu",
  },
  description:
    "Scholarships, jobs, vacancies, schemes, training and support, all in one clear place.",
  manifest: "/manifest.webmanifest",
  applicationName: "AwsarSetu",
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
  themeColor: "#FFF8EF",
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
