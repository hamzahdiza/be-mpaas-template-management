import { createFileRoute, Link } from '@tanstack/react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getEvents, deleteEvent } from '../lib/api'
import { useState } from 'react'
import { ConfirmModal } from '../components/ConfirmModal'
import toast from 'react-hot-toast'

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  const queryClient = useQueryClient();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: events, isLoading, error } = useQuery({
    queryKey: ['events'],
    queryFn: getEvents,
  })

  const deleteMutation = useMutation({
    mutationFn: deleteEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast.success('Event deleted successfully');
      setDeleteId(null);
    },
    onError: (err) => {
        toast.error('Failed to delete event: ' + err.message);
        setDeleteId(null);
    }
  });

  if (isLoading) return <div className="text-center py-10">Loading events...</div>
  if (error) return <div className="text-center py-10 text-red-600">Error loading events</div>

  return (
    <div className="space-y-6">
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            All Events
          </h2>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul role="list" className="divide-y divide-gray-200">
          {events?.length === 0 && (
             <li className="px-4 py-12 text-center text-gray-500">
                No events found. Click "New Event" to create one.
             </li>
          )}
          {events?.map((event) => (
            <li key={event.id}>
              <div className="block hover:bg-gray-50 transition-colors duration-150">
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-orange-600 truncate">{event.name}</p>
                    <div className="ml-2 flex-shrink-0 flex">
                      <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Template {event.templateId}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex">
                      <p className="flex items-center text-sm text-gray-500">
                        Price: Rp {event.price.toLocaleString('id-ID')}
                      </p>
                      <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                        {event.startDate} - {event.endDate}
                      </p>
                    </div>
                    <div className="mt-2 flex items-center text-sm sm:mt-0 gap-3">
                       <Link 
                        to="/events/$eventId"
                        params={{ eventId: event.id }}
                        className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-full transition-colors"
                        title="View Details"
                       >
                         <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                            <circle cx="12" cy="12" r="3"></circle>
                         </svg>
                       </Link>
                       <Link 
                        to="/events/$eventId/edit"
                        params={{ eventId: event.id }}
                        className="p-1.5 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-full transition-colors"
                        title="Edit Event"
                       >
                         <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                         </svg>
                       </Link>
                       <button
                        onClick={() => setDeleteId(event.id)}
                        className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-full transition-colors"
                        title="Delete Event"
                       >
                         <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            <line x1="10" y1="11" x2="10" y2="17"></line>
                            <line x1="14" y1="11" x2="14" y2="17"></line>
                         </svg>
                       </button>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <ConfirmModal 
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => deleteId && deleteMutation.mutate(deleteId)}
        title="Delete Event"
        message="Are you sure you want to delete this event? This action cannot be undone."
        confirmLabel="Delete"
        isDestructive={true}
      />
    </div>
  )
}
