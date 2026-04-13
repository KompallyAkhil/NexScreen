import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://nexscreen.vercel.app"),
  title: "NexScreen",
  description: "NexScreen - AI-Powered Resume Screening",
  openGraph: {
    title: "NexScreen | AI-Powered Resume Screening",
    siteName: "NexScreen",
    description:
      "Screen resumes at scale with AI. Get semantic matching scores and technical gap analysis in seconds.",
    images: [
      {
        url: "https://nexscreen.vercel.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "NexScreen | AI-Powered Resume Screening",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "NexScreen | AI-Powered Resume Screening",
    description:
      "Screen resumes at scale with AI. Get semantic matching scores and technical gap analysis in seconds.",
    images: ["https://nexscreen.vercel.app/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
