import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { getCafeRestaurant, type CafeRestaurantFormState } from '../../lib/api';
import { CafeRestaurantForm } from '../../components/CafeRestaurantForm';

export const Route = createFileRoute('/cafes-restaurants/$id/')({
  component: CafeRestaurantViewPage,
});

function CafeRestaurantViewPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const { data, isLoading } = useQuery({
    queryKey: ['cafes-restaurants', id, 'view'],
    queryFn: () => getCafeRestaurant(id),
  });

  if (isLoading) return <div className="p-8">Memuat data cafe/restoran...</div>;
  if (!data) return <div className="p-8">Data tidak ditemukan.</div>;

  const initialData: CafeRestaurantFormState = {
    category: data.category || 'cafe',
    name: data.name || '',
    description: data.description || '',
    location: data.location || '',
    locationAddress: data.locationAddress || '',
    halalStatus: data.halalStatus || 'halal-certified',
    openTime: data.openTime || '09:00',
    closeTime: data.closeTime || '22:00',
    priceRangeMin: data.priceRangeMin || 0,
    priceRangeMax: data.priceRangeMax || 0,
    images: Array.isArray(data.images) ? data.images : (data.images ? [data.images] : []),
    bannerUrl: Array.isArray(data.bannerUrl) ? data.bannerUrl : (data.bannerUrl ? [data.bannerUrl] : []),
    menuItems: (data.menuItems || []).map((item: any) => ({
      id: item.id,
      name: item.name || '',
      description: item.description || '',
      price: item.price || 0,
      imageUrl: item.imageUrl || '',
      isAvailable: Boolean(item.isAvailable),
    })),
    templates: {
      index: {
        id: data.templates?.index?.id || 1,
        title: data.templates?.index?.title || '',
        bannerUrl: data.templates?.index?.bannerUrl || '',
      },
      detail: {
        id: data.templates?.detail?.id || 1,
        title: data.templates?.detail?.title || '',
      },
    },
  };

  return (
    <div>
      <div className="mb-4">
        <button
          onClick={() => navigate({ to: '/', search: { type: data.category || 'cafe' } as any })}
          className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
        >
          ← Back to List
        </button>
      </div>
      <CafeRestaurantForm
        title="View Cafe/Restaurant Details"
        submitLabel="View"
        initialData={initialData}
        isViewMode={true}
      />
    </div>
  );
}
