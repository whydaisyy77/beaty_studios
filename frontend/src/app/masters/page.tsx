'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { mastersApi } from '@/lib/api';
import type { Master } from '@/types';

const DAYS_UK = ['Нд', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];

const STATIC_MASTERS = [
  {
    id: 1,
    name: 'Анна Козлова',
    specialty: 'Волосся & Фарбування',
    bio: 'Спеціаліст з фарбування та стрижок з 8-річним досвідом. Майстер бальяжу та омбре. Постійно вдосконалює навички на міжнародних тренінгах.',
    photoUrl: 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=500&h=500&fit=crop&q=80',
    schedules: [1,2,3,4,5,6].map(d => ({ dayOfWeek: d, startTime: '09:00', endTime: '19:00', isWorking: true })),
  },
  {
    id: 2,
    name: 'Марія Іванова',
    specialty: 'Манікюр & Педикюр',
    bio: 'Майстер манікюру та педикюру, художній розпис нігтів. 6 років у nail-індустрії. Використовує лише гіпоалергенні матеріали преміум класу.',
    photoUrl: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=500&h=500&fit=crop&q=80',
    schedules: [1,2,3,4,5].map(d => ({ dayOfWeek: d, startTime: '10:00', endTime: '18:00', isWorking: true })),
  },
  {
    id: 3,
    name: 'Олена Петрова',
    specialty: 'Макіяж & Брови',
    bio: 'Візажист та спеціаліст з оформлення брів. 5 років досвіду. Працювала на fashion-тижнях. Робить денний, вечірній та весільний макіяж.',
    photoUrl: 'https://images.unsplash.com/photo-1589710751893-f9a6770ad71b?w=500&h=500&fit=crop&q=80',
    schedules: [2,3,4,5,6].map(d => ({ dayOfWeek: d, startTime: '11:00', endTime: '20:00', isWorking: true })),
  },
  {
    id: 4,
    name: 'Тетяна Мороз',
    specialty: 'Нарощування вій',
    bio: 'Сертифікований майстер з нарощування вій. 4 роки досвіду. Класика, 2D, 3D об\'єм. Індивідуальний підхід до кожної клієнтки.',
    photoUrl: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=500&h=500&fit=crop&q=80',
    schedules: [1,3,4,5,6].map(d => ({ dayOfWeek: d, startTime: '09:00', endTime: '19:00', isWorking: true })),
  },
];

export default function MastersPage() {
  const [masters, setMasters] = useState<Master[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    mastersApi.getAll()
      .then((r) => {
        if (r.data.length > 0) setMasters(r.data);
        else setMasters(STATIC_MASTERS as unknown as Master[]);
      })
      .catch(() => setMasters(STATIC_MASTERS as unknown as Master[]))
      .finally(() => setLoading(false));
  }, []);

  const displayMasters = masters.length > 0 ? masters : STATIC_MASTERS;

  return (
    <div className="pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="section-title">Наші майстри</h1>
          <p className="section-subtitle">
            Команда справжніх фахівців, які постійно вдосконалюють свою майстерність
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="w-48 h-48 mx-auto rounded-full bg-gray-200 mb-4" />
                <div className="h-5 bg-gray-200 rounded w-3/4 mx-auto mb-2" />
                <div className="h-4 bg-gray-100 rounded w-1/2 mx-auto" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {displayMasters.map((master) => (
              <div key={master.id} className="group">
                {/* Photo */}
                <div className="relative w-48 h-48 mx-auto rounded-full overflow-hidden mb-5 ring-4 ring-rose-100 group-hover:ring-rose-300 transition-all duration-300 shadow-lg">
                  <Image
                    src={master.photoUrl || `https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=500&h=500&fit=crop&q=80`}
                    alt={master.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Info */}
                <div className="text-center mb-5">
                  <h3 className="font-serif text-xl font-bold text-gray-900">{master.name}</h3>
                  <p className="text-rose-600 font-medium text-sm mt-1">{master.specialty}</p>
                  {master.bio && (
                    <p className="text-gray-500 text-sm mt-3 leading-relaxed">{master.bio}</p>
                  )}
                </div>

                {/* Schedule */}
                {master.schedules && master.schedules.length > 0 && (
                  <div className="bg-gray-50 rounded-2xl p-4">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Графік роботи</p>
                    <div className="grid grid-cols-7 gap-1">
                      {DAYS_UK.map((day, i) => {
                        const schedule = master.schedules?.find((s) => s.dayOfWeek === i);
                        return (
                          <div key={day} className="text-center">
                            <div className="text-xs text-gray-400 mb-1">{day}</div>
                            <div
                              className={`w-6 h-6 rounded-full mx-auto flex items-center justify-center text-xs font-bold ${
                                schedule?.isWorking ? 'bg-rose-100 text-rose-600' : 'bg-gray-200 text-gray-400'
                              }`}
                            >
                              {schedule?.isWorking ? '✓' : '–'}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="text-center mt-16 bg-rose-50 rounded-3xl p-10">
          <h3 className="font-serif text-2xl font-bold text-gray-900 mb-3">Оберіть свого майстра</h3>
          <p className="text-gray-500 mb-6">Запишіться до конкретного фахівця або дозвольте нам підібрати вільного майстра</p>
          <Link href="/booking" className="btn-primary inline-flex items-center gap-2">
            Записатися онлайн <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
