import { createFileRoute, Link } from '@tanstack/react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getDashboardData, deleteCafeRestaurant, deleteEvent, deleteHotel } from '../lib/api'
import { useEffect, useState } from 'react'
import { ConfirmModal } from '../components/ConfirmModal'
import toast from 'react-hot-toast'

// Interface untuk Search Params
interface DashboardSearch {
  type?: 'all' | 'event' | 'hotel' | 'cafe' | 'restaurant'
}

export const Route = createFileRoute('/')({
  validateSearch: (search: Record<string, unknown>): DashboardSearch => {
    return {
      type: (search.type as 'all' | 'event' | 'hotel' | 'cafe' | 'restaurant') || 'all',
    }
  },
  component: Index,
})

function Index() {
  const { type } = Route.useSearch()
  const queryClient = useQueryClient()
  const [deleteConfig, setDeleteConfig] = useState<{ id: string, name: string, type: 'event' | 'hotel' | 'cafe' | 'restaurant' } | null>(null)
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}')
  const isAdmin = currentUser?.role === 'admin'
  const effectiveType = !isAdmin && type === 'all' ? 'event' : type
  const showAll = isAdmin && effectiveType === 'all'
  const [activityPage, setActivityPage] = useState(1)
  const [eventPage, setEventPage] = useState(1)
  const [eventPageSize, setEventPageSize] = useState(5)

  const { data, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: getDashboardData,
  })

  // Mutation untuk Delete
  const deleteMutation = useMutation({
    mutationFn: async ({ id, type }: { id: string, type: 'event' | 'hotel' | 'cafe' | 'restaurant' }) => {
      if (type === 'event') return deleteEvent(id)
      if (type === 'hotel') return deleteHotel(id)
      return deleteCafeRestaurant(id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      toast.success(`${deleteConfig?.type?.toUpperCase()} deleted successfully`)
      setDeleteConfig(null)
    },
    onError: (error: any) => {
      toast.error('Failed to delete: ' + error.message)
    }
  })

  const summaryItems = data?.summary || []
  const activityPageSize = 5
  const totalActivityPages = Math.max(1, Math.ceil(summaryItems.length / activityPageSize))
  const pagedActivities = summaryItems.slice((activityPage - 1) * activityPageSize, activityPage * activityPageSize)

  const allEvents = data?.raw.events || []
  const totalEventPages = Math.max(1, Math.ceil(allEvents.length / eventPageSize))
  const pagedEvents = allEvents.slice((eventPage - 1) * eventPageSize, eventPage * eventPageSize)
  const allHotels = data?.raw.hotels || []
  const filteredCafeRestaurants = (data?.raw.cafesRestaurants || []).filter((item) => showAll ? true : item.category === effectiveType)

  useEffect(() => {
    setActivityPage(1)
  }, [summaryItems.length])

  useEffect(() => {
    setEventPage(1)
  }, [eventPageSize, allEvents.length, effectiveType])

  if (isLoading) return <div className="p-8 text-center text-gray-500">Loading your services...</div>

  return (
    <div className="p-6 mx-auto max-w-7xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 capitalize">{isAdmin ? 'Admin Dashboard' : `My ${effectiveType}s`}</h1>
          <p className="mt-1 text-sm text-gray-500">
            {isAdmin ? 'Ringkasan semua layanan dan pesanan vendor' : `Manage your ${effectiveType} listings and details`}
          </p>
        </div>
        <Link
          to={effectiveType === 'hotel' ? '/hotels/create' : (effectiveType === 'cafe' || effectiveType === 'restaurant') ? '/cafes-restaurants/create' : '/events/create'}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-orange-600 rounded-md border border-transparent shadow-sm hover:bg-orange-700"
        >
          + Add New {effectiveType === 'hotel' ? 'Hotel' : effectiveType === 'cafe' ? 'Cafe' : effectiveType === 'restaurant' ? 'Restaurant' : 'Event'}
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 mb-6 sm:grid-cols-2 xl:grid-cols-4">
        <div className="p-4 bg-white rounded-xl border border-orange-100">
          <p className="text-xs font-semibold tracking-wide text-orange-500 uppercase">Events</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">{data?.raw.events.length || 0}</p>
        </div>
        <div className="p-4 bg-white rounded-xl border border-blue-100">
          <p className="text-xs font-semibold tracking-wide text-blue-500 uppercase">Hotels</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">{data?.raw.hotels.length || 0}</p>
        </div>
        <div className="p-4 bg-white rounded-xl border border-emerald-100">
          <p className="text-xs font-semibold tracking-wide text-emerald-500 uppercase">Cafe/Restoran</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">{data?.raw.cafesRestaurants.length || 0}</p>
        </div>
        <div className="p-4 bg-white rounded-xl border border-violet-100">
          <p className="text-xs font-semibold tracking-wide text-violet-500 uppercase">Pesanan</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">{data?.raw.orders.length || 0}</p>
        </div>
      </div>

      {isAdmin && (
        <div className="p-4 mb-6 bg-white rounded-xl border border-gray-200">
          <h2 className="mb-3 text-sm font-semibold text-gray-800">Aktivitas Terbaru</h2>
          <div className="space-y-2">
            {pagedActivities.map((item) => (
              <div key={item.id} className="flex justify-between items-center text-sm">
                <p className="text-gray-700 truncate">
                  <span className="mr-2 font-semibold">{item.type}</span>
                  {item.name}
                </p>
                <span className="text-xs text-gray-500">{item.location || '-'}</span>
              </div>
            ))}
            {(!data?.summary || data.summary.length === 0) && (
              <p className="text-sm text-gray-500">Belum ada data layanan.</p>
            )}
          </div>
          {summaryItems.length > activityPageSize && (
            <div className="flex gap-2 justify-end items-center mt-4">
              <button
                onClick={() => setActivityPage((p) => Math.max(1, p - 1))}
                disabled={activityPage === 1}
                className="px-3 py-1.5 text-xs border border-gray-300 rounded-md disabled:opacity-50"
              >
                Prev
              </button>
              <span className="text-xs text-gray-500">Page {activityPage}/{totalActivityPages}</span>
              <button
                onClick={() => setActivityPage((p) => Math.min(totalActivityPages, p + 1))}
                disabled={activityPage === totalActivityPages}
                className="px-3 py-1.5 text-xs border border-gray-300 rounded-md disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}

      {/* LIST CONTENT */}
      <div className="overflow-hidden p-4 bg-white border border-gray-200 shadow sm:rounded-md">
        {(showAll || effectiveType === 'event') && (
          <div className="mb-4">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-sm font-semibold text-gray-800">All Category</h2>
              <div className="flex gap-2 items-center">
                <label className="text-xs text-gray-500">Limit</label>
                <select
                  value={eventPageSize}
                  onChange={(e) => setEventPageSize(Number(e.target.value))}
                  className="px-2 py-1 text-xs rounded-md border border-gray-300"
                >
                  {[5, 10, 25].map((limit) => (
                    <option key={limit} value={limit}>{limit}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        <ul className="divide-y divide-gray-200">

          {/* RENDER EVENTS */}
          {(showAll || effectiveType === 'event') && showAll && (
            <li className="px-4 py-3 bg-orange-50 border-orange-100 border-y">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-semibold text-orange-700">Event</h3>
                <span className="text-xs text-orange-600">{allEvents.length} items</span>
              </div>
            </li>
          )}
          {(showAll || effectiveType === 'event') && pagedEvents.map((event) => (
            <li key={event.id} className="transition-colors hover:bg-gray-50">
              <div className="flex justify-between items-center px-4 py-4 sm:px-6">
                <div className="flex flex-1 gap-4 items-center min-w-0">
                  <img src={event.bannerUrls?.[0] || event.bannerUrl || 'https://via.placeholder.com/120x120?text=Event'} alt="" className="object-cover flex-shrink-0 w-12 h-12 rounded-lg" />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-orange-600 truncate">{event.name}</p>
                    <p className="text-xs text-gray-500 truncate">📅 {event.startDate || '-'} • 📍 {event.location || '-'}</p>
                  </div>
                </div>

                <div className="flex gap-3 items-center">
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
          {(showAll || effectiveType === 'hotel') && showAll && (
            <li className="px-4 py-3 bg-blue-50 border-blue-100 border-y">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-semibold text-blue-700">Hotel</h3>
                <span className="text-xs text-blue-600">{allHotels.length} items</span>
              </div>
            </li>
          )}
          {(showAll || effectiveType === 'hotel') && allHotels.map((hotel) => (
            <li key={hotel.id} className="transition-colors hover:bg-gray-50">
              <div className="flex justify-between items-center px-4 py-4 sm:px-6">
                <div className="flex flex-1 gap-4 items-center min-w-0">
                  <img src={hotel.bannerUrl} alt="" className="object-cover flex-shrink-0 w-12 h-12 rounded-lg" />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-blue-600 truncate">{hotel.name}</p>
                    <p className="text-xs text-gray-500">⭐ {hotel.starRating} Stars • {hotel.location}</p>
                  </div>
                </div>

                <div className="flex gap-3 items-center">
                  <Link
                    to="/hotels/$id"
                    params={{ id: hotel.id }}
                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                    title="View Hotel"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                  </Link>
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

          {/* RENDER CAFE/RESTAURANT */}
          {(showAll || effectiveType === 'cafe' || effectiveType === 'restaurant') && showAll && (
            <li className="px-4 py-3 bg-emerald-50 border-emerald-100 border-y">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-semibold text-emerald-700">Cafe/Restaurant</h3>
                <span className="text-xs text-emerald-600">{filteredCafeRestaurants.length} items</span>
              </div>
            </li>
          )}
          {(showAll || effectiveType === 'cafe' || effectiveType === 'restaurant') &&
            filteredCafeRestaurants.map((item) => (
                <li key={item.id} className="transition-colors hover:bg-gray-50">
                  <div className="flex justify-between items-center px-4 py-4 sm:px-6">
                    <div className="flex flex-1 gap-4 items-center min-w-0">
                      <img src={item.bannerUrl || item.images?.[0]} alt="" className="object-cover flex-shrink-0 w-12 h-12 rounded-lg" />
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-emerald-600 truncate">{item.name}</p>
                        <p className="text-xs text-gray-500">{item.location}</p>
                      </div>
                    </div>
                    <div className="flex gap-3 items-center">
                      <Link
                        to="/cafes-restaurants/$id"
                        params={{ id: item.id }}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                        title="View"
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                      </Link>
                      <Link
                        to="/cafes-restaurants/$id/edit"
                        params={{ id: item.id }}
                        className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
                        title="Edit"
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                      </Link>
                      <button
                        onClick={() => setDeleteConfig({ id: item.id, name: item.name, type: item.category })}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" /></svg>
                      </button>
                    </div>
                  </div>
                </li>
              ))}
        </ul>

        {(showAll || effectiveType === 'event') && allEvents.length > 0 && (
          <div className="flex gap-2 justify-end items-center mt-4">
            <button
              onClick={() => setEventPage((p) => Math.max(1, p - 1))}
              disabled={eventPage === 1}
              className="px-3 py-1.5 text-xs border border-gray-300 rounded-md disabled:opacity-50"
            >
              Prev
            </button>
            <span className="text-xs text-gray-500">Page {eventPage}/{totalEventPages}</span>
            <button
              onClick={() => setEventPage((p) => Math.min(totalEventPages, p + 1))}
              disabled={eventPage === totalEventPages}
              className="px-3 py-1.5 text-xs border border-gray-300 rounded-md disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}

        {/* EMPTY STATE */}
        {((effectiveType === 'event' && data?.raw.events.length === 0) ||
          (effectiveType === 'hotel' && data?.raw.hotels.length === 0) ||
          (effectiveType === 'all' && (data?.summary.length || 0) === 0) ||
          ((effectiveType === 'cafe' || effectiveType === 'restaurant') && data?.raw.cafesRestaurants.filter((i) => i.category === effectiveType).length === 0)) && (
          <div className="py-12 text-center">
            <p className="text-gray-500">No {effectiveType} data available at the moment.</p>
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={!!deleteConfig}
        onClose={() => setDeleteConfig(null)}
        onConfirm={() => deleteConfig && deleteMutation.mutate({ id: deleteConfig.id, type: deleteConfig.type })}
        title={`Delete ${deleteConfig?.type?.toUpperCase()}`}
        message={`Are you sure you want to delete "${deleteConfig?.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        isDestructive={true}
      />
    </div>
  )
}
