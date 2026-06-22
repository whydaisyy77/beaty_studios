import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/admin';
    }
    return Promise.reject(error);
  }
);

export const servicesApi = {
  getAll: (category?: string) => api.get('/services', { params: { category } }),
  create: (data: unknown) => api.post('/services', data),
  update: (id: number, data: unknown) => api.put(`/services/${id}`, data),
  delete: (id: number) => api.delete(`/services/${id}`),
};

export const appointmentsApi = {
  create: (data: unknown) => api.post('/appointments', data),
  getAll: (params?: unknown) => api.get('/appointments', { params }),
  updateStatus: (id: number, status: string) => api.patch(`/appointments/${id}/status`, { status }),
  delete: (id: number) => api.delete(`/appointments/${id}`),
  getAvailableSlots: (date: string, masterId?: number) =>
    api.get('/appointments/available-slots', { params: { date, masterId } }),
};

export const galleryApi = {
  getAll: (category?: string) => api.get('/gallery', { params: { category } }),
  upload: (formData: FormData) =>
    api.post('/gallery', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id: number) => api.delete(`/gallery/${id}`),
  setFeatured: (id: number, isFeatured: boolean) => api.patch(`/gallery/${id}/featured`, { isFeatured }),
};

export const mastersApi = {
  getAll: () => api.get('/masters'),
  create: (formData: FormData) =>
    api.post('/masters', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  updateSchedule: (id: number, schedules: unknown) => api.put(`/masters/${id}/schedule`, { schedules }),
  delete: (id: number) => api.delete(`/masters/${id}`),
};

export const authApi = {
  login: (email: string, password: string) => api.post('/auth/login', { email, password }),
  me: () => api.get('/auth/me'),
};

export default api;
