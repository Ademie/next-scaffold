import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  title: {
    default: 'FeaturePulse — Team Feedback & Public Roadmap',
    template: '%s | FeaturePulse',
  },
  description: 'Share ideas, vote on what matters, and follow product roadmaps in real time.',
  openGraph: {
    title: 'FeaturePulse — Team Feedback & Public Roadmap',
    description: 'Share ideas, vote on what matters, and follow product roadmaps in real time.',
    siteName: 'FeaturePulse',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FeaturePulse — Team Feedback & Public Roadmap',
    description: 'Share ideas, vote on what matters, and follow product roadmaps in real time.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="light" className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <body className="min-h-screen bg-base-100 text-base-content flex flex-col font-sans">
        {children}
      </body>
    </html>
  );
}
