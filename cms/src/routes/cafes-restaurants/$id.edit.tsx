import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getCafeRestaurant, updateCafeRestaurant, type CafeRestaurantFormState } from '../../lib/api';
import { CafeRestaurantForm } from '../../components/CafeRestaurantForm';
import toast from 'react-hot-toast';

export const Route = createFileRoute('/cafes-restaurants/$id/edit')({
  component: EditCafeRestaurant,
});

function EditCafeRestaurant() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['cafes-restaurants', id],
    queryFn: () => getCafeRestaurant(id),
  });

  const mutation = useMutation({
    mutationFn: (payload: CafeRestaurantFormState) => updateCafeRestaurant(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cafes-restaurants'] });
      toast.success('Cafe/Restaurant updated successfully');
      navigate({ to: '/' });
    },
    onError: (err: any) => toast.error('Failed to update: ' + err.message),
  });

  if (isLoading) return <div className="text-center py-10">Loading...</div>;
  if (!data) return <div className="text-center py-10">Cafe/Restaurant not found</div>;

  const initialData: CafeRestaurantFormState = {
    category: data.category,
    name: data.name || '',
    description: data.description || '',
    templates: {
      index: { id: data.templates?.index?.id || 1, title: data.templates?.index?.title || '', bannerUrl: data.templates?.index?.bannerUrl || '' },
      detail: { id: data.templates?.detail?.id || 1, title: data.templates?.detail?.title || '', bannerUrl: data.templates?.detail?.bannerUrl || '' },
    },
    location: data.location || '',
    locationAddress: data.locationAddress || '',
    locationUrl: data.locationUrl || '',
    halalStatus: data.halalStatus || 'halal-certified',
    openTime: data.openTime || '09:00',
    closeTime: data.closeTime || '22:00',
    priceRangeMin: data.priceRangeMin || 0,
    priceRangeMax: data.priceRangeMax || 0,
    bannerUrl: Array.isArray(data.images) && data.images.length > 0 ? data.images : data.bannerUrl ? [data.bannerUrl] : [''],
    amenities: data.amenities || [],
    menuItems: data.menuItems && data.menuItems.length > 0 ? data.menuItems : [{ id: crypto.randomUUID(), name: '', description: '', price: 0 }],
  };

  return (
    <CafeRestaurantForm
      key={id}
      title="Edit Cafe/Restaurant"
      submitLabel="Update Cafe/Restaurant"
      isSubmitting={mutation.isPending}
      initialData={initialData}
      onSubmit={(payload) => mutation.mutate(payload)}
    />
  );
}
