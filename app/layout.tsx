import type { Metadata } from 'next';
import { Space_Grotesk, Inter } from 'next/font/google';
import './globals.css';
import AnnounceBar from '@/components/AnnounceBar';
import NavbarClient from '@/components/NavbarClient';

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-display', display: 'swap' });
const inter = Inter({ subsets: ['latin'], variable: '--font-body', display: 'swap' });

export const metadata: Metadata = {
  title: 'VeritasBTC — Prove What\'s Real on Bitcoin',
  description: 'Bitcoin-anchored content verification. Hash your file, anchor its fingerprint on Bitcoin, share a tamper-proof certificate. Forever.',
  openGraph: {
    title: 'VeritasBTC — Prove What\'s Real on Bitcoin',
    description: 'Anchor any file\'s fingerprint on Bitcoin. Permanent proof of existence in seconds.',
    type: 'website',
  },
  other: {
    'talentapp:project_verification': 'fd5c1ccb3b010b6a565e46368688b3fc0188fba77771160bdd8bb181c3010f4724ad9be034d99faad4ebc595e0345fcef879c8e6453d24980fafba0a377fb236',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${inter.variable}`}>
      <body>
        <AnnounceBar />
        <NavbarClient />
        {children}
      </body>
    </html>
  );
}
