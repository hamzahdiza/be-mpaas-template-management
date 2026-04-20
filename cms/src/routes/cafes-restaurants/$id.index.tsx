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

  if (isLoading) return <div className="text-center py-10">Loading...</div>;
  if (!data) return <div className="text-center py-10">Cafe/Restaurant not found</div>;

  const initialData: CafeRestaurantFormState = {
    category: data.category || 'cafe',
    name: data.name || '',
    description: data.description || '',
    location: data.location || '',
    locationAddress: data.locationAddress || '',
    locationUrl: data.locationUrl || '',
    halalStatus: data.halalStatus || 'halal-certified',
    openTime: data.openTime || '09:00',
    closeTime: data.closeTime || '22:00',
    priceRangeMin: data.priceRangeMin || 0,
    priceRangeMax: data.priceRangeMax || 0,
    bannerUrl: Array.isArray(data.images) ? data.images : (data.images ? [data.images] : (Array.isArray(data.bannerUrl) ? data.bannerUrl : (data.bannerUrl ? [data.bannerUrl] : []))),
    amenities: data.amenities || [],
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
        bannerUrl: data.templates?.detail?.bannerUrl || '',
      },
    },
  };

  return (
    <div>
      <div className="mb-4">
        <button
          onClick={() => navigate({ to: '/' })}
          className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
        >
          ← Back to List
        </button>
      </div>
      <CafeRestaurantForm
        key={id}
        title="View Cafe/Restaurant Details"
        submitLabel=""
        initialData={initialData}
        isViewMode={true}
      />
    </div>
  );
}
