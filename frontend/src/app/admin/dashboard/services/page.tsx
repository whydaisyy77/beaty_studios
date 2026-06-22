'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Plus, Trash2, Edit2, X, Clock } from 'lucide-react';
import { servicesApi } from '@/lib/api';
import type { Service } from '@/types';

interface ServiceForm {
  name: string;
  description: string;
  price: number;
  duration: number;
  category: string;
}

const CATEGORIES = ['Волосы', 'Ногти', 'Макияж', 'Ресницы', 'Уход'];

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<ServiceForm>();

  const load = () => {
    servicesApi.getAll().then((r) => setServices(r.data)).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const openEdit = (s: Service) => {
    setEditing(s);
    setValue('name', s.name);
    setValue('description', s.description || '');
    setValue('price', s.price);
    setValue('duration', s.duration);
    setValue('category', s.category);
    setShowForm(true);
  };

  const closeForm = () => { setShowForm(false); setEditing(null); reset(); };

  const onSubmit = async (data: ServiceForm) => {
    setSaving(true);
    try {
      if (editing) {
        await servicesApi.update(editing.id, data);
        toast.success('Услуга обновлена');
      } else {
        await servicesApi.create(data);
        toast.success('Услуга добавлена');
      }
      closeForm();
      load();
    } catch {
      toast.error('Ошибка сохранения');
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: number) => {
    if (!confirm('Удалить услугу?')) return;
    try {
      await servicesApi.delete(id);
      setServices((prev) => prev.filter((s) => s.id !== id));
      toast.success('Удалено');
    } catch {
      toast.error('Ошибка');
    }
  };

  const grouped = services.reduce<Record<string, Service[]>>((acc, s) => {
    (acc[s.category] ??= []).push(s);
    return acc;
  }, {});

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-serif text-2xl font-bold text-gray-900">Услуги</h1>
          <p className="text-gray-500 mt-0.5">{services.length} услуг</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-2 text-sm">
          <Plus className="w-4 h-4" /> Добавить
        </button>
      </div>

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-semibold text-lg text-gray-900">{editing ? 'Редактировать' : 'Добавить'} услугу</h2>
              <button onClick={closeForm} className="p-1.5 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="label">Название *</label>
                <input {...register('name', { required: true })} className="input-field" placeholder="Стрижка женская" />
                {errors.name && <p className="text-red-500 text-xs mt-1">Обязательное поле</p>}
              </div>
              <div>
                <label className="label">Категория *</label>
                <select {...register('category', { required: true })} className="input-field">
                  <option value="">Выберите</option>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Цена (₽) *</label>
                  <input {...register('price', { required: true, min: 0 })} type="number" className="input-field" placeholder="1500" />
                </div>
                <div>
                  <label className="label">Длительность (мин) *</label>
                  <input {...register('duration', { required: true, min: 5 })} type="number" className="input-field" placeholder="60" />
                </div>
              </div>
              <div>
                <label className="label">Описание</label>
                <textarea {...register('description')} className="input-field resize-none" rows={3} placeholder="Краткое описание услуги..." />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={closeForm} className="btn-secondary flex-1">Отмена</button>
                <button type="submit" disabled={saving} className="btn-primary flex-1">{saving ? 'Сохраняем...' : 'Сохранить'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <div className="grid gap-3">
          {[...Array(6)].map((_, i) => <div key={i} className="h-16 bg-gray-100 rounded-2xl animate-pulse" />)}
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(grouped).map(([cat, items]) => (
            <div key={cat}>
              <h2 className="font-serif text-lg font-bold text-gray-800 mb-3 flex items-center gap-3">
                {cat} <span className="h-px flex-1 bg-gray-200" />
              </h2>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {items.map((s, i) => (
                  <div key={s.id} className={`flex items-center justify-between px-5 py-4 ${i > 0 ? 'border-t border-gray-50' : ''}`}>
                    <div>
                      <div className="font-medium text-gray-900">{s.name}</div>
                      {s.description && <div className="text-xs text-gray-400 mt-0.5 truncate max-w-xs">{s.description}</div>}
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1 text-sm text-gray-400">
                        <Clock className="w-3.5 h-3.5" /> {s.duration} мин
                      </span>
                      <span className="font-bold text-rose-600">{s.price.toLocaleString()} ₽</span>
                      <div className="flex gap-1">
                        <button onClick={() => openEdit(s)} className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => remove(s.id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
