import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin', 'cyrillic'], variable: '--font-inter' });
const playfair = Playfair_Display({ subsets: ['latin', 'cyrillic'], variable: '--font-playfair' });
import { Toaster } from 'react-hot-toast';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Beauty Studio — Салон краси у Києві',
  description: 'Професійний салон краси у Києві. Стрижки, фарбування, манікюр, педикюр, макіяж. Онлайн-запис.',
  keywords: 'салон краси, манікюр, стрижка, фарбування, запис онлайн, Київ',
  openGraph: {
    title: 'Beauty Studio — Салон краси у Києві',
    description: 'Професійний догляд за вашою красою',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uk" className={`${inter.variable} ${playfair.variable}`}>
      <body className={inter.className}>
        <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
