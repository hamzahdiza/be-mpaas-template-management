import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createUMKM, type UMKMFormState } from '../../lib/api'
import { UMKMForm } from '../../components/UMKMForm'
import toast from 'react-hot-toast'

export const Route = createFileRoute('/umkms/create')({
  component: CreateUMKM,
})

function CreateUMKM() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createUMKM,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      toast.success('UMKM created successfully');
      navigate({ to: '/' });
    },
    onError: (err: any) => toast.error('Failed to create UMKM: ' + err.message)
  });

  return (
    <UMKMForm 
      title="Create New UMKM"
      onSubmit={(data: UMKMFormState) => mutation.mutate(data)}
      isSubmitting={mutation.isPending}
      submitLabel="Create UMKM"
    />
  );
}
