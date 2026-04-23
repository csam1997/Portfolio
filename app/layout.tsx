import type { Metadata } from 'next';
import { Outfit } from 'next/font/google';
import type { ReactNode } from 'react';

import './globals.css';

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'Security & QA Portfolio',
  description: 'A personal portfolio for security engineering and QA work.',
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
