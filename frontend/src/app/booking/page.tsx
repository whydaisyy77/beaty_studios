'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Calendar, Clock, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { servicesApi, appointmentsApi, mastersApi } from '@/lib/api';
import type { Service, Master, BookingForm } from '@/types';
import { format, addDays, startOfDay, isToday, isBefore } from 'date-fns';
import { ru } from 'date-fns/locale';

const STEPS = ['Услуга', 'Дата и время', 'Мастер', 'Данные'];

export default function BookingPage() {
  const [step, setStep] = useState(0);
  const [services, setServices] = useState<Service[]>([]);
  const [masters, setMasters] = useState<Master[]>([]);
  const [slots, setSlots] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [currentWeekStart, setCurrentWeekStart] = useState(startOfDay(new Date()));
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<BookingForm>();

  const watchService = watch('serviceId');
  const watchMaster = watch('masterId');
  const watchTime = watch('time');

  useEffect(() => {
    servicesApi.getAll().then((r) => setServices(r.data)).catch(() => {});
    mastersApi.getAll().then((r) => setMasters(r.data)).catch(() => {});
  }, []);

  useEffect(() => {
    if (!selectedDate) return;
    appointmentsApi
      .getAvailableSlots(format(selectedDate, 'yyyy-MM-dd'), watchMaster ? Number(watchMaster) : undefined)
      .then((r) => setSlots(r.data))
      .catch(() => {});
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
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error || 'Ошибка записи';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const canNext = () => {
    if (step === 0) return !!watchService;
    if (step === 1) return !!selectedDate && !!watchTime;
    if (step === 2) return true;
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
          <h1 className="font-serif text-3xl font-bold text-gray-900 mb-3">Запись принята!</h1>
          <p className="text-gray-500 mb-8">
            Мы свяжемся с вами для подтверждения. Спасибо, что выбрали нас!
          </p>
          <button onClick={() => { setSuccess(false); setStep(0); }} className="btn-primary">
            Записаться ещё раз
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <h1 className="section-title">Онлайн-запись</h1>
          <p className="section-subtitle">Выберите услугу, время и оставьте контакты</p>
        </div>

        {/* Steps */}
        <div className="flex items-center justify-between mb-10">
          {STEPS.map((label, i) => (
            <div key={label} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                    i < step ? 'bg-rose-600 text-white' : i === step ? 'bg-rose-600 text-white ring-4 ring-rose-100' : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {i < step ? <CheckCircle className="w-5 h-5" /> : i + 1}
                </div>
                <span className={`text-xs mt-1.5 font-medium ${i === step ? 'text-rose-600' : 'text-gray-400'}`}>{label}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-0.5 mx-2 mb-5 ${i < step ? 'bg-rose-600' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sm:p-8">
            {/* Step 0: Service */}
            {step === 0 && (
              <div>
                <h2 className="font-serif text-xl font-bold text-gray-900 mb-6">Выберите услугу</h2>
                <div className="space-y-3">
                  {services.map((s) => (
                    <label
                      key={s.id}
                      className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                        Number(watchService) === s.id
                          ? 'border-rose-500 bg-rose-50'
                          : 'border-gray-200 hover:border-rose-200'
                      }`}
                    >
                      <input
                        type="radio"
                        value={s.id}
                        {...register('serviceId', { required: true })}
                        className="sr-only"
                      />
                      <div>
                        <div className="font-medium text-gray-900">{s.name}</div>
                        <div className="text-sm text-gray-500 flex items-center gap-2 mt-0.5">
                          <Clock className="w-3.5 h-3.5" /> {s.duration} мин
                          <span className="text-rose-500 text-xs bg-rose-50 px-2 py-0.5 rounded-full">{s.category}</span>
                        </div>
                      </div>
                      <span className="font-bold text-rose-600">{s.price.toLocaleString()} ₽</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Step 1: Date & Time */}
            {step === 1 && (
              <div>
                <h2 className="font-serif text-xl font-bold text-gray-900 mb-6">Выберите дату и время</h2>
                <div className="flex items-center justify-between mb-4">
                  <button
                    type="button"
                    onClick={() => setCurrentWeekStart((d) => addDays(d, -7))}
                    disabled={isBefore(addDays(currentWeekStart, -7), startOfDay(new Date()))}
                    className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <span className="font-medium text-gray-700 text-sm capitalize">
                    {format(currentWeekStart, 'LLLL yyyy', { locale: ru })}
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
                      <button
                        key={day.toISOString()}
                        type="button"
                        disabled={past}
                        onClick={() => { setSelectedDate(day); setValue('time', ''); }}
                        className={`flex flex-col items-center py-2.5 rounded-xl text-sm transition-all ${
                          isSelected ? 'bg-rose-600 text-white shadow-md' :
                          past ? 'opacity-30 cursor-not-allowed text-gray-400' :
                          isToday(day) ? 'bg-rose-50 text-rose-600 font-semibold' :
                          'bg-gray-50 text-gray-700 hover:bg-rose-50'
                        }`}
                      >
                        <span className="text-xs capitalize">{format(day, 'EE', { locale: ru })}</span>
                        <span className="font-bold mt-0.5">{format(day, 'd')}</span>
                      </button>
                    );
                  })}
                </div>

                {selectedDate && (
                  <div>
                    <p className="text-sm text-gray-500 mb-3 flex items-center gap-1.5">
                      <Clock className="w-4 h-4" /> Доступное время на {format(selectedDate, 'd MMMM', { locale: ru })}
                    </p>
                    {slots.length === 0 ? (
                      <p className="text-gray-400 text-center py-6 bg-gray-50 rounded-xl">Нет доступных слотов на этот день</p>
                    ) : (
                      <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                        {slots.map((slot) => (
                          <label
                            key={slot}
                            className={`text-center py-2.5 rounded-xl text-sm font-medium cursor-pointer transition-all border-2 ${
                              watchTime === slot
                                ? 'border-rose-500 bg-rose-600 text-white'
                                : 'border-gray-200 hover:border-rose-300 text-gray-700'
                            }`}
                          >
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
                <h2 className="font-serif text-xl font-bold text-gray-900 mb-2">Выберите мастера</h2>
                <p className="text-sm text-gray-500 mb-6">Необязательно — можем подобрать свободного мастера</p>
                <div className="space-y-3">
                  <label className={`flex items-center gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all ${!watchMaster ? 'border-rose-500 bg-rose-50' : 'border-gray-200'}`}>
                    <input type="radio" value="" {...register('masterId')} className="sr-only" onChange={() => setValue('masterId', undefined)} />
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-lg">✨</div>
                    <div>
                      <div className="font-medium text-gray-900">Любой свободный мастер</div>
                      <div className="text-sm text-gray-500">Мы подберём подходящего</div>
                    </div>
                  </label>
                  {masters.map((m) => (
                    <label
                      key={m.id}
                      className={`flex items-center gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                        Number(watchMaster) === m.id ? 'border-rose-500 bg-rose-50' : 'border-gray-200 hover:border-rose-200'
                      }`}
                    >
                      <input type="radio" value={m.id} {...register('masterId')} className="sr-only" />
                      <div className="w-10 h-10 bg-rose-100 rounded-full flex items-center justify-center font-bold text-rose-600">
                        {m.name[0]}
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

            {/* Step 3: Contact details */}
            {step === 3 && (
              <div>
                <h2 className="font-serif text-xl font-bold text-gray-900 mb-6">Ваши данные</h2>

                {selectedService && selectedDate && watchTime && (
                  <div className="bg-rose-50 rounded-2xl p-4 mb-6 text-sm">
                    <div className="font-semibold text-gray-900 mb-2">Ваша запись:</div>
                    <div className="space-y-1 text-gray-600">
                      <div>Услуга: <span className="font-medium text-gray-900">{selectedService.name}</span></div>
                      <div>Дата: <span className="font-medium text-gray-900">{format(selectedDate, 'd MMMM yyyy', { locale: ru })}</span></div>
                      <div>Время: <span className="font-medium text-gray-900">{watchTime}</span></div>
                      <div>Стоимость: <span className="font-bold text-rose-600">{selectedService.price.toLocaleString()} ₽</span></div>
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <label className="label">Ваше имя *</label>
                    <input
                      {...register('userName', { required: 'Введите имя', minLength: { value: 2, message: 'Минимум 2 символа' } })}
                      className="input-field"
                      placeholder="Анна Иванова"
                    />
                    {errors.userName && <p className="text-red-500 text-xs mt-1">{errors.userName.message}</p>}
                  </div>
                  <div>
                    <label className="label">Телефон *</label>
                    <input
                      {...register('phone', {
                        required: 'Введите телефон',
                        pattern: { value: /^[\+]?[0-9]{10,15}$/, message: 'Неверный формат' },
                      })}
                      className="input-field"
                      placeholder="+7 900 123-45-67"
                      type="tel"
                    />
                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                  </div>
                  <div>
                    <label className="label">Email (необязательно)</label>
                    <input
                      {...register('email', { pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Неверный email' } })}
                      className="input-field"
                      placeholder="anna@example.com"
                      type="email"
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                  </div>
                  <div>
                    <label className="label">Пожелания (необязательно)</label>
                    <textarea
                      {...register('notes')}
                      className="input-field resize-none"
                      rows={3}
                      placeholder="Особые пожелания к мастеру..."
                    />
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
              <button
                type="button"
                onClick={() => canNext() && setStep((s) => s + 1)}
                disabled={!canNext()}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
              >
                Далее <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button type="submit" disabled={submitting} className="btn-primary disabled:opacity-60 flex items-center gap-2">
                {submitting ? 'Отправляем...' : 'Записаться'}
                {!submitting && <CheckCircle className="w-4 h-4" />}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
