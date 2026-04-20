import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getRental, updateRental, type RentalFormState } from '../../lib/api'
import { RentalForm } from '../../components/RentalForm'
import toast from 'react-hot-toast'

export const Route = createFileRoute('/rentals/$id/edit')({
  component: EditRental,
})

function EditRental() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['rental', id],
    queryFn: () => getRental(id),
  });

  const mutation = useMutation({
    mutationFn: (formData: RentalFormState) => updateRental(id, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['rental', id] });
      toast.success('Rental updated successfully');
      navigate({ to: '/' });
    },
    onError: (err: any) => toast.error('Failed to update rental: ' + err.message)
  });

  if (isLoading) return <div className="p-8 text-center text-gray-500">Loading rental data...</div>;
  if (!data) return <div className="p-8 text-center text-red-500">Rental not found</div>;

  const initialData: RentalFormState = {
    category: data.category,
    name: data.name,
    description: data.description || '',
    location: data.location || '',
    locationAddress: data.locationAddress || '',
    locationUrl: data.locationUrl || '',
    bannerUrl: data.images || [],
    templates: {
      index: {
        id: data.templates?.index?.id || 1,
        title: data.templates?.index?.title || '',
        bannerUrl: data.templates?.index?.bannerUrl || ''
      },
      detail: {
        id: data.templates?.detail?.id || 1,
        title: data.templates?.detail?.title || '',
        bannerUrl: data.templates?.detail?.bannerUrl || ''
      }
    },
    vehicles: data.vehicles || [],
  };

  return (
    <RentalForm 
      title="Edit Rental Service"
      initialData={initialData}
      onSubmit={(formData) => mutation.mutate(formData)}
      isSubmitting={mutation.isPending}
      submitLabel="Update Rental"
    />
  );
}
