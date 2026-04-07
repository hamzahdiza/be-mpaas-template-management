import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createCafeRestaurant, type CafeRestaurantFormState } from '../../lib/api';
import { CafeRestaurantForm } from '../../components/CafeRestaurantForm';
import toast from 'react-hot-toast';

export const Route = createFileRoute('/cafes-restaurants/create')({
  component: CreateCafeRestaurant,
});

function CreateCafeRestaurant() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createCafeRestaurant,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      toast.success('Cafe/Restoran berhasil dibuat');
      navigate({ to: '/', search: { type: 'cafe' } as any });
    },
    onError: (err: any) => toast.error(err.message),
  });

  return (
    <CafeRestaurantForm
      title="Buat Cafe / Restoran"
      submitLabel="Publish"
      isSubmitting={mutation.isPending}
      onSubmit={(data: CafeRestaurantFormState) => mutation.mutate(data)}
    />
  );
}
