import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { getHotel, type HotelFormState } from '../../lib/api';
import { HotelForm } from '../../components/HotelForm';

export const Route = createFileRoute('/hotels/$id/')({
  component: HotelViewPage,
});

function HotelViewPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const { data: hotel, isLoading } = useQuery({
    queryKey: ['hotels', id, 'view'],
    queryFn: () => getHotel(id),
  });

  if (isLoading) return <div className="text-center py-10">Loading...</div>;
  if (!hotel) return <div className="text-center py-10">Hotel not found</div>;

  const initialData: HotelFormState = {
    name: hotel.name || '',
    description: hotel.description || '',
    location: hotel.location || '',
    locationAddress: hotel.locationAddress || '',
    starRating: hotel.starRating || 3,
    bannerUrl: Array.isArray(hotel.bannerUrl) ? hotel.bannerUrl : (hotel.bannerUrl ? [hotel.bannerUrl] : []),
    templates: {
      index: {
        id: hotel.templates?.index?.id || 1,
        title: hotel.templates?.index?.title || '',
        bannerUrl: hotel.templates?.index?.bannerUrl || ''
      },
      hotelDetail: {
        id: hotel.templates?.hotelDetail?.id || 1,
        title: hotel.templates?.hotelDetail?.title || '',
      }
    },
    categories: (hotel.categories || []).map((cat: any) => ({
      id: cat.id,
      name: cat.name || '',
      roomType: cat.roomType || 'Standard',
      description: cat.description || '',
      pricePerNight: cat.pricePerNight || 0,
      capacity: cat.capacity || 2,
      stock: cat.stock || 0,
      bedConfig: cat.bedConfig || { type: 'Double Bed', count: 1 },
      roomAmenities: cat.roomAmenities || [],
      bathAmenities: cat.bathAmenities || [],
      images: cat.images || [''],
      isAvailable: Boolean(cat.isAvailable)
    }))
  };

  return (
    <div>
      <div className="mb-4">
        <button
          onClick={() => navigate({ to: '/' })}
          className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
        >
          ← Back to Hotels
        </button>
      </div>
      <HotelForm
        key={id}
        title="View Hotel Details"
        submitLabel=""
        initialData={initialData}
        isViewMode={true}
      />
    </div>
  );
}
