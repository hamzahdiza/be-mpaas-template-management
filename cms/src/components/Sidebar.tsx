import { Link, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getDashboardData } from '../lib/api'
import { ConfirmModal } from './ConfirmModal'

interface SidebarProps {
  isCollapsed?: boolean;
  onToggle?: () => void;
}

export function Sidebar({ isCollapsed = false, onToggle }: SidebarProps) {
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showNewModal, setShowNewModal] = useState(false);

  const { data: dashboardData } = useQuery({
    queryKey: ['dashboard'],
    queryFn: getDashboardData,
    staleTime: 1000 * 60 * 5, // Cache selama 5 menit
  });

  const hasEvents = dashboardData?.raw.events && dashboardData.raw.events.length > 0;
  const hasHotels = dashboardData?.raw.hotels && dashboardData.raw.hotels.length > 0;
  const hasCafeRestaurants = dashboardData?.raw.cafesRestaurants && dashboardData.raw.cafesRestaurants.length > 0;
  const hasRentals = dashboardData?.raw.rentals && dashboardData.raw.rentals.length > 0;
  const hasUMKMs = dashboardData?.raw.umkms && dashboardData.raw.umkms.length > 0;

  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : { name: 'Admin User', email: 'admin@wondr.id' };
  const isAdmin = user?.role === 'admin';
  const initials = user.name ? user.name.substring(0, 2).toUpperCase() : 'AD';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate({ to: '/login' });
  };

  return (
    <>
      <div className={`bg-white border-r border-gray-200 min-h-screen flex flex-col fixed left-0 top-0 bottom-0 z-30 transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'} shadow-lg`}>
        <div className={`h-16 flex items-center px-4 border-b border-gray-200 ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
          <span className="flex overflow-hidden gap-2 items-center text-xl font-bold text-orange-600 whitespace-nowrap">
            <div className="flex flex-shrink-0 justify-center items-center w-8 h-8 text-lg text-white bg-orange-600 rounded-lg">W</div>
            {!isCollapsed && <span className="opacity-100 transition-opacity duration-300">Event Lifestyle</span>}
          </span>
          <button
            onClick={onToggle}
            className={`p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 transition-transform duration-300 z-50 ${isCollapsed ? 'absolute -right-3 top-6 bg-white border border-gray-200 shadow-sm' : ''}`}
          >
            {isCollapsed ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
            )}
          </button>
        </div>

        <div className="overflow-y-auto overflow-x-hidden flex-1 p-4">
          <button
            onClick={() => setShowNewModal(true)}
            className={`w-full flex items-center justify-center py-3 border border-transparent text-sm font-black rounded-xl text-white bg-orange-600 shadow-lg shadow-orange-200 hover:bg-orange-700 focus:outline-none mb-6 transition-all active:scale-95 ${isCollapsed ? 'px-0' : 'px-4'}`}
            title="Create New Service"
          >
            <span className="text-xl leading-none mr-1.5">+</span>
            {!isCollapsed && <span className="ml-1 tracking-wider uppercase whitespace-nowrap">New Service</span>}
          </button>

          <nav className="space-y-1">
            {/* Menu Pesanan / POS */}
            <Link
              to="/orders"
              className={`group flex items-center py-2 text-sm font-black rounded-md text-rose-600 hover:bg-rose-50 ${isCollapsed ? 'justify-center px-0' : 'px-2'}`}
              activeProps={{ className: '!bg-rose-100 !text-rose-900' }}
              title="POS / Orders"
            >
              <span className={`h-6 w-6 flex items-center justify-center text-lg ${!isCollapsed && 'mr-3'}`}>🛒</span>
              {!isCollapsed && <span className="italic whitespace-nowrap">POS / Orders</span>}
            </Link>

            {isAdmin && (
              <Link
                to="/"
                search={{ type: 'all' } as any}
                className={`group flex items-center py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 ${isCollapsed ? 'justify-center px-0' : 'px-2'}`}
                activeProps={{ className: '!bg-gray-100 !text-gray-900' }}
                title="Semua Kategori"
              >
                <span className={`h-6 w-6 flex items-center justify-center ${!isCollapsed && 'mr-3'}`}>🗂️</span>
                {!isCollapsed && <span className="whitespace-nowrap">Semua Kategori</span>}
              </Link>
            )}
            {/* Menu Events */}
            {(isAdmin || hasEvents) && (
              <Link
                to="/"
                search={{ type: 'event' }} 
                className={`group flex items-center py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 ${isCollapsed ? 'justify-center px-0' : 'px-2'}`}
                activeProps={{ className: '!bg-orange-50 !text-orange-600' }}
                title="Events"
              >
                <span className={`h-6 w-6 flex items-center justify-center ${!isCollapsed && 'mr-3'}`}>
                  📅
                </span>
                {!isCollapsed && <span className="whitespace-nowrap">Events</span>}
              </Link>
            )}

            {/* Menu Hotels */}
            {(isAdmin || hasHotels) && (
              <Link
                to="/"
                search={{ type: 'hotel' }}
                className={`group flex items-center py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 ${isCollapsed ? 'justify-center px-0' : 'px-2'}`}
                activeProps={{ className: '!bg-blue-50 !text-blue-600' }}
                title="Hotels"
              >
                <span className={`h-6 w-6 flex items-center justify-center ${!isCollapsed && 'mr-3'}`}>
                  🏨
                </span>
                {!isCollapsed && <span className="whitespace-nowrap">Hotels</span>}
              </Link>
            )}

            {(isAdmin || hasCafeRestaurants) && (
              <>
                <Link
                  to="/"
                  search={{ type: 'cafe' } as any}
                  className={`group flex items-center py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 ${isCollapsed ? 'justify-center px-0' : 'px-2'}`}
                  activeProps={{ className: '!bg-emerald-50 !text-emerald-600' }}
                  title="Cafe"
                >
                  <span className={`h-6 w-6 flex items-center justify-center ${!isCollapsed && 'mr-3'}`}>☕</span>
                  {!isCollapsed && <span className="whitespace-nowrap">Cafe</span>}
                </Link>
                <Link
                  to="/"
                  search={{ type: 'restaurant' } as any}
                  className={`group flex items-center py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 ${isCollapsed ? 'justify-center px-0' : 'px-2'}`}
                  activeProps={{ className: '!bg-emerald-50 !text-emerald-600' }}
                  title="Restoran"
                >
                  <span className={`h-6 w-6 flex items-center justify-center ${!isCollapsed && 'mr-3'}`}>🍽️</span>
                  {!isCollapsed && <span className="whitespace-nowrap">Restoran</span>}
              </Link>
            </>
          )}

          {(isAdmin || hasRentals) && (
            <Link
              to="/"
              search={{ type: 'rental' } as any}
              className={`group flex items-center py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 ${isCollapsed ? 'justify-center px-0' : 'px-2'}`}
              activeProps={{ className: '!bg-indigo-50 !text-indigo-600' }}
              title="Rental Mobil/Motor"
            >
              <span className={`h-6 w-6 flex items-center justify-center ${!isCollapsed && 'mr-3'}`}>🚗</span>
              {!isCollapsed && <span className="whitespace-nowrap">Rental</span>}
            </Link>
          )}

          {(isAdmin || hasUMKMs) && (
            <Link
              to="/"
              search={{ type: 'umkm' } as any}
              className={`group flex items-center py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 ${isCollapsed ? 'justify-center px-0' : 'px-2'}`}
              activeProps={{ className: '!bg-rose-50 !text-rose-600' }}
              title="UMKM"
            >
              <span className={`h-6 w-6 flex items-center justify-center ${!isCollapsed && 'mr-3'}`}>🛍️</span>
              {!isCollapsed && <span className="whitespace-nowrap">UMKM</span>}
            </Link>
          )}
        </nav>
      </div>

        <div className={`mt-auto p-4 border-t border-gray-200 ${isCollapsed ? 'flex justify-center' : ''}`}>
          <div className="flex overflow-hidden gap-3 items-center">
            <div className="flex flex-shrink-0 justify-center items-center w-8 h-8 text-xs font-bold text-gray-600 bg-gray-200 rounded-full" title={user.name}>
              {initials}
            </div>
            {!isCollapsed && (
              <div className="flex-1 min-w-0 whitespace-nowrap transition-opacity duration-300">
                <p className="text-sm font-medium text-gray-700 truncate">{user.name}</p>
                <p className="text-xs text-gray-500 truncate">{user.email}</p>
              </div>
            )}
            {!isCollapsed && (
              <button
                onClick={() => setShowLogoutModal(true)}
                className="p-1.5 text-gray-400 hover:text-red-600 rounded-full hover:bg-red-50 transition-colors"
                title="Logout"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                  <polyline points="16 17 21 12 16 7"></polyline>
                  <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
        title="Logout Confirmation"
        message="Are you sure you want to log out of your account?"
        confirmLabel="Logout"
        isDestructive={true}
      />

      {/* New Service Category Modal */}
      {showNewModal && (
        <div className="flex fixed inset-0 z-50 justify-center items-center p-4 backdrop-blur-sm duration-200 bg-slate-900/60 animate-in fade-in">
          <div className="bg-white w-full max-w-sm rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-black tracking-tighter uppercase text-slate-900">Select Category</h3>
                <button onClick={() => setShowNewModal(false)} className="transition-colors text-slate-300 hover:text-slate-600">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
              </div>
              
              <div className="space-y-3">
                <Link
                  to="/events/create"
                  onClick={() => setShowNewModal(false)}
                  className="flex gap-4 items-center p-4 bg-orange-50 rounded-2xl border-2 border-orange-100 transition-all hover:border-orange-300 group"
                >
                  <span className="text-2xl transition-transform group-hover:scale-110">🎟️</span>
                  <div className="text-left">
                    <p className="text-sm font-black tracking-wide text-orange-700 uppercase">New Event</p>
                    <p className="text-[10px] text-orange-600/60 font-bold">Concerts, Festivals, Workshops</p>
                  </div>
                </Link>

                <Link
                  to="/hotels/create"
                  onClick={() => setShowNewModal(false)}
                  className="flex gap-4 items-center p-4 bg-blue-50 rounded-2xl border-2 border-blue-100 transition-all hover:border-blue-300 group"
                >
                  <span className="text-2xl transition-transform group-hover:scale-110">🏨</span>
                  <div className="text-left">
                    <p className="text-sm font-black tracking-wide text-blue-700 uppercase">New Hotel</p>
                    <p className="text-[10px] text-blue-600/60 font-bold">Resorts, Villas, Apartments</p>
                  </div>
                </Link>

                <Link
                  to="/cafes-restaurants/create"
                  onClick={() => setShowNewModal(false)}
                  className="flex gap-4 items-center p-4 bg-emerald-50 rounded-2xl border-2 border-emerald-100 transition-all hover:border-emerald-300 group"
                >
                  <span className="text-2xl transition-transform group-hover:scale-110">🍽️</span>
                  <div className="text-left">
                    <p className="text-sm font-black tracking-wide text-emerald-700 uppercase">New Cafe/Resto</p>
                    <p className="text-[10px] text-emerald-600/60 font-bold">Dining, Coffee, Lifestyle</p>
                  </div>
                </Link>

                <Link
                  to="/rentals/create"
                  onClick={() => setShowNewModal(false)}
                  className="flex gap-4 items-center p-4 bg-indigo-50 rounded-2xl border-2 border-indigo-100 transition-all hover:border-indigo-300 group"
                >
                  <span className="text-2xl transition-transform group-hover:scale-110">🚗</span>
                  <div className="text-left">
                    <p className="text-sm font-black tracking-wide text-indigo-700 uppercase">New Rental</p>
                    <p className="text-[10px] text-indigo-600/60 font-bold">Cars, Motors, Vehicles</p>
                  </div>
                </Link>

                <Link
                  to="/umkms/create"
                  onClick={() => setShowNewModal(false)}
                  className="flex gap-4 items-center p-4 bg-rose-50 rounded-2xl border-2 border-rose-100 transition-all hover:border-rose-300 group"
                >
                  <span className="text-2xl transition-transform group-hover:scale-110">🛍️</span>
                  <div className="text-left">
                    <p className="text-sm font-black tracking-wide text-rose-700 uppercase">New UMKM</p>
                    <p className="text-[10px] text-rose-600/60 font-bold">Local Products, Food, Crafts</p>
                  </div>
                </Link>
              </div>
            </div>
            <div className="py-4 text-center border-t bg-slate-50 border-slate-100">
              <p className="text-[10px] font-bold text-slate-300 tracking-widest uppercase">Internal Lifestyle Ecosystem</p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
