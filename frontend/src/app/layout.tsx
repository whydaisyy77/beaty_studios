import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Beauty Studio — Салон красоты',
  description: 'Профессиональный салон красоты. Стрижки, окрашивание, маникюр, педикюр, макияж. Онлайн-запись.',
  keywords: 'салон красоты, маникюр, стрижка, окрашивание, запись онлайн',
  openGraph: {
    title: 'Beauty Studio — Салон красоты',
    description: 'Профессиональный уход за вашей красотой',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body>
        <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
