'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Clock, ArrowRight } from 'lucide-react';
import { servicesApi } from '@/lib/api';
import type { Service } from '@/types';

const CATEGORIES = ['Всі', 'Волосся', 'Нігті', 'Макіяж', 'Вії', 'Догляд'];

const CATEGORY_IMAGES: Record<string, string> = {
  'Волосся': 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&h=200&fit=crop&q=80',
  'Нігті': 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&h=200&fit=crop&q=80',
  'Макіяж': 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=200&fit=crop&q=80',
  'Вії': 'https://images.unsplash.com/photo-1583001931096-959e9a1a6223?w=400&h=200&fit=crop&q=80',
  'Догляд': 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=400&h=200&fit=crop&q=80',
  'default': 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=200&fit=crop&q=80',
};

const STATIC_SERVICES: Service[] = [
  { id: 1, name: 'Жіноча стрижка', description: 'Стрижка, укладання, оформлення форми', price: 600, duration: 60, category: 'Волосся', isActive: true },
  { id: 2, name: 'Чоловіча стрижка', description: 'Стрижка та оформлення', price: 350, duration: 40, category: 'Волосся', isActive: true },
  { id: 3, name: 'Фарбування волосся', description: 'Повне фарбування в один тон', price: 1200, duration: 120, category: 'Волосся', isActive: true },
  { id: 4, name: 'Бальяж / Омбре', description: 'Техніка плавного переходу кольору', price: 1800, duration: 150, category: 'Волосся', isActive: true },
  { id: 5, name: 'Ламінування волосся', description: 'Відновлення та блиск', price: 900, duration: 90, category: 'Волосся', isActive: true },
  { id: 6, name: 'Класичний манікюр', description: 'Зрізний манікюр + покриття лаком', price: 380, duration: 60, category: 'Нігті', isActive: true },
  { id: 7, name: 'Манікюр гель-лак', description: 'Манікюр з покриттям гель-лаком', price: 550, duration: 90, category: 'Нігті', isActive: true },
  { id: 8, name: 'Nail-арт', description: 'Художній розпис та дизайн нігтів', price: 200, duration: 30, category: 'Нігті', isActive: true },
  { id: 9, name: 'Педикюр апаратний', description: 'Апаратний педикюр + покриття', price: 550, duration: 90, category: 'Нігті', isActive: true },
  { id: 10, name: 'Денний макіяж', description: 'Легкий денний макіяж', price: 700, duration: 60, category: 'Макіяж', isActive: true },
  { id: 11, name: 'Вечірній макіяж', description: 'Насичений вечірній макіяж', price: 1000, duration: 90, category: 'Макіяж', isActive: true },
  { id: 12, name: 'Весільний макіяж', description: 'Макіяж на весілля з пробним', price: 1500, duration: 120, category: 'Макіяж', isActive: true },
  { id: 13, name: 'Нарощування вій (класика)', description: 'Класичне нарощування', price: 900, duration: 120, category: 'Вії', isActive: true },
  { id: 14, name: 'Нарощування вій (2D/3D)', description: 'Об\'ємне нарощування', price: 1200, duration: 150, category: 'Вії', isActive: true },
  { id: 15, name: 'Корекція вій', description: 'Виправлення та доповнення', price: 500, duration: 60, category: 'Вії', isActive: true },
];

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [active, setActive] = useState('Всі');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    servicesApi.getAll()
      .then((res) => {
        if (res.data.length > 0) setServices(res.data);
        else setServices(STATIC_SERVICES);
      })
      .catch(() => setServices(STATIC_SERVICES))
      .finally(() => setLoading(false));
  }, []);

  const allServices = services.length > 0 ? services : STATIC_SERVICES;
  const filtered = active === 'Всі' ? allServices : allServices.filter((s) => s.category === active);
  const grouped = filtered.reduce<Record<string, Service[]>>((acc, s) => {
    (acc[s.category] ??= []).push(s);
    return acc;
  }, {});

  return (
    <div className="pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="section-title">Послуги</h1>
          <p className="section-subtitle">Повний спектр послуг по догляду за красою</p>
        </div>

        {/* Category filter */}
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
              <div key={i} className="card animate-pulse">
                <div className="h-44 bg-gray-200" />
                <div className="p-5 space-y-3">
                  <div className="h-5 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-100 rounded w-full" />
                  <div className="h-8 bg-gray-100 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-12">
            {Object.entries(grouped).map(([category, items]) => (
              <div key={category}>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0">
                    <Image
                      src={CATEGORY_IMAGES[category] || CATEGORY_IMAGES['default']}
                      alt={category}
                      width={40}
                      height={40}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <h2 className="font-serif text-2xl font-bold text-gray-900">{category}</h2>
                  <span className="h-px flex-1 bg-gray-200" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {items.map((service) => (
                    <div key={service.id} className="card group hover:-translate-y-0.5 transition-transform duration-200">
                      <div className="h-44 overflow-hidden">
                        <Image
                          src={CATEGORY_IMAGES[service.category] || CATEGORY_IMAGES['default']}
                          alt={service.name}
                          width={400}
                          height={176}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="p-5">
                        <h3 className="font-semibold text-gray-900 text-base mb-2">{service.name}</h3>
                        {service.description && (
                          <p className="text-sm text-gray-500 mb-4 leading-relaxed">{service.description}</p>
                        )}
                        <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                          <span className="font-bold text-rose-600 text-xl">{service.price.toLocaleString()} ₴</span>
                          <span className="flex items-center gap-1 text-sm text-gray-400">
                            <Clock className="w-4 h-4" /> {service.duration} хв
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="text-center mt-16 bg-rose-50 rounded-3xl p-10">
          <h3 className="font-serif text-2xl font-bold text-gray-900 mb-3">Готові записатися?</h3>
          <p className="text-gray-500 mb-6">Оберіть зручний час та майстра онлайн</p>
          <Link href="/booking" className="btn-primary inline-flex items-center gap-2">
            Записатися <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
