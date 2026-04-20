import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getUMKM, updateUMKM, type UMKMFormState } from '../../lib/api'
import { UMKMForm } from '../../components/UMKMForm'
import toast from 'react-hot-toast'

export const Route = createFileRoute('/umkms/$id/edit')({
  component: EditUMKM,
})

function EditUMKM() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['umkm', id],
    queryFn: () => getUMKM(id),
  });

  const mutation = useMutation({
    mutationFn: (formData: UMKMFormState) => updateUMKM(id, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['umkm', id] });
      toast.success('UMKM updated successfully');
      navigate({ to: '/' });
    },
    onError: (err: any) => toast.error('Failed to update UMKM: ' + err.message)
  });

  if (isLoading) return <div className="p-8 text-center text-gray-500">Loading UMKM data...</div>;
  if (!data) return <div className="p-8 text-center text-red-500">UMKM not found</div>;

  const initialData: UMKMFormState = {
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
    products: data.products || [],
  };

  return (
    <UMKMForm 
      title="Edit UMKM"
      initialData={initialData}
      onSubmit={(formData) => mutation.mutate(formData)}
      isSubmitting={mutation.isPending}
      submitLabel="Update UMKM"
    />
  );
}
