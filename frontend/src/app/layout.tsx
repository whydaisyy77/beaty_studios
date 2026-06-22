import type { Metadata } from 'next';
import './globals.css';
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
    <html lang="uk">
      <body>
        <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
