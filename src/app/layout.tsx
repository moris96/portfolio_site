import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Moris Khoudari | Lead Portfolio Architect & Security Auditor",
  description: "Security-first professional portfolio showcasing expertise in Cybersecurity, Technical SEO, and Programming.",
  openGraph: {
    title: "Moris Khoudari | Cybersecurity & Technical SEO",
    description: "Security-first professional portfolio showcasing expertise in Cybersecurity, Technical SEO, and Programming.",
    url: "https://portfolio.moriskhoudari.com",
    siteName: "Moris Khoudari Portfolio",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Moris Khoudari | Cybersecurity & Technical SEO",
    description: "Security-first professional portfolio showcasing expertise in Cybersecurity, Technical SEO, and Programming.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Header />
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Moris Khoudari",
              url: "https://portfolio.moriskhoudari.com",
              jobTitle: "Lead Portfolio Architect & Security Auditor",
              sameAs: [
                "https://github.com/moriskhoudari",
                "https://linkedin.com/in/moriskhoudari",
              ],
            }),
          }}
        />
      </body>
    </html>
  );
}
