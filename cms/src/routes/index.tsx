import { createFileRoute, Link } from '@tanstack/react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getDashboardData, deleteEvent, deleteHotel } from '../lib/api'
import { useState } from 'react'
import { ConfirmModal } from '../components/ConfirmModal'
import toast from 'react-hot-toast'

// Interface untuk Search Params
interface DashboardSearch {
  type?: 'event' | 'hotel'
}

export const Route = createFileRoute('/')({
  validateSearch: (search: Record<string, unknown>): DashboardSearch => {
    return {
      type: (search.type as 'event' | 'hotel') || 'event',
    }
  },
  component: Index,
})

function Index() {
  const { type } = Route.useSearch()
  const queryClient = useQueryClient()
  const [deleteConfig, setDeleteConfig] = useState<{ id: string, name: string, type: 'event' | 'hotel' } | null>(null)

  const { data, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: getDashboardData,
  })

  // Mutation untuk Delete
  const deleteMutation = useMutation({
    mutationFn: async ({ id, type }: { id: string, type: 'event' | 'hotel' }) => {
      return type === 'event' ? deleteEvent(id) : deleteHotel(id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      toast.success(`${deleteConfig?.type === 'event' ? 'Event' : 'Hotel'} deleted successfully`)
      setDeleteConfig(null)
    },
    onError: (error: any) => {
      toast.error('Failed to delete: ' + error.message)
    }
  })

  if (isLoading) return <div className="p-8 text-center text-gray-500">Loading your services...</div>

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 capitalize">My {type}s</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your {type} listings and details</p>
        </div>
        <Link
          to={type === 'event' ? '/events/create' : '/hotels/create'}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700"
        >
          + Add New {type === 'event' ? 'Event' : 'Hotel'}
        </Link>
      </div>

      {/* LIST CONTENT */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md border border-gray-200">
        <ul className="divide-y divide-gray-200">

          {/* RENDER EVENTS */}
          {type === 'event' && data?.raw.events.map((event) => (
            <li key={event.id} className="hover:bg-gray-50 transition-colors">
              <div className="px-4 py-4 flex items-center justify-between sm:px-6">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-orange-600 truncate">{event.name}</p>
                  <div className="mt-1 flex items-center text-xs text-gray-500 gap-3">
                    <span className="flex items-center">📅 {event.startDate}</span>
                    <span className="flex items-center">📍 {event.location}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {/* VIEW ONLY */}
                  <Link
                    to="/events/$eventId"
                    params={{ eventId: event.id }}
                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                    title="View Details"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                  </Link>

                  {/* EDIT PAGE */}
                  <Link
                    to="/events/$eventId/edit"
                    params={{ eventId: event.id }}
                    className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
                    title="Edit Event"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                  </Link>

                  {/* DELETE BUTTON */}
                  <button
                    onClick={() => setDeleteConfig({ id: event.id, name: event.name, type: 'event' })}
                    className="p-1.5 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                    title="Delete Event"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" /></svg>
                  </button>
                </div>
              </div>
            </li>
          ))}

          {/* RENDER HOTELS */}
          {type === 'hotel' && data?.raw.hotels.map((hotel) => (
            <li key={hotel.id} className="hover:bg-gray-50 transition-colors">
              <div className="px-4 py-4 flex items-center justify-between sm:px-6">
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <img src={hotel.bannerUrl} alt="" className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-blue-600 truncate">{hotel.name}</p>
                    <p className="text-xs text-gray-500">⭐ {hotel.starRating} Stars • {hotel.location}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Link
                    to="/hotels/$id/edit"
                    params={{ id: hotel.id }}
                    className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
                    title="Edit Hotel"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                  </Link>

                  {/* Delete Button Hotel */}
                  <button
                    onClick={() => setDeleteConfig({ id: hotel.id, name: hotel.name, type: 'hotel' })}
                    className="p-1.5 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" /></svg>
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>

        {/* EMPTY STATE */}
        {((type === 'event' && data?.raw.events.length === 0) || (type === 'hotel' && data?.raw.hotels.length === 0)) && (
          <div className="text-center py-12">
            <p className="text-gray-500">No {type}s available at the moment.</p>
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={!!deleteConfig}
        onClose={() => setDeleteConfig(null)}
        onConfirm={() => deleteConfig && deleteMutation.mutate({ id: deleteConfig.id, type: deleteConfig.type })}
        title={`Delete ${deleteConfig?.type === 'event' ? 'Event' : 'Hotel'}`}
        message={`Are you sure you want to delete "${deleteConfig?.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        isDestructive={true}
      />
    </div>
  )
}