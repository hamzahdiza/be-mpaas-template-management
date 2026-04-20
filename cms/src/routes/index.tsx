import { createFileRoute, Link } from '@tanstack/react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getDashboardData, deleteCafeRestaurant, deleteEvent, deleteHotel, deleteRental, deleteUMKM, type ServiceOrder } from '../lib/api'
import { useEffect, useState } from 'react'
import { ConfirmModal } from '../components/ConfirmModal'
import toast from 'react-hot-toast'

// Interface untuk Search Params
interface DashboardSearch {
  type?: 'all' | 'event' | 'hotel' | 'cafe' | 'restaurant' | 'rental' | 'umkm'
}

export const Route = createFileRoute('/')({
  validateSearch: (search: Record<string, unknown>): DashboardSearch => {
    return {
      type: (search.type as 'all' | 'event' | 'hotel' | 'cafe' | 'restaurant' | 'rental' | 'umkm') || 'all',
    }
  },
  component: Index,
})

function Index() {
  const { type } = Route.useSearch()
  const queryClient = useQueryClient()
  const [deleteConfig, setDeleteConfig] = useState<{ id: string, name: string, type: 'event' | 'hotel' | 'cafe' | 'restaurant' | 'rental' | 'umkm' } | null>(null)
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}')
  const isAdmin = currentUser?.role === 'admin'
  const effectiveType = !isAdmin && type === 'all' ? 'event' : type
  const showAll = isAdmin && effectiveType === 'all'
  const [activityPage, setActivityPage] = useState(1)
  const [eventPage, setEventPage] = useState(1)
  const [eventPageSize, setEventPageSize] = useState(4)

  const { data, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: getDashboardData,
  })

  // Mutation untuk Delete
  const deleteMutation = useMutation({
    mutationFn: async ({ id, type }: { id: string, type: 'event' | 'hotel' | 'cafe' | 'restaurant' | 'rental' | 'umkm' }) => {
      if (type === 'event') return deleteEvent(id)
      if (type === 'hotel') return deleteHotel(id)
      if (type === 'rental') return deleteRental(id)
      if (type === 'umkm') return deleteUMKM(id)
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

  const rawOrders = data?.raw.orders || []
  // Filter hanya order yang sudah dibayar (completed atau accepted) untuk dashboard
  const paidOrders = rawOrders.filter(o => o.status === 'completed' || o.status === 'accepted')
  const summaryItems = isAdmin ? paidOrders : (data?.summary || [])
  const activityPageSize = 4
  const totalActivityPages = Math.max(1, Math.ceil(summaryItems.length / activityPageSize))
  const pagedActivities = summaryItems.slice((activityPage - 1) * activityPageSize, activityPage * activityPageSize)

  const allEvents = data?.raw.events || []
  const allOrders = data?.raw.orders || []
  
  // STATS CALCULATION
  const now = new Date()
  const currentMonth = now.getMonth()
  const currentYear = now.getFullYear()
  
  const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1
  const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear

  const currentMonthOrders = allOrders.filter(o => {
    const date = new Date(o.createdAt || "")
    return (o.status === 'completed' || o.status === 'accepted') && date.getMonth() === currentMonth && date.getFullYear() === currentYear
  })

  const lastMonthOrders = allOrders.filter(o => {
    const date = new Date(o.createdAt || "")
    return (o.status === 'completed' || o.status === 'accepted') && date.getMonth() === lastMonth && date.getFullYear() === lastMonthYear
  })

  const currentMonthRevenue = currentMonthOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0)
  const lastMonthRevenue = lastMonthOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0)
  
  const totalRevenue = allOrders
    .filter(o => o.status === 'completed' || o.status === 'accepted')
    .reduce((sum, o) => sum + (o.totalAmount || 0), 0)

  const revenueChange = lastMonthRevenue === 0 
    ? (currentMonthRevenue > 0 ? 100 : 0) 
    : ((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100

  // Hanya hitung order yang sudah PAID (accepted) tapi belum selesai (completed)
  const activeOrdersCount = allOrders.filter(o => o.status === 'accepted').length
  
  const topServices = allOrders.reduce((acc: Record<string, number>, curr) => {
    acc[curr.serviceName] = (acc[curr.serviceName] || 0) + 1
    return acc
  }, {})
  const topServiceName = Object.entries(topServices).sort((a, b) => b[1] - a[1])[0]?.[0] || '-'

  const totalEventPages = Math.max(1, Math.ceil(allEvents.length / eventPageSize))
  const pagedEvents = allEvents.slice((eventPage - 1) * eventPageSize, eventPage * eventPageSize)
  const allHotels = data?.raw.hotels || []
  const allRentals = data?.raw.rentals || []
  const allUmkms = data?.raw.umkms || []
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
          to={effectiveType === 'hotel' ? '/hotels/create' : (effectiveType === 'cafe' || effectiveType === 'restaurant') ? '/cafes-restaurants/create' : effectiveType === 'rental' ? '/rentals/create' : effectiveType === 'umkm' ? '/umkms/create' : '/events/create'}
          className={`inline-flex items-center px-4 py-2 text-sm font-medium text-white rounded-md border border-transparent shadow-sm ${
            effectiveType === 'hotel' ? 'bg-blue-600 hover:bg-blue-700' : 
            effectiveType === 'rental' ? 'bg-indigo-600 hover:bg-indigo-700' :
            effectiveType === 'umkm' ? 'bg-rose-600 hover:bg-rose-700' :
            (effectiveType === 'cafe' || effectiveType === 'restaurant') ? 'bg-emerald-600 hover:bg-emerald-700' :
            'bg-orange-600 hover:bg-orange-700'
          }`}
        >
          + Add New {effectiveType === 'hotel' ? 'Hotel' : effectiveType === 'cafe' ? 'Cafe' : effectiveType === 'restaurant' ? 'Restaurant' : effectiveType === 'rental' ? 'Rental' : effectiveType === 'umkm' ? 'UMKM' : 'Event'}
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 mb-6 sm:grid-cols-2 xl:grid-cols-4">
        <div className="p-5 bg-white rounded-2xl border border-orange-100 shadow-sm transition-shadow hover:shadow-md">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold tracking-wider text-orange-500 uppercase">Total Revenue</p>
              <p className="mt-2 text-2xl font-black text-gray-900">Rp {totalRevenue.toLocaleString('id-ID')}</p>
            </div>
            <div className="p-2 text-orange-600 bg-orange-50 rounded-xl">💰</div>
          </div>
          <div className="mt-3 flex items-center gap-1 text-[10px] text-gray-500">
            <span className={`${revenueChange >= 0 ? 'text-emerald-500' : 'text-rose-500'} font-bold`}>
              {revenueChange >= 0 ? '↑' : '↓'} {Math.abs(revenueChange).toFixed(1)}%
            </span> vs last month
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-blue-100 shadow-sm transition-shadow hover:shadow-md">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold tracking-wider text-blue-500 uppercase">Active Orders</p>
              <p className="mt-2 text-2xl font-black text-gray-900">{activeOrdersCount}</p>
            </div>
            <div className="p-2 text-blue-600 bg-blue-50 rounded-xl">⚡</div>
          </div>
          <p className="mt-3 text-[10px] text-gray-500">Paid & awaiting processing</p>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-emerald-100 shadow-sm transition-shadow hover:shadow-md">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold tracking-wider text-emerald-500 uppercase">Total Services</p>
              <p className="mt-2 text-2xl font-black text-gray-900">
                {(data?.raw.events.length || 0) + 
                 (data?.raw.hotels.length || 0) + 
                 (data?.raw.cafesRestaurants.length || 0) + 
                 (data?.raw.rentals.length || 0) + 
                 (data?.raw.umkms.length || 0)}
              </p>
            </div>
            <div className="p-2 text-emerald-600 bg-emerald-50 rounded-xl">🏬</div>
          </div>
          <p className="mt-3 text-[10px] text-gray-500">Active listings across platform</p>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-violet-100 shadow-sm transition-shadow hover:shadow-md">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold tracking-wider text-violet-500 uppercase">Top Performing</p>
              <p className="mt-2 text-sm font-black text-gray-900 truncate max-w-[150px]">{topServiceName}</p>
            </div>
            <div className="p-2 text-violet-600 bg-violet-50 rounded-xl">🏆</div>
          </div>
          <p className="mt-3 text-[10px] text-gray-500">Most ordered service</p>
        </div>
      </div>

      {isAdmin && (
        <div className="p-5 mb-8 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-base font-bold text-gray-900">Aktivitas Pesanan</h2>
            <Link to="/orders" className="text-xs font-bold text-orange-600 hover:text-orange-700">
              Lihat Semua →
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {(pagedActivities as ServiceOrder[]).map((item) => (
              <div key={item.id} className="flex justify-between items-center p-3 rounded-xl border border-gray-50 transition-all hover:bg-slate-50">
                <div className="flex gap-3 items-center">
                  <div className={`w-10 h-10 flex items-center justify-center rounded-lg text-lg shadow-sm ${
                    item.orderType === 'event' ? 'bg-orange-50 text-orange-600' : 
                    item.orderType === 'hotel' ? 'bg-blue-50 text-blue-600' : 
                    item.orderType === 'rental' ? 'bg-indigo-50 text-indigo-600' :
                    item.orderType === 'umkm' ? 'bg-rose-50 text-rose-600' :
                    'bg-emerald-50 text-emerald-600'
                  }`}>
                    {item.orderType === 'event' ? '🎟️' : item.orderType === 'hotel' ? '🏨' : item.orderType === 'rental' ? '🚗' : item.orderType === 'umkm' ? '🛍️' : '🍴'}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-gray-900 truncate max-w-[150px]">
                      {item.customerName}
                    </p>
                    <p className="text-[10px] text-gray-500 truncate">
                      {item.serviceName}
                    </p>
                  </div>
                </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-gray-900">Rp {item.totalAmount?.toLocaleString('id-ID')}</p>
                    <span className={`text-[10px] font-bold uppercase ${
                      item.status === 'completed' ? 'text-emerald-500' : 
                      item.status === 'accepted' ? 'text-blue-500' : 'text-amber-500'
                    }`}>
                      {item.status === 'accepted' ? 'PAID' : item.status.toUpperCase()}
                    </span>
                  </div>
              </div>
            ))}
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

          {/* RENDER RENTALS */}
          {(showAll || effectiveType === 'rental') && showAll && (
            <li className="px-4 py-3 bg-indigo-50 border-indigo-100 border-y">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-semibold text-indigo-700">Rental Mobil/Motor</h3>
                <span className="text-xs text-indigo-600">{allRentals.length} items</span>
              </div>
            </li>
          )}
          {(showAll || effectiveType === 'rental') && allRentals.map((item) => (
            <li key={item.id} className="transition-colors hover:bg-gray-50">
              <div className="flex justify-between items-center px-4 py-4 sm:px-6">
                <div className="flex flex-1 gap-4 items-center min-w-0">
                  <img src={item.bannerUrl || item.images?.[0] || 'https://via.placeholder.com/120x120?text=Rental'} alt="" className="object-cover flex-shrink-0 w-12 h-12 rounded-lg" />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-indigo-600 truncate">{item.name}</p>
                    <p className="text-xs text-gray-500 truncate">🚗 {item.category.toUpperCase()} • {item.location}</p>
                  </div>
                </div>
                <div className="flex gap-3 items-center">
                  <Link to="/rentals/$id" params={{ id: item.id }} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg></Link>
                  <Link to="/rentals/$id/edit" params={{ id: item.id }} className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg></Link>
                  <button onClick={() => setDeleteConfig({ id: item.id, name: item.name, type: 'rental' })} className="p-1.5 text-red-600 hover:bg-red-50 rounded-full transition-colors"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" /></svg></button>
                </div>
              </div>
            </li>
          ))}

          {/* RENDER UMKM */}
          {(showAll || effectiveType === 'umkm') && showAll && (
            <li className="px-4 py-3 bg-rose-50 border-rose-100 border-y">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-semibold text-rose-700">UMKM</h3>
                <span className="text-xs text-rose-600">{allUmkms.length} items</span>
              </div>
            </li>
          )}
          {(showAll || effectiveType === 'umkm') && allUmkms.map((item) => (
            <li key={item.id} className="transition-colors hover:bg-gray-50">
              <div className="flex justify-between items-center px-4 py-4 sm:px-6">
                <div className="flex flex-1 gap-4 items-center min-w-0">
                  <img src={item.bannerUrl || item.images?.[0] || 'https://via.placeholder.com/120x120?text=UMKM'} alt="" className="object-cover flex-shrink-0 w-12 h-12 rounded-lg" />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-rose-600 truncate">{item.name}</p>
                    <p className="text-xs text-gray-500 truncate">🛍️ {item.category.toUpperCase()} • {item.location}</p>
                  </div>
                </div>
                <div className="flex gap-3 items-center">
                  <Link to="/umkms/$id" params={{ id: item.id }} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg></Link>
                  <Link to="/umkms/$id/edit" params={{ id: item.id }} className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg></Link>
                  <button onClick={() => setDeleteConfig({ id: item.id, name: item.name, type: 'umkm' })} className="p-1.5 text-red-600 hover:bg-red-50 rounded-full transition-colors"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" /></svg></button>
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
          (effectiveType === 'rental' && data?.raw.rentals.length === 0) ||
          (effectiveType === 'umkm' && data?.raw.umkms.length === 0) ||
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
