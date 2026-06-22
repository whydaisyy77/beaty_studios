'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import Image from 'next/image';
import { Calendar, CheckCircle, ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import { servicesApi, appointmentsApi, mastersApi } from '@/lib/api';
import type { Service, Master, BookingForm } from '@/types';
import { format, addDays, startOfDay, isToday, isBefore } from 'date-fns';
import { uk } from 'date-fns/locale';

const STEPS = ['Послуга', 'Дата і час', 'Майстер', 'Ваші дані'];

const CATEGORY_IMAGES: Record<string, string> = {
  'Волосся': 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=80&h=80&fit=crop&q=80',
  'Нігті': 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=80&h=80&fit=crop&q=80',
  'Макіяж': 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=80&h=80&fit=crop&q=80',
  'Вії': 'https://images.unsplash.com/photo-1583001931096-959e9a1a6223?w=80&h=80&fit=crop&q=80',
  'Догляд': 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=80&h=80&fit=crop&q=80',
  'default': 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=80&h=80&fit=crop&q=80',
};

const STATIC_SERVICES: Service[] = [
  { id: 1, name: 'Жіноча стрижка', description: 'Стрижка, укладання', price: 600, duration: 60, category: 'Волосся', isActive: true },
  { id: 2, name: 'Фарбування волосся', description: 'Повне фарбування', price: 1200, duration: 120, category: 'Волосся', isActive: true },
  { id: 3, name: 'Бальяж / Омбре', description: 'Техніка плавного переходу', price: 1800, duration: 150, category: 'Волосся', isActive: true },
  { id: 4, name: 'Манікюр гель-лак', description: 'Манікюр + гель-лак', price: 550, duration: 90, category: 'Нігті', isActive: true },
  { id: 5, name: 'Педикюр апаратний', description: 'Апаратний педикюр', price: 550, duration: 90, category: 'Нігті', isActive: true },
  { id: 6, name: 'Вечірній макіяж', description: 'Насичений вечірній макіяж', price: 1000, duration: 90, category: 'Макіяж', isActive: true },
  { id: 7, name: 'Нарощування вій (класика)', description: 'Класичне нарощування', price: 900, duration: 120, category: 'Вії', isActive: true },
];

const STATIC_MASTERS: Master[] = [
  { id: 1, name: 'Анна Козлова', specialty: 'Волосся & Фарбування', photoUrl: 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=80&h=80&fit=crop&q=80' },
  { id: 2, name: 'Марія Іванова', specialty: 'Манікюр & Педикюр', photoUrl: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=80&h=80&fit=crop&q=80' },
  { id: 3, name: 'Олена Петрова', specialty: 'Макіяж & Брови', photoUrl: 'https://images.unsplash.com/photo-1589710751893-f9a6770ad71b?w=80&h=80&fit=crop&q=80' },
];

export default function BookingPage() {
  const [step, setStep] = useState(0);
  const [services, setServices] = useState<Service[]>(STATIC_SERVICES);
  const [masters, setMasters] = useState<Master[]>(STATIC_MASTERS);
  const [slots, setSlots] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [currentWeekStart, setCurrentWeekStart] = useState(startOfDay(new Date()));
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<BookingForm>();

  const watchService = watch('serviceId');
  const watchMaster = watch('masterId');
  const watchTime = watch('time');

  useEffect(() => {
    servicesApi.getAll().then((r) => { if (r.data.length > 0) setServices(r.data); }).catch(() => {});
    mastersApi.getAll().then((r) => { if (r.data.length > 0) setMasters(r.data); }).catch(() => {});
  }, []);

  useEffect(() => {
    if (!selectedDate) return;
    appointmentsApi
      .getAvailableSlots(format(selectedDate, 'yyyy-MM-dd'), watchMaster ? Number(watchMaster) : undefined)
      .then((r) => setSlots(r.data))
      .catch(() => {
        // Fallback: показуємо стандартні слоти
        setSlots(['09:00','09:30','10:00','10:30','11:00','11:30','12:00','13:00','14:00','14:30','15:00','15:30','16:00','17:00','17:30','18:00']);
      });
  }, [selectedDate, watchMaster]);

  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(currentWeekStart, i));

  const onSubmit = async (data: BookingForm) => {
    if (!selectedDate) return;
    setSubmitting(true);
    try {
      await appointmentsApi.create({
        ...data,
        serviceId: Number(data.serviceId),
        masterId: data.masterId ? Number(data.masterId) : undefined,
        date: format(selectedDate, 'yyyy-MM-dd'),
      });
      setSuccess(true);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error || 'Помилка запису';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const canNext = () => {
    if (step === 0) return !!watchService;
    if (step === 1) return !!selectedDate && !!watchTime;
    return true;
  };

  const selectedService = services.find((s) => s.id === Number(watchService));

  if (success) {
    return (
      <div className="pt-24 pb-20">
        <div className="max-w-lg mx-auto px-4 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="font-serif text-3xl font-bold text-gray-900 mb-3">Запис прийнято!</h1>
          <p className="text-gray-500 mb-8">Ми зв&apos;яжемося з вами для підтвердження. Дякуємо, що обрали нас!</p>
          <button onClick={() => { setSuccess(false); setStep(0); }} className="btn-primary">
            Записатися ще раз
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <h1 className="section-title">Онлайн-запис</h1>
          <p className="section-subtitle">Оберіть послугу, час та залиште контакти</p>
        </div>

        {/* Steps */}
        <div className="flex items-center justify-between mb-10">
          {STEPS.map((label, i) => (
            <div key={label} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                  i < step ? 'bg-rose-600 text-white' : i === step ? 'bg-rose-600 text-white ring-4 ring-rose-100' : 'bg-gray-200 text-gray-500'
                }`}>
                  {i < step ? <CheckCircle className="w-5 h-5" /> : i + 1}
                </div>
                <span className={`text-xs mt-1.5 font-medium hidden sm:block ${i === step ? 'text-rose-600' : 'text-gray-400'}`}>{label}</span>
              </div>
              {i < STEPS.length - 1 && <div className={`flex-1 h-0.5 mx-2 mb-5 ${i < step ? 'bg-rose-600' : 'bg-gray-200'}`} />}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sm:p-8">

            {/* Step 0: Service */}
            {step === 0 && (
              <div>
                <h2 className="font-serif text-xl font-bold text-gray-900 mb-6">Оберіть послугу</h2>
                <div className="space-y-3">
                  {services.map((s) => (
                    <label
                      key={s.id}
                      className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                        Number(watchService) === s.id ? 'border-rose-500 bg-rose-50' : 'border-gray-200 hover:border-rose-200 hover:bg-gray-50'
                      }`}
                    >
                      <input type="radio" value={s.id} {...register('serviceId', { required: true })} className="sr-only" />
                      <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0">
                        <Image
                          src={CATEGORY_IMAGES[s.category] || CATEGORY_IMAGES['default']}
                          alt={s.category}
                          width={56}
                          height={56}
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-gray-900">{s.name}</div>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="flex items-center gap-1 text-xs text-gray-400">
                            <Clock className="w-3.5 h-3.5" /> {s.duration} хв
                          </span>
                          <span className="text-xs bg-rose-50 text-rose-500 px-2 py-0.5 rounded-full">{s.category}</span>
                        </div>
                      </div>
                      <span className="font-bold text-rose-600 shrink-0">{s.price.toLocaleString()} ₴</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Step 1: Date & Time */}
            {step === 1 && (
              <div>
                <h2 className="font-serif text-xl font-bold text-gray-900 mb-6">Оберіть дату і час</h2>
                <div className="flex items-center justify-between mb-4">
                  <button type="button" onClick={() => setCurrentWeekStart((d) => addDays(d, -7))}
                    disabled={isBefore(addDays(currentWeekStart, -7), startOfDay(new Date()))}
                    className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed">
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <span className="font-medium text-gray-700 text-sm capitalize">
                    {format(currentWeekStart, 'LLLL yyyy', { locale: uk })}
                  </span>
                  <button type="button" onClick={() => setCurrentWeekStart((d) => addDays(d, 7))} className="p-2 rounded-full hover:bg-gray-100">
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid grid-cols-7 gap-1.5 mb-6">
                  {weekDays.map((day) => {
                    const past = isBefore(day, startOfDay(new Date()));
                    const isSelected = selectedDate && format(day, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd');
                    return (
                      <button key={day.toISOString()} type="button" disabled={past}
                        onClick={() => { setSelectedDate(day); setValue('time', ''); }}
                        className={`flex flex-col items-center py-2.5 rounded-xl text-sm transition-all ${
                          isSelected ? 'bg-rose-600 text-white shadow-md' :
                          past ? 'opacity-30 cursor-not-allowed text-gray-400' :
                          isToday(day) ? 'bg-rose-50 text-rose-600 font-semibold' :
                          'bg-gray-50 text-gray-700 hover:bg-rose-50'
                        }`}
                      >
                        <span className="text-xs capitalize">{format(day, 'EE', { locale: uk })}</span>
                        <span className="font-bold mt-0.5">{format(day, 'd')}</span>
                      </button>
                    );
                  })}
                </div>

                {selectedDate && (
                  <div>
                    <p className="text-sm text-gray-500 mb-3 flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" /> Доступний час на {format(selectedDate, 'd MMMM', { locale: uk })}
                    </p>
                    {slots.length === 0 ? (
                      <p className="text-gray-400 text-center py-6 bg-gray-50 rounded-xl">Немає вільних слотів на цей день</p>
                    ) : (
                      <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                        {slots.map((slot) => (
                          <label key={slot} className={`text-center py-2.5 rounded-xl text-sm font-medium cursor-pointer transition-all border-2 ${
                            watchTime === slot ? 'border-rose-500 bg-rose-600 text-white' : 'border-gray-200 hover:border-rose-300 text-gray-700'
                          }`}>
                            <input type="radio" value={slot} {...register('time', { required: true })} className="sr-only" />
                            {slot}
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Master */}
            {step === 2 && (
              <div>
                <h2 className="font-serif text-xl font-bold text-gray-900 mb-2">Оберіть майстра</h2>
                <p className="text-sm text-gray-500 mb-6">Необов&apos;язково — можемо підібрати вільного майстра</p>
                <div className="space-y-3">
                  <label className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${!watchMaster ? 'border-rose-500 bg-rose-50' : 'border-gray-200'}`}>
                    <input type="radio" value="" {...register('masterId')} className="sr-only" onChange={() => setValue('masterId', undefined)} />
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-xl">✨</div>
                    <div>
                      <div className="font-medium text-gray-900">Будь-який вільний майстер</div>
                      <div className="text-sm text-gray-500">Ми підберемо відповідного</div>
                    </div>
                  </label>
                  {masters.map((m) => (
                    <label key={m.id} className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                      Number(watchMaster) === m.id ? 'border-rose-500 bg-rose-50' : 'border-gray-200 hover:border-rose-200'
                    }`}>
                      <input type="radio" value={m.id} {...register('masterId')} className="sr-only" />
                      <div className="w-12 h-12 rounded-full overflow-hidden shrink-0">
                        {m.photoUrl ? (
                          <Image src={m.photoUrl} alt={m.name} width={48} height={48} className="object-cover w-full h-full" />
                        ) : (
                          <div className="w-full h-full bg-rose-100 flex items-center justify-center font-bold text-rose-600">{m.name[0]}</div>
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{m.name}</div>
                        <div className="text-sm text-gray-500">{m.specialty}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Contact */}
            {step === 3 && (
              <div>
                <h2 className="font-serif text-xl font-bold text-gray-900 mb-6">Ваші дані</h2>

                {selectedService && selectedDate && watchTime && (
                  <div className="bg-rose-50 rounded-2xl p-4 mb-6 text-sm">
                    <div className="font-semibold text-gray-900 mb-2">Ваш запис:</div>
                    <div className="space-y-1 text-gray-600">
                      <div>Послуга: <span className="font-medium text-gray-900">{selectedService.name}</span></div>
                      <div>Дата: <span className="font-medium text-gray-900">{format(selectedDate, 'd MMMM yyyy', { locale: uk })}</span></div>
                      <div>Час: <span className="font-medium text-gray-900">{watchTime}</span></div>
                      <div>Вартість: <span className="font-bold text-rose-600">{selectedService.price.toLocaleString()} ₴</span></div>
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <label className="label">Ваше ім&apos;я *</label>
                    <input {...register('userName', { required: "Введіть ім'я", minLength: { value: 2, message: 'Мінімум 2 символи' } })}
                      className="input-field" placeholder="Анна Іваненко" />
                    {errors.userName && <p className="text-red-500 text-xs mt-1">{errors.userName.message}</p>}
                  </div>
                  <div>
                    <label className="label">Телефон *</label>
                    <input {...register('phone', { required: 'Введіть телефон', pattern: { value: /^[\+]?[0-9]{10,15}$/, message: 'Невірний формат' } })}
                      className="input-field" placeholder="+38 067 123-45-67" type="tel" />
                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                  </div>
                  <div>
                    <label className="label">Email (необов&apos;язково)</label>
                    <input {...register('email', { pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Невірний email' } })}
                      className="input-field" placeholder="anna@example.com" type="email" />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                  </div>
                  <div>
                    <label className="label">Побажання (необов&apos;язково)</label>
                    <textarea {...register('notes')} className="input-field resize-none" rows={3}
                      placeholder="Особливі побажання до майстра..." />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex justify-between mt-6">
            {step > 0 ? (
              <button type="button" onClick={() => setStep((s) => s - 1)} className="btn-ghost flex items-center gap-1">
                <ChevronLeft className="w-4 h-4" /> Назад
              </button>
            ) : <div />}

            {step < STEPS.length - 1 ? (
              <button type="button" onClick={() => canNext() && setStep((s) => s + 1)}
                disabled={!canNext()}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1">
                Далі <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button type="submit" disabled={submitting} className="btn-primary disabled:opacity-60 flex items-center gap-2">
                {submitting ? 'Відправляємо...' : 'Записатися'}
                {!submitting && <CheckCircle className="w-4 h-4" />}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
