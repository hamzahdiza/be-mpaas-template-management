import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createEvent } from '../../lib/api'
import { EventForm, type EventFormState } from '../../components/EventForm'
import toast from 'react-hot-toast'

export const Route = createFileRoute('/events/create')({
  component: CreateEvent,
})

function CreateEvent() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast.success('Event created successfully');
      navigate({ to: '/' });
    },
    onError: (error) => {
        toast.error('Failed to create event: ' + error.message);
    }
  });

  const handleSubmit = (data: EventFormState) => {
    mutation.mutate(data);
  };

  return (
    <EventForm 
      title="Create New Event"
      onSubmit={handleSubmit}
      isSubmitting={mutation.isPending}
      submitLabel="Create Event"
    />
  );
}
