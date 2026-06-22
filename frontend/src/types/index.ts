export interface Service {
  id: number;
  name: string;
  description?: string;
  price: number;
  duration: number;
  category: string;
  isActive: boolean;
}

export interface Master {
  id: number;
  name: string;
  specialty: string;
  bio?: string;
  photoUrl?: string;
  schedules?: Schedule[];
}

export interface Schedule {
  id: number;
  masterId: number;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isWorking: boolean;
}

export interface Appointment {
  id: number;
  userName: string;
  phone: string;
  email?: string;
  serviceId: number;
  masterId?: number;
  date: string;
  time: string;
  status: 'NEW' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  notes?: string;
  createdAt: string;
  service: Service;
  master?: Master;
}

export interface GalleryItem {
  id: number;
  imageUrl: string;
  category: string;
  title?: string;
  isFeatured: boolean;
  createdAt: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'ADMIN' | 'USER';
}

export interface BookingForm {
  userName: string;
  phone: string;
  email?: string;
  serviceId: number;
  masterId?: number;
  date: string;
  time: string;
  notes?: string;
}
