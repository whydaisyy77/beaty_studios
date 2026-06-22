'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Plus, Trash2, X, Calendar } from 'lucide-react';
import { mastersApi } from '@/lib/api';
import type { Master, Schedule } from '@/types';

const DAYS = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];

interface MasterForm {
  name: string;
  specialty: string;
  bio: string;
}

export default function AdminMastersPage() {
  const [masters, setMasters] = useState<Master[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [scheduleModal, setScheduleModal] = useState<Master | null>(null);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<MasterForm>();

  const load = () => {
    mastersApi.getAll().then((r) => setMasters(r.data)).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const openSchedule = (master: Master) => {
    setScheduleModal(master);
    const existing = master.schedules || [];
    const full = Array.from({ length: 7 }, (_, day) => {
      const found = existing.find((s) => s.dayOfWeek === day);
      return found || { id: 0, masterId: master.id, dayOfWeek: day, startTime: '09:00', endTime: '19:00', isWorking: day !== 0 };
    });
    setSchedules(full);
  };

  const saveSchedule = async () => {
    if (!scheduleModal) return;
    setSaving(true);
    try {
      await mastersApi.updateSchedule(scheduleModal.id, schedules);
      toast.success('Расписание сохранено');
      setScheduleModal(null);
      load();
    } catch {
      toast.error('Ошибка сохранения');
    } finally {
      setSaving(false);
    }
  };

  const onSubmit = async (data: MasterForm) => {
    setSaving(true);
    const formData = new FormData();
    Object.entries(data).forEach(([k, v]) => formData.append(k, v));
    try {
      await mastersApi.create(formData);
      toast.success('Мастер добавлен');
      reset();
      setShowForm(false);
      load();
    } catch {
      toast.error('Ошибка');
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: number) => {
    if (!confirm('Удалить мастера?')) return;
    try {
      await mastersApi.delete(id);
      setMasters((prev) => prev.filter((m) => m.id !== id));
      toast.success('Удалено');
    } catch {
      toast.error('Ошибка');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-serif text-2xl font-bold text-gray-900">Мастера</h1>
          <p className="text-gray-500 mt-0.5">{masters.length} мастеров</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-2 text-sm">
          <Plus className="w-4 h-4" /> Добавить мастера
        </button>
      </div>

      {/* Add Master Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-semibold text-lg">Добавить мастера</h2>
              <button onClick={() => setShowForm(false)} className="p-1.5 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="label">Имя *</label>
                <input {...register('name', { required: true })} className="input-field" placeholder="Анна Иванова" />
              </div>
              <div>
                <label className="label">Специализация *</label>
                <input {...register('specialty', { required: true })} className="input-field" placeholder="Волосы / Ногти / Макияж" />
              </div>
              <div>
                <label className="label">О мастере</label>
                <textarea {...register('bio')} className="input-field resize-none" rows={3} placeholder="Опыт, достижения..." />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="btn-secondary flex-1">Отмена</button>
                <button type="submit" disabled={saving} className="btn-primary flex-1">{saving ? 'Сохраняем...' : 'Добавить'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Schedule Modal */}
      {scheduleModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-semibold text-lg">Расписание — {scheduleModal.name}</h2>
              <button onClick={() => setScheduleModal(null)} className="p-1.5 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3">
              {schedules.map((s, i) => (
                <div key={s.dayOfWeek} className="flex items-center gap-3">
                  <div className="w-8 text-sm font-medium text-gray-500">{DAYS[s.dayOfWeek]}</div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={s.isWorking}
                      onChange={(e) => {
                        const updated = [...schedules];
                        updated[i] = { ...updated[i], isWorking: e.target.checked };
                        setSchedules(updated);
                      }}
                      className="w-4 h-4 accent-rose-600"
                    />
                    <span className="text-sm text-gray-600">Рабочий</span>
                  </label>
                  {s.isWorking && (
                    <>
                      <input
                        type="time"
                        value={s.startTime}
                        onChange={(e) => { const u = [...schedules]; u[i] = { ...u[i], startTime: e.target.value }; setSchedules(u); }}
                        className="input-field py-1.5 text-sm flex-1"
                      />
                      <span className="text-gray-400">—</span>
                      <input
                        type="time"
                        value={s.endTime}
                        onChange={(e) => { const u = [...schedules]; u[i] = { ...u[i], endTime: e.target.value }; setSchedules(u); }}
                        className="input-field py-1.5 text-sm flex-1"
                      />
                    </>
                  )}
                  {!s.isWorking && <span className="text-sm text-gray-400 italic">Выходной</span>}
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setScheduleModal(null)} className="btn-secondary flex-1">Отмена</button>
              <button onClick={saveSchedule} disabled={saving} className="btn-primary flex-1">{saving ? 'Сохраняем...' : 'Сохранить'}</button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="grid gap-4">
          {[...Array(3)].map((_, i) => <div key={i} className="h-24 bg-gray-100 rounded-2xl animate-pulse" />)}
        </div>
      ) : masters.length === 0 ? (
        <div className="text-center py-20 text-gray-400 bg-white rounded-2xl border border-gray-100">
          Мастера ещё не добавлены
        </div>
      ) : (
        <div className="grid gap-4">
          {masters.map((master) => (
            <div key={master.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
              <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center font-bold text-rose-600 text-lg shrink-0">
                {master.name[0]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-gray-900">{master.name}</div>
                <div className="text-sm text-rose-600">{master.specialty}</div>
                {master.bio && <div className="text-xs text-gray-400 mt-0.5 truncate">{master.bio}</div>}
              </div>
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => openSchedule(master)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 bg-gray-100 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-colors"
                >
                  <Calendar className="w-4 h-4" /> Расписание
                </button>
                <button
                  onClick={() => remove(master.id)}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
