import Link from 'next/link';
import { Scissors, Phone, MapPin, Clock, Instagram } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-rose-600 rounded-full flex items-center justify-center">
                <Scissors className="w-5 h-5 text-white" />
              </div>
              <span className="font-serif text-xl font-bold text-white">Beauty Studio</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              Профессиональный уход за вашей красотой. Команда опытных мастеров, современные технологии, уютная атмосфера.
            </p>
            <div className="flex gap-3 mt-5">
              <a href="#" className="w-9 h-9 bg-gray-800 rounded-full flex items-center justify-center hover:bg-rose-600 transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Навигация</h3>
            <ul className="space-y-2 text-sm">
              {[
                { href: '/', label: 'Главная' },
                { href: '/services', label: 'Услуги' },
                { href: '/portfolio', label: 'Портфолио' },
                { href: '/booking', label: 'Запись' },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="hover:text-rose-400 transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Контакты</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <Phone className="w-4 h-4 mt-0.5 text-rose-400 shrink-0" />
                <span>+7 (900) 123-45-67</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 text-rose-400 shrink-0" />
                <span>ул. Примерная, 15, Москва</span>
              </li>
              <li className="flex items-start gap-2">
                <Clock className="w-4 h-4 mt-0.5 text-rose-400 shrink-0" />
                <span>Пн–Сб: 9:00 – 20:00<br />Вс: выходной</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} Beauty Studio. Все права защищены.</p>
          <Link href="/admin" className="hover:text-gray-400 transition-colors">Вход для администратора</Link>
        </div>
      </div>
    </footer>
  );
}
