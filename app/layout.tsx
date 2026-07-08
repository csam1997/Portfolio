import type { Metadata } from 'next';
import { Outfit } from 'next/font/google';
import type { ReactNode } from 'react';

import './globals.css';

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'Chiranjib Samantaray — Cloud, Systems & Identity Portfolio',
  description:
    'Portfolio of Chiranjib Samantaray: Azure cloud administration, Windows/Linux systems engineering, identity & access management (IAM), and QA automation.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" className={outfit.variable}>
      <body>{children}</body>
    </html>
  );
}
