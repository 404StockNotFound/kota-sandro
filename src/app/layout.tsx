import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';

const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'], weight: ['400', '500', '600', '700', '800'] });

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://kota-sandro.vercel.app';
const DESC = 'Portfolio Laksandro Ramadhanu, Product Developer. Setir truknya keliling Kota Sandro, mampir ke 5 tempat, dan kenalan sama proyek-proyekku.';

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: { default: 'Kota Sandro — Laksandro Ramadhanu, Product Developer', template: '%s · Kota Sandro' },
  description: DESC,
  keywords: ['Laksandro Ramadhanu', 'Product Developer', 'Next.js', 'TypeScript', 'portfolio', 'developer Indonesia'],
  authors: [{ name: 'Laksandro Ramadhanu' }],
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: SITE,
    siteName: 'Kota Sandro',
    title: 'Kota Sandro — Laksandro Ramadhanu',
    description: DESC,
  },
  twitter: { card: 'summary_large_image', title: 'Kota Sandro — Laksandro Ramadhanu', description: DESC },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className={`${jakarta.className} min-h-screen bg-[#EEF3EF] text-[#1F2A3A] antialiased`}>
        {children}
      </body>
    </html>
  );
}