import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getEvent, updateEvent, type Event } from '../../lib/api'
import { EventForm } from '../../components/EventForm'
import type { EventFormState } from '../../components/EventForm'
import toast from 'react-hot-toast'

export const Route = createFileRoute('/events/$eventId/edit')({
  component: EditEvent,
})

function EditEvent() {
  const { eventId } = Route.useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: event, isLoading } = useQuery({
    queryKey: ['events', eventId],
    queryFn: () => getEvent(eventId),
  });

  const mutation = useMutation({
    mutationFn: (data: EventFormState) => updateEvent(eventId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast.success('Event updated successfully');
      navigate({ to: '/' });
    },
    onError: (error) => {
      toast.error('Failed to update event: ' + error.message);
    }
  });

  const handleSubmit = (data: EventFormState) => {
    mutation.mutate(data);
  };

  if (isLoading) return <div className="text-center py-10">Loading...</div>;
  if (!event) return <div className="text-center py-10">Event not found</div>;

  // Normalize templates data from API to Form State
  const normalizeTemplates = (tpls: Event['templates'], eventData: Event) => {
    const mainBanner = eventData.bannerUrl || (eventData.bannerUrls && eventData.bannerUrls.length > 0 ? eventData.bannerUrls[0] : '');
    const defaultTpl = { id: 1, title: eventData.name || '', bannerUrl: mainBanner };

    if (!tpls) {
      return {
        index: defaultTpl,
        bookTicket: defaultTpl,
        visitorList: defaultTpl,
        visitorInput: defaultTpl
      };
    }

    // Helper to convert number/partial object to full object
    const normalizeScreen = (screenData: NonNullable<Event['templates']>['index']) => {
      if (typeof screenData === 'number') {
        return { id: screenData, title: eventData.name || '', bannerUrl: mainBanner };
      }
      return {
        id: screenData?.id || 1,
        title: screenData?.title || eventData.name || '',
        bannerUrl: screenData?.bannerUrl || mainBanner
      };
    };

    return {
      index: normalizeScreen(tpls.index),
      bookTicket: normalizeScreen(tpls.bookTicket),
      visitorList: normalizeScreen(tpls.visitorList),
      visitorInput: normalizeScreen(tpls.visitorInput),
    };
  };

  const initialData: Partial<EventFormState> = {
    ...event,
    templates: normalizeTemplates(event.templates, event),
    ticketCategories: (event.ticketCategories || []).map(cat => ({
      ...cat,
      maxPrice: cat.maxPrice || 0,
      description: cat.description || '',
      status: cat.status || 'available'
    })),
    tickets: (event.tickets || []).map(ticket => ({
      ...ticket,
      type: ticket.type || 'normal',
      normalPrice: ticket.normalPrice || 0,
      description: ticket.description || ''
    })),
    socials: {
      instagram: {
        url: event.socials?.instagram?.url || '',
        visible: event.socials?.instagram?.visible ?? true
      },
      website: {
        url: event.socials?.website?.url || '',
        visible: event.socials?.website?.visible ?? true
      }
    },
    bannerUrls: (event.bannerUrls && event.bannerUrls.length > 0) ? event.bannerUrls : (event.bannerUrl ? [event.bannerUrl] : []),
    eventType: event.eventType || 'internal',
    externalUrl: event.externalUrl || '',
    locationUrl: event.locationUrl || '',
    locationAddress: event.locationAddress || '',
    vendorConfig: {
      purchaseMode: event.vendorConfig?.purchaseMode || 'multiple'
    }
  };

  return (
    <EventForm
      key={eventId}
      initialData={initialData}
      title="Edit Event"
      onSubmit={handleSubmit}
      isSubmitting={mutation.isPending}
      submitLabel="Update Event"
    />
  );
}
