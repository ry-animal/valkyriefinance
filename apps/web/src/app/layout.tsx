import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import '../index.css';
import Header from '@/components/header';
import { cn } from '@/lib/utils';
import ProvidersWrapper from './providers-wrapper';

const geistSans = Geist({ subsets: ['latin'], variable: '--font-geist-sans' });
const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
});

export const metadata: Metadata = {
  title: 'Valkyrie Finance',
  description: 'AI-Powered DeFi',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.png" style={{ filter: 'invert(1)' }} />
      </head>
      <body
        className={cn(
          'min-h-screen bg-white dark:bg-black text-black dark:text-white font-sans antialiased',
          geistSans.variable,
          geistMono.variable
        )}
      >
        <ProvidersWrapper>
          <Header />
          <main className="container mx-auto py-8">{children}</main>
        </ProvidersWrapper>
      </body>
    </html>
  );
}
