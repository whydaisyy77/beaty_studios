'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';
import { galleryApi } from '@/lib/api';
import type { GalleryItem } from '@/types';

const CATEGORIES = ['Всі', 'Волосся', 'Нігті', 'Макіяж', 'Вії'];

const STATIC_GALLERY: GalleryItem[] = [
  { id: 1, imageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=700&h=700&fit=crop&q=80', category: 'Волосся', title: 'Стрижка та укладання', isFeatured: true, createdAt: '' },
  { id: 2, imageUrl: 'https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=700&h=700&fit=crop&q=80', category: 'Волосся', title: 'Фарбування бальяж', isFeatured: true, createdAt: '' },
  { id: 3, imageUrl: 'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=700&h=700&fit=crop&q=80', category: 'Волосся', title: 'Омбре', isFeatured: false, createdAt: '' },
  { id: 4, imageUrl: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=700&h=700&fit=crop&q=80', category: 'Нігті', title: 'Манікюр гель-лак', isFeatured: true, createdAt: '' },
  { id: 5, imageUrl: 'https://images.unsplash.com/photo-1610992015732-2449b76344bc?w=700&h=700&fit=crop&q=80', category: 'Нігті', title: 'Nail-арт', isFeatured: true, createdAt: '' },
  { id: 6, imageUrl: 'https://images.unsplash.com/photo-1604655999025-9bd9dd823d27?w=700&h=700&fit=crop&q=80', category: 'Нігті', title: 'Педикюр', isFeatured: false, createdAt: '' },
  { id: 7, imageUrl: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=700&h=700&fit=crop&q=80', category: 'Макіяж', title: 'Вечірній макіяж', isFeatured: true, createdAt: '' },
  { id: 8, imageUrl: 'https://images.unsplash.com/photo-1526045612212-70caf35c14df?w=700&h=700&fit=crop&q=80', category: 'Макіяж', title: 'Денний макіяж', isFeatured: false, createdAt: '' },
  { id: 9, imageUrl: 'https://images.unsplash.com/photo-1583001931096-959e9a1a6223?w=700&h=700&fit=crop&q=80', category: 'Вії', title: 'Нарощування вій', isFeatured: true, createdAt: '' },
  { id: 10, imageUrl: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=700&h=700&fit=crop&q=80', category: 'Волосся', title: 'Укладання', isFeatured: false, createdAt: '' },
  { id: 11, imageUrl: 'https://images.unsplash.com/photo-1519415943484-9fa1873496d4?w=700&h=700&fit=crop&q=80', category: 'Нігті', title: 'Французький манікюр', isFeatured: false, createdAt: '' },
  { id: 12, imageUrl: 'https://images.unsplash.com/photo-1522337361532-cfe79718f0ba?w=700&h=700&fit=crop&q=80', category: 'Волосся', title: 'Кератинове випрямлення', isFeatured: false, createdAt: '' },
];

export default function PortfolioPage() {
  const [items, setItems] = useState<GalleryItem[]>(STATIC_GALLERY);
  const [active, setActive] = useState('Всі');
  const [selected, setSelected] = useState<GalleryItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    galleryApi.getAll()
      .then((res) => {
        if (res.data.length > 0) setItems(res.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setSelected(null);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const filtered = active === 'Всі' ? items : items.filter((i) => i.category === active);

  return (
    <div className="pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="section-title">Портфоліо</h1>
          <p className="section-subtitle">Наші найкращі роботи — дивіться та надихайтеся</p>
        </div>

        <div className="flex flex-wrap gap-2 justify-center mb-10">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                active === cat ? 'bg-rose-600 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-rose-50 hover:text-rose-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="aspect-square rounded-2xl bg-gray-200 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map((item) => (
              <button
                key={item.id}
                onClick={() => setSelected(item)}
                className="aspect-square rounded-2xl overflow-hidden group relative focus:outline-none focus:ring-2 focus:ring-rose-400"
              >
                <Image
                  src={item.imageUrl}
                  alt={item.title || item.category}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-end p-3">
                  <span className="text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity text-left">
                    {item.title || item.category}
                  </span>
                </div>
                {item.isFeatured && (
                  <span className="absolute top-2 left-2 bg-rose-600 text-white text-xs px-2 py-0.5 rounded-full">Топ</span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {selected && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <button
            className="absolute top-4 right-4 text-white w-10 h-10 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-colors"
            onClick={() => setSelected(null)}
          >
            <X className="w-5 h-5" />
          </button>
          <div
            className="relative max-w-3xl w-full max-h-[85vh] rounded-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={selected.imageUrl}
              alt={selected.title || selected.category}
              width={900}
              height={900}
              className="object-contain w-full max-h-[85vh]"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 p-4">
              <p className="text-white font-medium">{selected.title || selected.category}</p>
              <p className="text-white/70 text-sm">{selected.category}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
