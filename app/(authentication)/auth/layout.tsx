import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import '../../globals.css';
import { Toaster } from '@/components/ui/sonner';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Popcurate - Curated movie recommendations',
  description:
    'Discover your next favorite movie with personalized recommendations, create watchlists, and connect with fellow movie enthusiasts.',
  keywords: [
    'movies',
    'recommendations',
    'watchlist',
    'cinema',
    'films',
    'reviews',
  ],
  authors: [{ name: 'Popcurate Team' }],
  openGraph: {
    title: 'Popcurate - Curated movie recommendations',
    description:
      'Discover your next favorite movie with personalized recommendations',
    type: 'website',
    siteName: 'Popcurate',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Popcurate - Curated movie recommendations',
    description:
      'Discover your next favorite movie with personalized recommendations',
  },
  manifest: '/manifest.json',
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} flex min-h-screen flex-col antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <main className="flex-1">{children}</main>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
