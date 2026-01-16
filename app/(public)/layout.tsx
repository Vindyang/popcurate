import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Toaster } from '@/components/ui/sonner';
import '../globals.css';
import { SpeedInsights } from '@vercel/speed-insights/next';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://popcurate.vercel.app'),
  title: {
    default: 'Popcurate - Your Ultimate Movie Discovery & Recommendation Platform',
    template: '%s | Popcurate',
  },
  description:
    'Popcurate is your go-to movie discovery platform. Find curated movie recommendations, create personalized watchlists, explore trending films, and discover your next favorite movie. Browse popular, top-rated, and upcoming movies all in one place.',
  keywords: [
    'Popcurate',
    'popcurate',
    'movie recommendations',
    'movie discovery',
    'movie watchlist',
    'curated movies',
    'film recommendations',
    'trending movies',
    'popular movies',
    'top rated movies',
    'movie database',
    'cinema',
    'films',
    'what to watch',
    'movie finder',
    'personalized movies',
  ],
  authors: [{ name: 'Popcurate', url: 'https://popcurate.vercel.app' }],
  creator: 'Popcurate',
  publisher: 'Popcurate',
  applicationName: 'Popcurate',
  generator: 'Next.js',
  referrer: 'origin-when-cross-origin',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: 'Popcurate - Your Ultimate Movie Discovery Platform',
    description:
      'Discover curated movie recommendations, create watchlists, and find your next favorite film on Popcurate.',
    type: 'website',
    url: 'https://popcurate.vercel.app',
    siteName: 'Popcurate',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Popcurate - Movie Discovery & Recommendations',
    description:
      'Your ultimate platform for discovering curated movie recommendations and creating personalized watchlists.',
    creator: '@popcurate',
    site: '@popcurate',
  },
  alternates: {
    canonical: 'https://popcurate.vercel.app',
  },
  manifest: '/manifest.json',
  category: 'entertainment',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Organization Schema for Popcurate brand
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Popcurate',
    url: 'https://popcurate.vercel.app',
    logo: 'https://popcurate.vercel.app/logo.png',
    description:
      'Popcurate - Your ultimate movie discovery and recommendation platform',
    sameAs: [
      // Add social media profiles when available
    ],
  };

  // WebSite Schema for enhanced search appearance
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Popcurate',
    url: 'https://popcurate.vercel.app',
    description:
      'Discover curated movie recommendations, create watchlists, and find your next favorite film.',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://popcurate.vercel.app/search?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* JSON-LD structured data for Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        {/* JSON-LD structured data for WebSite */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} flex min-h-screen flex-col antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Header />
          <Toaster />
          <main className="flex-1">
            {children} <SpeedInsights />
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
