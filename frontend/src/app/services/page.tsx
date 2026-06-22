'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Clock, ArrowRight } from 'lucide-react';
import { servicesApi } from '@/lib/api';
import type { Service } from '@/types';

const CATEGORIES = ['Все', 'Волосы', 'Ногти', 'Макияж', 'Ресницы'];

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [active, setActive] = useState('Все');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    servicesApi
      .getAll()
      .then((res) => setServices(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = active === 'Все' ? services : services.filter((s) => s.category === active);
  const grouped = filtered.reduce<Record<string, Service[]>>((acc, s) => {
    (acc[s.category] ??= []).push(s);
    return acc;
  }, {});

  return (
    <div className="pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="section-title">Услуги</h1>
          <p className="section-subtitle">Полный спектр услуг по уходу за красотой</p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 justify-center mb-10">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                active === cat
                  ? 'bg-rose-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-rose-50 hover:text-rose-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="card p-6 animate-pulse">
                <div className="h-5 bg-gray-200 rounded w-3/4 mb-3" />
                <div className="h-4 bg-gray-100 rounded w-full mb-2" />
                <div className="h-8 bg-gray-100 rounded w-1/2 mt-4" />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-12">
            {Object.entries(grouped).map(([category, items]) => (
              <div key={category}>
                <h2 className="font-serif text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  {category}
                  <span className="h-px flex-1 bg-gray-200" />
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {items.map((service) => (
                    <div key={service.id} className="card p-6 hover:-translate-y-0.5 transition-transform">
                      <h3 className="font-semibold text-gray-900 text-base mb-2">{service.name}</h3>
                      {service.description && (
                        <p className="text-sm text-gray-500 mb-4 leading-relaxed">{service.description}</p>
                      )}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                        <span className="font-bold text-rose-600 text-xl">{service.price.toLocaleString()} ₽</span>
                        <span className="flex items-center gap-1 text-sm text-gray-400">
                          <Clock className="w-4 h-4" /> {service.duration} мин
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="text-center mt-16 bg-rose-50 rounded-3xl p-10">
          <h3 className="font-serif text-2xl font-bold text-gray-900 mb-3">Готовы записаться?</h3>
          <p className="text-gray-500 mb-6">Выберите удобное время и мастера онлайн</p>
          <Link href="/booking" className="btn-primary inline-flex items-center gap-2">
            Записаться <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
