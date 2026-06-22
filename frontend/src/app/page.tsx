'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Star, ArrowRight, Clock, CheckCircle } from 'lucide-react';
import { servicesApi, galleryApi } from '@/lib/api';
import type { Service, GalleryItem } from '@/types';

const reviews = [
  { name: 'Анастасия К.', text: 'Невероятно рада, что нашла этот салон! Мастер Анна — просто волшебник, стрижка получилась именно такой, как я хотела.', rating: 5, service: 'Стрижка' },
  { name: 'Мария Д.', text: 'Делала маникюр гель-лак — держится уже 4 недели. Очень аккуратная работа, уютная атмосфера.', rating: 5, service: 'Маникюр' },
  { name: 'Ольга В.', text: 'Записалась через сайт за 5 минут. Мастер встретила вовремя. Окрашивание понравилось, цвет получился именно тот.', rating: 5, service: 'Окрашивание' },
];

const benefits = [
  { title: 'Опытные мастера', desc: 'Команда профессионалов с опытом от 5 лет' },
  { title: 'Премиум материалы', desc: 'Только сертифицированная косметика ведущих брендов' },
  { title: 'Онлайн-запись', desc: 'Запишитесь в любое время, не выходя из дома' },
  { title: 'Гарантия качества', desc: 'Если что-то не понравилось — исправим бесплатно' },
];

export default function HomePage() {
  const [services, setServices] = useState<Service[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([servicesApi.getAll(), galleryApi.getAll()])
      .then(([sRes, gRes]) => {
        setServices(sRes.data.slice(0, 6));
        setGallery(gRes.data.filter((g: GalleryItem) => g.isFeatured).slice(0, 6));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="overflow-x-hidden">
      {/* Hero */}
      <section className="relative min-h-screen flex items-center bg-gradient-to-br from-rose-50 via-white to-rose-50">
        <div className="absolute inset-0 bg-[url('/hero-pattern.svg')] opacity-5" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
            <div className="animate-slide-up">
              <span className="inline-flex items-center gap-1.5 text-rose-600 text-sm font-semibold bg-rose-50 border border-rose-200 px-3 py-1 rounded-full mb-6">
                <Star className="w-3.5 h-3.5 fill-rose-500" /> Профессиональный салон красоты
              </span>
              <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight">
                Раскройте
                <br />
                <span className="text-rose-600">вашу</span>
                <br />
                красоту
              </h1>
              <p className="text-gray-500 text-lg mt-6 mb-8 max-w-md leading-relaxed">
                Команда профессиональных мастеров создаст именно тот образ, о котором вы мечтаете. Первоклассный сервис в уютной атмосфере.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/booking" className="btn-primary flex items-center gap-2">
                  Записаться онлайн <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="/portfolio" className="btn-secondary">
                  Наши работы
                </Link>
              </div>
              <div className="flex items-center gap-8 mt-10">
                {[['500+', 'довольных клиентов'], ['8 лет', 'на рынке'], ['15', 'мастеров']].map(([num, label]) => (
                  <div key={label}>
                    <div className="text-2xl font-bold text-gray-900">{num}</div>
                    <div className="text-xs text-gray-500">{label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative hidden lg:block">
              <div className="aspect-[4/5] rounded-3xl overflow-hidden bg-gradient-to-br from-rose-100 to-rose-200 shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&h=750&fit=crop"
                  alt="Салон красоты"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <div className="absolute -bottom-6 -left-8 bg-white rounded-2xl p-4 shadow-xl border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-rose-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-rose-600" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900">Запись подтверждена</div>
                    <div className="text-xs text-gray-500">Завтра в 14:00</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {benefits.map(({ title, desc }) => (
              <div key={title} className="text-center p-6 rounded-2xl bg-gray-50 hover:bg-rose-50 transition-colors group">
                <div className="w-10 h-10 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-rose-200 transition-colors">
                  <CheckCircle className="w-5 h-5 text-rose-600" />
                </div>
                <div className="font-semibold text-gray-900 text-sm mb-1">{title}</div>
                <div className="text-xs text-gray-500 leading-relaxed">{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="section-title">Наши услуги</h2>
          <p className="section-subtitle">Широкий спектр процедур по уходу за собой</p>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="card p-6 animate-pulse">
                  <div className="h-5 bg-gray-200 rounded w-3/4 mb-3" />
                  <div className="h-4 bg-gray-100 rounded w-full mb-2" />
                  <div className="h-4 bg-gray-100 rounded w-2/3" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
              {services.map((service) => (
                <div key={service.id} className="card p-6 group hover:-translate-y-1 transition-transform duration-200">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-gray-900">{service.name}</h3>
                    <span className="text-xs bg-rose-50 text-rose-600 px-2 py-0.5 rounded-full font-medium shrink-0 ml-2">
                      {service.category}
                    </span>
                  </div>
                  {service.description && (
                    <p className="text-sm text-gray-500 mb-4 leading-relaxed">{service.description}</p>
                  )}
                  <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-50">
                    <span className="font-bold text-rose-600 text-lg">{service.price.toLocaleString()} ₽</span>
                    <span className="flex items-center gap-1 text-xs text-gray-400">
                      <Clock className="w-3.5 h-3.5" /> {service.duration} мин
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-10">
            <Link href="/services" className="btn-secondary inline-flex items-center gap-2">
              Все услуги <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Gallery */}
      {gallery.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="section-title">Наши работы</h2>
            <p className="section-subtitle">Лучшие работы наших мастеров</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-12">
              {gallery.map((item) => (
                <div key={item.id} className="aspect-square rounded-2xl overflow-hidden group relative">
                  <Image
                    src={item.imageUrl}
                    alt={item.title || item.category}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                  <span className="absolute bottom-3 left-3 bg-white/90 text-xs font-medium px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    {item.category}
                  </span>
                </div>
              ))}
            </div>
            <div className="text-center mt-10">
              <Link href="/portfolio" className="btn-secondary inline-flex items-center gap-2">
                Посмотреть все <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Reviews */}
      <section className="py-20 bg-rose-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="section-title">Отзывы клиентов</h2>
          <p className="section-subtitle">Что говорят о нас наши клиенты</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            {reviews.map((review) => (
              <div key={review.name} className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="flex gap-0.5 mb-4">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">&ldquo;{review.text}&rdquo;</p>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-sm text-gray-900">{review.name}</div>
                    <div className="text-xs text-gray-400">{review.service}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-rose-600">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="font-serif text-4xl font-bold text-white mb-4">Готовы к преображению?</h2>
          <p className="text-rose-100 text-lg mb-8">Запишитесь онлайн прямо сейчас — это займёт меньше минуты</p>
          <Link
            href="/booking"
            className="inline-flex items-center gap-2 bg-white text-rose-600 font-semibold px-8 py-4 rounded-full hover:bg-rose-50 transition-colors shadow-lg text-lg"
          >
            Записаться онлайн <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
