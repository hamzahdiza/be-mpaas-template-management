import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createHotel, type HotelFormState } from '../../lib/api'
import { HotelForm } from '../../components/HotelForm'
import toast from 'react-hot-toast'

export const Route = createFileRoute('/hotels/create')({
  component: CreateHotel,
})

function CreateHotel() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createHotel,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hotels'] });
      toast.success('Hotel created successfully');
      navigate({ to: '/' });
    },
    onError: (err: any) => toast.error('Failed to create hotel: ' + err.message)
  });

  return (
    <HotelForm 
      title="Create New Hotel"
      onSubmit={(data: HotelFormState) => mutation.mutate(data)}
      isSubmitting={mutation.isPending}
      submitLabel="Create Hotel"
    />
  );
}