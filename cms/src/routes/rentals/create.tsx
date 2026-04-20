import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createRental, type RentalFormState } from '../../lib/api'
import { RentalForm } from '../../components/RentalForm'
import toast from 'react-hot-toast'

export const Route = createFileRoute('/rentals/create')({
  component: CreateRental,
})

function CreateRental() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createRental,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      toast.success('Rental service created successfully');
      navigate({ to: '/' });
    },
    onError: (err: any) => toast.error('Failed to create rental: ' + err.message)
  });

  return (
    <RentalForm 
      title="Create New Rental Service"
      onSubmit={(data: RentalFormState) => mutation.mutate(data)}
      isSubmitting={mutation.isPending}
      submitLabel="Create Rental"
    />
  );
}
