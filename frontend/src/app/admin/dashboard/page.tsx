'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Calendar, Scissors, TrendingUp, Clock, ArrowRight } from 'lucide-react';
import { appointmentsApi, servicesApi } from '@/lib/api';
import type { Appointment } from '@/types';
import { format } from 'date-fns';
import { uk } from 'date-fns/locale';
import clsx from 'clsx';

const STATUS_LABELS: Record<string, string> = {
  NEW: 'Новая',
  CONFIRMED: 'Подтверждена',
  CANCELLED: 'Отменена',
  COMPLETED: 'Завершена',
};

export default function DashboardPage() {
  const [stats, setStats] = useState({ total: 0, new: 0, confirmed: 0, services: 0 });
  const [recent, setRecent] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      appointmentsApi.getAll({ limit: 5 }),
      servicesApi.getAll(),
    ]).then(([appRes, svcRes]) => {
      const all: Appointment[] = appRes.data.appointments;
      setRecent(all);
      setStats({
        total: appRes.data.total,
        new: all.filter((a) => a.status === 'NEW').length,
        confirmed: all.filter((a) => a.status === 'CONFIRMED').length,
        services: svcRes.data.length,
      });
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const cards = [
    { label: 'Всего записей', value: stats.total, icon: Calendar, color: 'bg-blue-50 text-blue-600' },
    { label: 'Новые', value: stats.new, icon: Clock, color: 'bg-amber-50 text-amber-600' },
    { label: 'Подтверждено', value: stats.confirmed, icon: TrendingUp, color: 'bg-green-50 text-green-600' },
    { label: 'Услуг', value: stats.services, icon: Scissors, color: 'bg-rose-50 text-rose-600' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-2xl font-bold text-gray-900">Добро пожаловать!</h1>
        <p className="text-gray-500 mt-1">Обзор активности вашего салона</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${color}`}>
              <Icon className="w-5 h-5" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{loading ? '—' : value}</div>
            <div className="text-sm text-gray-500 mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Последние записи</h2>
          <Link href="/admin/dashboard/appointments" className="text-sm text-rose-600 hover:underline flex items-center gap-1">
            Все <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="p-6 space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-100 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : recent.length === 0 ? (
          <div className="p-10 text-center text-gray-400">Записей пока нет</div>
        ) : (
          <div className="divide-y divide-gray-50">
            {recent.map((a) => (
              <div key={a.id} className="px-6 py-4 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <div className="font-medium text-gray-900 truncate">{a.userName}</div>
                  <div className="text-sm text-gray-500">{a.service.name} · {a.date} {a.time}</div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className={clsx(
                    'text-xs font-semibold px-2.5 py-1 rounded-full',
                    a.status === 'NEW' ? 'badge-new' :
                    a.status === 'CONFIRMED' ? 'badge-confirmed' :
                    a.status === 'CANCELLED' ? 'badge-cancelled' : 'badge-completed'
                  )}>
                    {STATUS_LABELS[a.status]}
                  </span>
                  <span className="font-semibold text-gray-900 text-sm">{a.service.price.toLocaleString()} ₽</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
