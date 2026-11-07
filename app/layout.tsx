import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";
import { LenisProvider } from "@/components/providers/LenisProvider";
import { Doto, IBM_Plex_Mono, Space_Grotesk } from "next/font/google";
import { StartupLoader } from "@/components/ui/StartupLoader";
import NoiseOverlay from "@/components/ui/NoiseOverlay";
import CustomCursor from "@/components/ui/CustomCursor";
import ScrollProgress from "@/components/layout/ScrollProgress";
import ScrollObserver from "@/components/ui/ScrollObserver";
import StoryMotion from "@/components/ui/StoryMotion";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { siteMeta } from "@/lib/data";

const doto = Doto({ subsets: ["latin"], variable: "--font-doto", display: "swap" });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space-grotesk", display: "swap" });
const plexMono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700"], variable: "--font-ibm-plex-mono", display: "swap" });

const BASE_URL = "https://preethravani-portfolio.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Preeth Ravani | Full-Stack Software Engineer & Creative Developer",
    template: "%s | Preeth Ravani",
  },
  description:
    "Official developer portfolio of Preeth Ravani — Information Technology Engineer, Full-Stack Developer, and Creative Technologist specializing in React, Next.js, TypeScript, Distributed Systems, and High-Performance Web Architecture.",
  applicationName: "Preeth Ravani Portfolio",
  authors: [{ name: siteMeta.name, url: "https://github.com/PreethRavani" }],
  generator: "Next.js",
  keywords: [
    "Preeth Ravani",
    "Preeth",
    "Ravani",
    "Software Engineer",
    "Full-Stack Developer",
    "Frontend Developer",
    "Next.js Portfolio",
    "React Developer",
    "TypeScript",
    "UI/UX Engineering",
    "Creative Developer",
    "Nothing OS Theme",
    "Mumbai Engineer",
    "DJSCE",
    "DJ Sanghvi College of Engineering",
    "Web Development",
    "Computer Science",
    "Open Source Developer",
    "Cybernetic UI",
    "Tailwind CSS",
    "JavaScript",
    "Node.js",
  ],
  creator: siteMeta.name,
  publisher: siteMeta.name,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: BASE_URL,
  },
  verification: {
    google: "bxNZx6aSBQ7g5_xq3PqomfoIvt7kxJGIX1t4o9rZmv4",
  },
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
      { url: "/favicon.png", type: "image/png" },
      { url: "/images/favicon.png", type: "image/png" },
    ],
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
  openGraph: {
    title: "Preeth Ravani | Full-Stack Software Engineer & Creative Developer",
    description:
      "Interactive digital portfolio of Preeth Ravani — Full-Stack Developer & IT Engineering student building clean, purposeful digital solutions with Next.js, React, and TypeScript.",
    type: "profile",
    locale: "en_US",
    siteName: "Preeth Ravani — Developer Portfolio",
    url: BASE_URL,
    images: [
      {
        url: `${BASE_URL}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "Preeth Ravani — Full-Stack Developer Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Preeth Ravani | Full-Stack Software Engineer & Creative Developer",
    description:
      "Full-stack software engineer & IT student building high-performance web systems and creative interfaces.",
    images: [`${BASE_URL}/opengraph-image`],
    creator: "@preeth_ravani",
  },
};

export const viewport: Viewport = {
  themeColor: "#050505",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

const jsonLdPerson = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Preeth Ravani",
  url: BASE_URL,
  image: `${BASE_URL}/images/pfp2.png`,
  sameAs: [
    "https://github.com/PreethRavani",
    "https://linkedin.com/in/preeth-ravani",
    "https://instagram.com/preeth_ravani",
  ],
  jobTitle: "Full-Stack Software Engineer",
  worksFor: {
    "@type": "Organization",
    name: "Independent Engineer & Student Developer",
  },
  alumniOf: {
    "@type": "EducationalOrganization",
    name: "DJ Sanghvi College of Engineering",
  },
  description:
    "Full-stack software engineer and IT engineering student specializing in React, Next.js, TypeScript, and high-performance web systems.",
  knowsAbout: [
    "Full-Stack Development",
    "Next.js",
    "React",
    "TypeScript",
    "JavaScript",
    "Tailwind CSS",
    "Node.js",
    "System Design",
    "Data Structures and Algorithms",
    "Nothing OS Design Aesthetics",
    "UI/UX Engineering",
  ],
};

const jsonLdWebSite = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Preeth Ravani Portfolio",
  url: BASE_URL,
  description:
    "Official interactive developer portfolio of Preeth Ravani — Information Technology Engineer and Full-Stack Developer.",
  author: {
    "@type": "Person",
    name: "Preeth Ravani",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`dark ${doto.variable} ${spaceGrotesk.variable} ${plexMono.variable}`}>
      <head>
        <Script
          id="json-ld-person"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdPerson) }}
        />
        <Script
          id="json-ld-website"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebSite) }}
        />
      </head>
      <body className="antialiased bg-background text-foreground">
        <LenisProvider>
          <StartupLoader />
          <NoiseOverlay />
          <CustomCursor />
          <ScrollProgress />
          <ScrollObserver />
          <StoryMotion />

          {/* Navigation Header */}
          <Header />

          {/* Page Contents */}
          <main id="top" className="relative min-h-screen">
            {children}
          </main>

          {/* Site Footer */}
          <Footer />
        </LenisProvider>
      </body>
    </html>
  );
}
