'use client';

import { useEffect, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { Trash2, RefreshCw, Phone, Filter } from 'lucide-react';
import { appointmentsApi } from '@/lib/api';
import type { Appointment } from '@/types';
import clsx from 'clsx';

const STATUSES = ['', 'NEW', 'CONFIRMED', 'CANCELLED', 'COMPLETED'];
const STATUS_LABELS: Record<string, string> = {
  '': 'Все',
  NEW: 'Новая',
  CONFIRMED: 'Подтверждена',
  CANCELLED: 'Отменена',
  COMPLETED: 'Завершена',
};
const STATUS_OPTIONS = ['NEW', 'CONFIRMED', 'CANCELLED', 'COMPLETED'];

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await appointmentsApi.getAll({ status: statusFilter || undefined, page, limit: 20 });
      setAppointments(res.data.appointments);
      setTotal(res.data.total);
    } catch {
      toast.error('Ошибка загрузки');
    } finally {
      setLoading(false);
    }
  }, [statusFilter, page]);

  useEffect(() => { load(); }, [load]);

  const changeStatus = async (id: number, status: string) => {
    try {
      await appointmentsApi.updateStatus(id, status);
      setAppointments((prev) => prev.map((a) => a.id === id ? { ...a, status: status as Appointment['status'] } : a));
      toast.success('Статус обновлён');
    } catch {
      toast.error('Ошибка обновления');
    }
  };

  const deleteAppointment = async (id: number) => {
    if (!confirm('Удалить запись?')) return;
    try {
      await appointmentsApi.delete(id);
      setAppointments((prev) => prev.filter((a) => a.id !== id));
      toast.success('Удалено');
    } catch {
      toast.error('Ошибка удаления');
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-serif text-2xl font-bold text-gray-900">Записи клиентов</h1>
          <p className="text-gray-500 mt-0.5">Всего: {total}</p>
        </div>
        <button onClick={load} className="flex items-center gap-2 text-sm text-gray-600 hover:text-rose-600 transition-colors">
          <RefreshCw className="w-4 h-4" /> Обновить
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 mb-6 flex-wrap">
        <Filter className="w-4 h-4 text-gray-400" />
        {STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => { setStatusFilter(s); setPage(1); }}
            className={clsx(
              'px-4 py-1.5 rounded-full text-sm font-medium transition-all',
              statusFilter === s ? 'bg-rose-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-rose-50'
            )}
          >
            {STATUS_LABELS[s]}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-20 bg-gray-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : appointments.length === 0 ? (
        <div className="text-center py-20 text-gray-400 bg-white rounded-2xl border border-gray-100">
          Записей не найдено
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Клиент</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Услуга</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Дата / Время</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Мастер</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Статус</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Цена</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {appointments.map((a) => (
                  <tr key={a.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-4">
                      <div className="font-medium text-gray-900">{a.userName}</div>
                      <a href={`tel:${a.phone}`} className="text-xs text-gray-400 flex items-center gap-1 hover:text-rose-600">
                        <Phone className="w-3 h-3" /> {a.phone}
                      </a>
                    </td>
                    <td className="px-4 py-4 text-gray-700">{a.service.name}</td>
                    <td className="px-4 py-4 text-gray-700">
                      <div>{a.date}</div>
                      <div className="text-gray-400 text-xs">{a.time}</div>
                    </td>
                    <td className="px-4 py-4 text-gray-500">{a.master?.name || '—'}</td>
                    <td className="px-4 py-4">
                      <select
                        value={a.status}
                        onChange={(e) => changeStatus(a.id, e.target.value)}
                        className={clsx(
                          'text-xs font-semibold px-2.5 py-1 rounded-full border-0 cursor-pointer focus:ring-2 focus:ring-rose-400',
                          a.status === 'NEW' ? 'bg-blue-100 text-blue-700' :
                          a.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' :
                          a.status === 'CANCELLED' ? 'bg-red-100 text-red-700' :
                          'bg-gray-100 text-gray-700'
                        )}
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-4 font-semibold text-gray-900">{a.service.price.toLocaleString()} ₽</td>
                    <td className="px-4 py-4">
                      <button
                        onClick={() => deleteAppointment(a.id)}
                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
