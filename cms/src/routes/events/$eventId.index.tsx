import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { getEvent, type Event } from '../../lib/api'
import { EventForm } from '../../components/EventForm'
import type { EventFormState } from '../../components/EventForm'

export const Route = createFileRoute('/events/$eventId/')({
  component: ViewEvent,
})

function ViewEvent() {
  const { eventId } = Route.useParams();
  const navigate = useNavigate();

  const { data: event, isLoading } = useQuery({
    queryKey: ['events', eventId],
    queryFn: () => getEvent(eventId),
  });

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
      vendorConfig: { // Explicitly define vendorConfig
          purchaseMode: event.vendorConfig?.purchaseMode || 'multiple'
      }
  };

  return (
    <div>
        <div className="mb-4">
            <button 
                onClick={() => navigate({ to: '/' })}
                className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
            >
                ← Back to Events
            </button>
        </div>
        <EventForm 
            key={eventId}
            title="View Event Details"
            initialData={initialData}
            isViewMode={true}
        />
    </div>
  );
}
