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
      queryClient.invalidateQueries({ queryKey: ['cafes-restaurants'] });
      toast.success('Cafe/Restaurant created successfully');
      navigate({ to: '/' });
    },
    onError: (err: any) => toast.error('Failed to create: ' + err.message),
  });

  return (
    <CafeRestaurantForm
      title="Create New Cafe/Restaurant"
      submitLabel="Create Cafe/Restaurant"
      isSubmitting={mutation.isPending}
      onSubmit={(data: CafeRestaurantFormState) => mutation.mutate(data)}
    />
  );
}
