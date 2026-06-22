'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { Upload, Trash2, Star, StarOff, ImageIcon } from 'lucide-react';
import { galleryApi } from '@/lib/api';
import type { GalleryItem } from '@/types';

const CATEGORIES = ['Волосы', 'Ногти', 'Макияж', 'Ресницы'];

export default function AdminGalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [activeCategory, setActiveCategory] = useState('Все');
  const [uploadCategory, setUploadCategory] = useState('Волосы');
  const [uploadTitle, setUploadTitle] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const load = () => {
    galleryApi.getAll().then((r) => setItems(r.data)).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);
    formData.append('category', uploadCategory);
    if (uploadTitle) formData.append('title', uploadTitle);

    setUploading(true);
    try {
      const res = await galleryApi.upload(formData);
      setItems((prev) => [res.data, ...prev]);
      toast.success('Фото загружено');
      setUploadTitle('');
      if (fileRef.current) fileRef.current.value = '';
    } catch {
      toast.error('Ошибка загрузки');
    } finally {
      setUploading(false);
    }
  };

  const remove = async (id: number) => {
    if (!confirm('Удалить фото?')) return;
    try {
      await galleryApi.delete(id);
      setItems((prev) => prev.filter((i) => i.id !== id));
      toast.success('Удалено');
    } catch {
      toast.error('Ошибка');
    }
  };

  const toggleFeatured = async (item: GalleryItem) => {
    try {
      await galleryApi.setFeatured(item.id, !item.isFeatured);
      setItems((prev) => prev.map((i) => i.id === item.id ? { ...i, isFeatured: !i.isFeatured } : i));
    } catch {
      toast.error('Ошибка');
    }
  };

  const filtered = activeCategory === 'Все' ? items : items.filter((i) => i.category === activeCategory);

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-serif text-2xl font-bold text-gray-900">Портфолио</h1>
        <p className="text-gray-500 mt-0.5">{items.length} фотографий</p>
      </div>

      {/* Upload area */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
        <h2 className="font-semibold text-gray-900 mb-4">Загрузить фото</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="label">Категория</label>
            <select
              value={uploadCategory}
              onChange={(e) => setUploadCategory(e.target.value)}
              className="input-field"
            >
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Подпись (необязательно)</label>
            <input
              value={uploadTitle}
              onChange={(e) => setUploadTitle(e.target.value)}
              className="input-field"
              placeholder="Окрашивание балаяж"
            />
          </div>
          <div className="flex items-end">
            <label className={`w-full btn-primary flex items-center justify-center gap-2 cursor-pointer text-sm ${uploading ? 'opacity-60 cursor-not-allowed' : ''}`}>
              <Upload className="w-4 h-4" />
              {uploading ? 'Загружаем...' : 'Выбрать фото'}
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={handleUpload}
                disabled={uploading}
              />
            </label>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {['Все', ...CATEGORIES].map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              activeCategory === cat ? 'bg-rose-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-rose-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => <div key={i} className="aspect-square bg-gray-200 rounded-2xl animate-pulse" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-400 bg-white rounded-2xl border border-gray-100">
          <ImageIcon className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p>Нет фотографий</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((item) => (
            <div key={item.id} className="group relative aspect-square rounded-2xl overflow-hidden bg-gray-100">
              <Image
                src={item.imageUrl}
                alt={item.title || item.category}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-end p-3">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity w-full">
                  <div className="text-white text-xs font-medium mb-2">{item.title || item.category}</div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => toggleFeatured(item)}
                      className={`flex-1 flex items-center justify-center gap-1 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                        item.isFeatured ? 'bg-amber-500 text-white' : 'bg-white/20 text-white hover:bg-white/30'
                      }`}
                    >
                      {item.isFeatured ? <Star className="w-3.5 h-3.5 fill-white" /> : <StarOff className="w-3.5 h-3.5" />}
                      {item.isFeatured ? 'Главная' : 'В лучшие'}
                    </button>
                    <button
                      onClick={() => remove(item.id)}
                      className="p-1.5 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
              {item.isFeatured && (
                <div className="absolute top-2 left-2 bg-amber-500 text-white text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Star className="w-3 h-3 fill-white" /> Лучшее
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
