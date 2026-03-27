import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:3000/api',
});

// Add auth interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface Event {
  id: string;
  name: string;
  eventType?: 'internal' | 'external';
  externalUrl?: string;
  description?: string;
  templateId: number;
  templates?: {
    index: { id: number; title?: string; bannerUrl?: string } | number;
    bookTicket: { id: number; title?: string; bannerUrl?: string } | number;
    visitorList: { id: number; title?: string; bannerUrl?: string } | number;
    visitorInput: { id: number; title?: string; bannerUrl?: string } | number;
  };
  startDate: string;
  endDate: string;
  price: number;
  location?: string;
  locationAddress?: string;
  locationUrl?: string;
  bannerUrl?: string;
  bannerUrls?: string[];
  socials?: {
    instagram?: { url: string; visible: boolean };
    website?: { url: string; visible: boolean };
  };
  themeColor?: string;
  vendorConfig?: {
    purchaseMode?: 'single' | 'multiple';
  };
  partnerId?: string;
  billerCode?: string;
  ticketCategories?: {
    id: string;
    name: string;
    price: number;
    maxPrice?: number;
    description?: string;
    status?: string;
  }[];
  tickets?: {
    ticketId: string;
    ticketName: string;
    category: string;
    type?: 'normal' | 'b1g1' | 'discount';
    price: number;
    normalPrice?: number;
    description?: string;
    isAvailable: number;
  }[];
}

export const getEvents = async () => {
  const { data } = await api.get<{ data: Event[] }>('/events');
  return data.data;
};

export const getEvent = async (id: string) => {
  const { data } = await api.get<{ data: Event }>(`/events/${id}`);
  return data.data;
};

export const createEvent = async (event: Omit<Event, 'id' | 'createdAt' | 'updatedAt'>) => {
  const { data } = await api.post<{ data: Event }>('/events', event);
  return data.data;
};

export const updateEvent = async (id: string, event: Partial<Event>) => {
  const { data } = await api.put<{ data: Event }>(`/events/${id}`, event);
  return data.data;
};

export const deleteEvent = async (id: string) => {
  await api.delete(`/events/${id}`);
};
