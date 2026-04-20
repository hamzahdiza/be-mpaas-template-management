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
export interface Hotel {
  categories: never[];
  id: string;
  name: string;
  description: string;
  templates: {
    index: {
      id: number;
      title?: string;
      bannerUrl?: string
    };
    hotelDetail: {
      id: number;
      title?: string
    };
  };
  location: string;
  locationAddress: string;
  locationUrl: string | null;
  starRating: number;
  bannerUrl: string;
  images: string[] | null;
  amenities: string[] | null;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

// Interface untuk response Dashboard sesuai data allData.json
export interface DashboardData {
  summary: {
    id: string;
    name: string;
    type: 'HOTEL' | 'EVENT' | 'CAFE' | 'RESTAURANT' | 'RENTAL' | 'UMKM';
    createdAt: string;
    status: string;
    location: string;
  }[];
  raw: {
    events: Event[];
    hotels: Hotel[];
    cafesRestaurants: CafeRestaurant[];
    rentals: Rental[];
    umkms: UMKM[];
    orders: ServiceOrder[];
  }
}

export const getDashboardData = async () => {
  const { data } = await api.get<{ data: DashboardData }>('/dashboard/all-services');
  return data.data;
};
export const deleteHotel = async (id: string) => {
  await api.delete(`/hotels/${id}`);
};

export interface RoomCategory {
  id: string;
  name: string;
  roomType: string;
  description: string;
  pricePerNight: number;
  capacity: number;
  stock: number;
  bedConfig: { type: string; count: number };
  roomAmenities: string[];
  bathAmenities: string[];
  images: string[];
}

export interface HotelFormState {
  name: string;
  description: string;
  location: string;
  locationAddress: string;
  starRating: number;
  bannerUrl: string[];
  templates: {
    index: { id: number; title: string; bannerUrl: string };
    hotelDetail: { id: number; title: string };
  };
  categories: RoomCategory[];
}

export const createHotel = async (hotelData: HotelFormState) => {
  console.log(hotelData, "<<< HOTEL DATA");
  
  const { data } = await api.post('/hotels', hotelData);
  console.log(data, "<<< DATA");
  
  return data;
};

export const getHotel = async (id: string) => {
  const { data } = await api.get<{ data: Hotel }>(`/hotels/${id}`);
  return data.data;
};

export const updateHotel = async (id: string, hotelData: Partial<HotelFormState>) => {
  const { data } = await api.put(`/hotels/${id}`, hotelData);
  return data.data;
};

export interface CafeMenuItem {
  id?: string;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  isAvailable?: boolean;
}

export interface CafeRestaurant {
  id: string;
  category: 'cafe' | 'restaurant';
  name: string;
  description?: string;
  templates: {
    index: { id: number; title?: string; bannerUrl?: string };
    detail: { id: number; title?: string; bannerUrl?: string };
  };
  location?: string;
  locationAddress?: string;
  locationUrl?: string;
  halalStatus?: 'halal-certified' | 'muslim-friendly' | 'non-halal';
  openTime?: string;
  closeTime?: string;
  priceRangeMin?: number;
  priceRangeMax?: number;
  bannerUrl?: string;
  images?: string[] | null;
  amenities?: string[] | null;
  menuItems?: CafeMenuItem[] | null;
  userId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CafeRestaurantFormState {
  category: 'cafe' | 'restaurant';
  name: string;
  description: string;
  templates: {
    index: { id: number; title: string; bannerUrl: string };
    detail: { id: number; title: string; bannerUrl: string };
  };
  location: string;
  locationAddress: string;
  locationUrl: string;
  halalStatus: 'halal-certified' | 'muslim-friendly' | 'non-halal';
  openTime: string;
  closeTime: string;
  priceRangeMin: number;
  priceRangeMax: number;
  bannerUrl: string[];
  amenities: string[];
  menuItems: CafeMenuItem[];
}

export interface ServiceOrder {
  id: string;
  orderType: 'event' | 'hotel' | 'cafe' | 'restaurant' | 'rental' | 'umkm';
  serviceId: string;
  serviceName: string;
  vendorUserId?: string;
  customerName: string;
  customerPhone?: string;
  notes?: string;
  quantity: number;
  totalAmount: number;
  status: 'pending' | 'accepted' | 'rejected' | 'completed' | 'preparing' | 'ready' | 'ready_to_pick' | 'searching_driver' | 'driver_found' | 'delivering';
  paymentMethod?: string;
  invoiceNumber?: string;
  completedAt?: string;
  orderPayload?: Record<string, any>;
  createdAt?: string;
  updatedAt?: string;
}

// Rental Types
export interface Vehicle {
  id?: string;
  name: string;
  type: string;
  transmission: 'manual' | 'automatic';
  capacity: number;
  pricePerDay: number;
  imageUrl?: string;
  isAvailable?: boolean;
}

export interface Rental {
  id: string;
  category: 'car' | 'motor';
  name: string;
  description?: string;
  templates: {
    index: { id: number; title?: string; bannerUrl?: string };
    detail: { id: number; title?: string; bannerUrl?: string };
  };
  location?: string;
  locationAddress?: string;
  locationUrl?: string;
  bannerUrl?: string;
  images?: string[] | null;
  vehicles?: Vehicle[] | null;
  userId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface RentalFormState {
  category: 'car' | 'motor';
  name: string;
  description: string;
  templates: {
    index: { id: number; title: string; bannerUrl: string };
    detail: { id: number; title: string; bannerUrl: string };
  };
  location: string;
  locationAddress: string;
  locationUrl: string;
  bannerUrl: string[];
  vehicles: Vehicle[];
}

// UMKM Types
export interface Product {
  id?: string;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  isAvailable?: boolean;
  stock?: number;
}

export interface UMKM {
  id: string;
  category: 'product' | 'food' | 'service';
  name: string;
  description?: string;
  templates: {
    index: { id: number; title?: string; bannerUrl?: string };
    detail: { id: number; title?: string; bannerUrl?: string };
  };
  location?: string;
  locationAddress?: string;
  locationUrl?: string;
  bannerUrl?: string;
  images?: string[] | null;
  products?: Product[] | null;
  userId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UMKMFormState {
  category: 'product' | 'food' | 'service';
  name: string;
  description: string;
  templates: {
    index: { id: number; title: string; bannerUrl: string };
    detail: { id: number; title: string; bannerUrl: string };
  };
  location: string;
  locationAddress: string;
  locationUrl: string;
  bannerUrl: string[];
  products: Product[];
}

// Rental API
export const getRentals = async (category?: string) => {
  const { data } = await api.get<{ data: Rental[] }>('/rentals', { params: { category } });
  return data.data;
};

export const getRental = async (id: string) => {
  const { data } = await api.get<{ data: Rental }>(`/rentals/${id}`);
  return data.data;
};

export const createRental = async (rentalData: RentalFormState) => {
  const { data } = await api.post('/rentals', rentalData);
  return data;
};

export const updateRental = async (id: string, rentalData: Partial<RentalFormState>) => {
  const { data } = await api.put(`/rentals/${id}`, rentalData);
  return data.data;
};

export const deleteRental = async (id: string) => {
  await api.delete(`/rentals/${id}`);
};

// UMKM API
export const getUMKMs = async (category?: string) => {
  const { data } = await api.get<{ data: UMKM[] }>('/umkms', { params: { category } });
  return data.data;
};

export const getUMKM = async (id: string) => {
  const { data } = await api.get<{ data: UMKM }>(`/umkms/${id}`);
  return data.data;
};

export const createUMKM = async (umkmData: UMKMFormState) => {
  const { data } = await api.post('/umkms', umkmData);
  return data;
};

export const updateUMKM = async (id: string, umkmData: Partial<UMKMFormState>) => {
  const { data } = await api.put(`/umkms/${id}`, umkmData);
  return data.data;
};

export const deleteUMKM = async (id: string) => {
  await api.delete(`/umkms/${id}`);
};

export const checkoutOrder = async (id: string, paymentMethod: string) => {
  const { data } = await api.post(`/orders/${id}/checkout`, { paymentMethod });
  return data.data;
};

export const getCafesRestaurants = async (category?: 'cafe' | 'restaurant') => {
  const endpoint = category ? `/cafes-restaurants?category=${category}` : '/cafes-restaurants';
  const { data } = await api.get<{ data: CafeRestaurant[] }>(endpoint);
  return data.data;
};

export const getCafeRestaurant = async (id: string) => {
  const { data } = await api.get<{ data: CafeRestaurant }>(`/cafes-restaurants/${id}`);
  return data.data;
};

export const createCafeRestaurant = async (payload: CafeRestaurantFormState) => {
  const { data } = await api.post('/cafes-restaurants', payload);
  return data;
};

export const updateCafeRestaurant = async (id: string, payload: Partial<CafeRestaurantFormState>) => {
  const { data } = await api.put(`/cafes-restaurants/${id}`, payload);
  return data;
};

export const deleteCafeRestaurant = async (id: string) => {
  await api.delete(`/cafes-restaurants/${id}`);
};

export const getVendorOrders = async () => {
  const { data } = await api.get<{ data: ServiceOrder[] }>('/orders');
  return data.data;
};

export const updateVendorOrderStatus = async (id: string, status: ServiceOrder['status']) => {
  const { data } = await api.patch(`/orders/${id}/status`, { status });
  return data.data;
};
