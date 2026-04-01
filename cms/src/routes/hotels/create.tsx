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
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      toast.success('Hotel listing created!');
      navigate({ to: '/', search: { type: 'hotel' } });
    },
    onError: (err: any) => toast.error(err.message)
  });

  return (
    <HotelForm 
      title="Create New Hotel Listing"
  onSubmit={(data: HotelFormState) => mutation.mutate(data)}
      isSubmitting={mutation.isPending}
      submitLabel="Publish Hotel"
    />
  );
}