'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Star, ArrowRight, Clock, CheckCircle } from 'lucide-react';
import { servicesApi, galleryApi } from '@/lib/api';
import type { Service, GalleryItem } from '@/types';

const STATIC_MASTERS = [
  {
    name: 'Анна Козлова',
    specialty: 'Волосся & Фарбування',
    experience: '8 років досвіду',
    photo: 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=400&h=400&fit=crop&q=80',
  },
  {
    name: 'Марія Іванова',
    specialty: 'Манікюр & Педикюр',
    experience: '6 років досвіду',
    photo: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=400&h=400&fit=crop&q=80',
  },
  {
    name: 'Олена Петрова',
    specialty: 'Макіяж & Брови',
    experience: '5 років досвіду',
    photo: 'https://images.unsplash.com/photo-1589710751893-f9a6770ad71b?w=400&h=400&fit=crop&q=80',
  },
];

const STATIC_GALLERY = [
  { id: 1, imageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&h=600&fit=crop&q=80', category: 'Волосся', isFeatured: true },
  { id: 2, imageUrl: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&h=600&fit=crop&q=80', category: 'Нігті', isFeatured: true },
  { id: 3, imageUrl: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=600&h=600&fit=crop&q=80', category: 'Макіяж', isFeatured: true },
  { id: 4, imageUrl: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&h=600&fit=crop&q=80', category: 'Волосся', isFeatured: true },
  { id: 5, imageUrl: 'https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=600&h=600&fit=crop&q=80', category: 'Волосся', isFeatured: true },
  { id: 6, imageUrl: 'https://images.unsplash.com/photo-1610992015732-2449b76344bc?w=600&h=600&fit=crop&q=80', category: 'Нігті', isFeatured: true },
];

const REVIEWS = [
  { name: 'Анастасія К.', text: 'Неймовірно рада, що знайшла цей салон! Майстер Анна — просто чаклунка, стрижка вийшла саме такою, як я хотіла.', rating: 5, service: 'Стрижка' },
  { name: 'Марія Д.', text: 'Робила манікюр гель-лак — тримається вже 4 тижні. Дуже акуратна робота, затишна атмосфера і приємний персонал.', rating: 5, service: 'Манікюр' },
  { name: 'Ольга В.', text: 'Записалась через сайт за 5 хвилин. Майстер зустріла вчасно. Фарбування сподобалось, колір вийшов саме той.', rating: 5, service: 'Фарбування' },
];

const BENEFITS = [
  { title: 'Досвідчені майстри', desc: 'Команда профі з досвідом від 5 років' },
  { title: 'Преміум матеріали', desc: 'Лише сертифікована косметика провідних брендів' },
  { title: 'Онлайн-запис', desc: 'Запишіться в будь-який час, не виходячи з дому' },
  { title: 'Гарантія якості', desc: 'Якщо щось не сподобалось — виправимо безкоштовно' },
];

export default function HomePage() {
  const [services, setServices] = useState<Service[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>(STATIC_GALLERY);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([servicesApi.getAll(), galleryApi.getAll()])
      .then(([sRes, gRes]) => {
        setServices(sRes.data.slice(0, 6));
        const featured = gRes.data.filter((g: GalleryItem) => g.isFeatured).slice(0, 6);
        if (featured.length > 0) setGallery(featured);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="overflow-x-hidden">
      {/* Hero */}
      <section className="relative min-h-screen flex items-center bg-gradient-to-br from-rose-50 via-white to-rose-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
            <div className="animate-slide-up">
              <span className="inline-flex items-center gap-1.5 text-rose-600 text-sm font-semibold bg-rose-50 border border-rose-200 px-3 py-1 rounded-full mb-6">
                <Star className="w-3.5 h-3.5 fill-rose-500" /> Професійний салон краси у Києві
              </span>
              <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight">
                Розкрийте
                <br />
                <span className="text-rose-600">вашу</span>
                <br />
                красу
              </h1>
              <p className="text-gray-500 text-lg mt-6 mb-8 max-w-md leading-relaxed">
                Команда професійних майстрів створить саме той образ, про який ви мрієте. Першокласний сервіс у затишній атмосфері.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/booking" className="btn-primary flex items-center gap-2">
                  Записатися онлайн <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="/portfolio" className="btn-secondary">
                  Наші роботи
                </Link>
              </div>
              <div className="flex items-center gap-8 mt-10">
                {[['500+', 'задоволених клієнтів'], ['8 років', 'на ринку'], ['15', 'майстрів']].map(([num, label]) => (
                  <div key={label}>
                    <div className="text-2xl font-bold text-gray-900">{num}</div>
                    <div className="text-xs text-gray-500">{label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative hidden lg:block">
              <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&h=750&fit=crop&q=80"
                  alt="Салон краси Beauty Studio"
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
                    <div className="text-sm font-semibold text-gray-900">Запис підтверджено</div>
                    <div className="text-xs text-gray-500">Завтра о 14:00</div>
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
            {BENEFITS.map(({ title, desc }) => (
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
          <h2 className="section-title">Наші послуги</h2>
          <p className="section-subtitle">Широкий спектр процедур по догляду за собою</p>

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
          ) : services.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
              {services.map((service) => (
                <div key={service.id} className="card group hover:-translate-y-1 transition-transform duration-200">
                  <div className="h-40 overflow-hidden">
                    <Image
                      src={CATEGORY_IMAGES[service.category] || CATEGORY_IMAGES['default']}
                      alt={service.name}
                      width={400}
                      height={160}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">{service.name}</h3>
                      <span className="text-xs bg-rose-50 text-rose-600 px-2 py-0.5 rounded-full font-medium shrink-0 ml-2">
                        {service.category}
                      </span>
                    </div>
                    {service.description && (
                      <p className="text-sm text-gray-500 mb-3 leading-relaxed">{service.description}</p>
                    )}
                    <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                      <span className="font-bold text-rose-600 text-lg">{service.price.toLocaleString()} ₴</span>
                      <span className="flex items-center gap-1 text-xs text-gray-400">
                        <Clock className="w-3.5 h-3.5" /> {service.duration} хв
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
              {STATIC_SERVICES.map((service) => (
                <div key={service.name} className="card group hover:-translate-y-1 transition-transform duration-200">
                  <div className="h-40 overflow-hidden">
                    <Image
                      src={service.image}
                      alt={service.name}
                      width={400}
                      height={160}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">{service.name}</h3>
                      <span className="text-xs bg-rose-50 text-rose-600 px-2 py-0.5 rounded-full font-medium shrink-0 ml-2">
                        {service.category}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mb-3 leading-relaxed">{service.description}</p>
                    <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                      <span className="font-bold text-rose-600 text-lg">від {service.price} ₴</span>
                      <span className="flex items-center gap-1 text-xs text-gray-400">
                        <Clock className="w-3.5 h-3.5" /> {service.duration} хв
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-10">
            <Link href="/services" className="btn-secondary inline-flex items-center gap-2">
              Всі послуги <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Masters */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="section-title">Наші майстри</h2>
          <p className="section-subtitle">Команда досвідчених фахівців, закоханих у свою справу</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {STATIC_MASTERS.map((master) => (
              <div key={master.name} className="text-center group">
                <div className="w-48 h-48 mx-auto rounded-full overflow-hidden mb-5 ring-4 ring-rose-100 group-hover:ring-rose-300 transition-all duration-300 shadow-lg">
                  <Image
                    src={master.photo}
                    alt={master.name}
                    width={192}
                    height={192}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h3 className="font-serif text-xl font-bold text-gray-900">{master.name}</h3>
                <p className="text-rose-600 font-medium text-sm mt-1">{master.specialty}</p>
                <p className="text-gray-400 text-xs mt-1">{master.experience}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/masters" className="btn-secondary inline-flex items-center gap-2">
              Всі майстри <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="section-title">Наші роботи</h2>
          <p className="section-subtitle">Найкращі роботи наших майстрів</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-12">
            {gallery.map((item) => (
              <div key={item.id} className="aspect-square rounded-2xl overflow-hidden group relative">
                <Image
                  src={item.imageUrl}
                  alt={item.category}
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
              Дивитися всі <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="py-20 bg-rose-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="section-title">Відгуки клієнтів</h2>
          <p className="section-subtitle">Що кажуть про нас наші клієнти</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            {REVIEWS.map((review) => (
              <div key={review.name} className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="flex gap-0.5 mb-4">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">&ldquo;{review.text}&rdquo;</p>
                <div>
                  <div className="font-semibold text-sm text-gray-900">{review.name}</div>
                  <div className="text-xs text-gray-400">{review.service}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-rose-600">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="font-serif text-4xl font-bold text-white mb-4">Готові до перетворення?</h2>
          <p className="text-rose-100 text-lg mb-8">Запишіться онлайн прямо зараз — це займе менше хвилини</p>
          <Link
            href="/booking"
            className="inline-flex items-center gap-2 bg-white text-rose-600 font-semibold px-8 py-4 rounded-full hover:bg-rose-50 transition-colors shadow-lg text-lg"
          >
            Записатися онлайн <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}

const CATEGORY_IMAGES: Record<string, string> = {
  'Волосся': 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&h=160&fit=crop&q=80',
  'Нігті': 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&h=160&fit=crop&q=80',
  'Макіяж': 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=160&fit=crop&q=80',
  'Вії': 'https://images.unsplash.com/photo-1583001931096-959e9a1a6223?w=400&h=160&fit=crop&q=80',
  'Догляд': 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=400&h=160&fit=crop&q=80',
  'default': 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=160&fit=crop&q=80',
};

const STATIC_SERVICES = [
  { name: 'Жіноча стрижка', description: 'Стрижка, укладання, оформлення форми', price: 600, duration: 60, category: 'Волосся', image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&h=160&fit=crop&q=80' },
  { name: 'Фарбування волосся', description: 'Повне фарбування в один тон', price: 1200, duration: 120, category: 'Волосся', image: 'https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=400&h=160&fit=crop&q=80' },
  { name: 'Манікюр гель-лак', description: 'Манікюр з покриттям гель-лаком', price: 550, duration: 90, category: 'Нігті', image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&h=160&fit=crop&q=80' },
  { name: 'Педикюр', description: 'Класичний педикюр', price: 500, duration: 90, category: 'Нігті', image: 'https://images.unsplash.com/photo-1610992015732-2449b76344bc?w=400&h=160&fit=crop&q=80' },
  { name: 'Макіяж вечірній', description: 'Насичений вечірній макіяж', price: 1000, duration: 90, category: 'Макіяж', image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=160&fit=crop&q=80' },
  { name: 'Нарощування вій', description: 'Класичне нарощування', price: 900, duration: 120, category: 'Вії', image: 'https://images.unsplash.com/photo-1583001931096-959e9a1a6223?w=400&h=160&fit=crop&q=80' },
];
