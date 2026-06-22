'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, Calendar, Scissors, Image, Users, LogOut, Menu, ChevronRight } from 'lucide-react';
import clsx from 'clsx';
import { Toaster } from 'react-hot-toast';

const navItems = [
  { href: '/admin/dashboard', label: 'Огляд', icon: LayoutDashboard },
  { href: '/admin/dashboard/appointments', label: 'Записи', icon: Calendar },
  { href: '/admin/dashboard/services', label: 'Послуги', icon: Scissors },
  { href: '/admin/dashboard/gallery', label: 'Портфоліо', icon: Image },
  { href: '/admin/dashboard/masters', label: 'Майстри', icon: Users },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<{ name: string } | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isLoginPage = pathname === '/admin';

  useEffect(() => {
    if (isLoginPage) return;
    const stored = localStorage.getItem('user');
    if (!stored || !localStorage.getItem('token')) { router.push('/admin'); return; }
    setUser(JSON.parse(stored));
  }, [isLoginPage, router]);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/admin');
  };

  if (isLoginPage) return <><Toaster position="top-right" />{children}</>;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Toaster position="top-right" />

      <aside className={clsx(
        'fixed inset-y-0 left-0 z-40 w-64 bg-gray-900 text-white flex flex-col transition-transform duration-300',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      )}>
        <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-800">
          <div className="w-8 h-8 bg-rose-600 rounded-full flex items-center justify-center">
            <Scissors className="w-4 h-4 text-white" />
          </div>
          <span className="font-serif font-bold text-lg">Beauty Studio</span>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href} onClick={() => setSidebarOpen(false)}
              className={clsx(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                pathname === href ? 'bg-rose-600 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              )}>
              <Icon className="w-4 h-4" />
              {label}
              {pathname === href && <ChevronRight className="w-4 h-4 ml-auto" />}
            </Link>
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-gray-800">
          <div className="px-3 py-2 text-xs text-gray-500 mb-2">{user?.name}</div>
          <button onClick={logout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:bg-gray-800 hover:text-red-400 transition-all">
            <LogOut className="w-4 h-4" /> Вийти
          </button>
        </div>
      </aside>

      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4 flex items-center gap-4">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-1 text-gray-600">
            <Menu className="w-5 h-5" />
          </button>
          <h1 className="text-sm font-medium text-gray-500">
            {navItems.find((n) => n.href === pathname)?.label || 'Панель управління'}
          </h1>
          <Link href="/" className="ml-auto text-xs text-gray-400 hover:text-rose-600 transition-colors">
            ← Повернутися на сайт
          </Link>
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
