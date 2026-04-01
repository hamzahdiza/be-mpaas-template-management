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

  const { data: dashboardData } = useQuery({
    queryKey: ['dashboard'],
    queryFn: getDashboardData,
    staleTime: 1000 * 60 * 5, // Cache selama 5 menit
  });

  const hasEvents = dashboardData?.raw.events && dashboardData.raw.events.length > 0;
  const hasHotels = dashboardData?.raw.hotels && dashboardData.raw.hotels.length > 0;

  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : { name: 'Admin User', email: 'admin@wondr.id' };
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
          <span className="flex items-center gap-2 overflow-hidden text-xl font-bold text-orange-600 whitespace-nowrap">
            <div className="flex items-center justify-center flex-shrink-0 w-8 h-8 text-lg text-white bg-orange-600 rounded-lg">W</div>
            {!isCollapsed && <span className="transition-opacity duration-300 opacity-100">Event Lifestyle</span>}
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

        <div className="flex-1 p-4 overflow-x-hidden overflow-y-auto">
          <Link
            to="/events/create"
            className={`w-full flex items-center justify-center py-2 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 shadow-sm hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 mb-6 transition-all duration-300 ${isCollapsed ? 'px-0' : 'px-4'}`}
            title="Create New Event"
          >
            <span className="text-lg leading-none mr-0.5">+</span>
            {!isCollapsed && <span className="ml-1 whitespace-nowrap">New Event</span>}
          </Link>

          <nav className="space-y-1">
            {/* Menu Events */}
            {hasEvents && (
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
            {hasHotels && (
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
          </nav>
        </div>

        <div className={`mt-auto p-4 border-t border-gray-200 ${isCollapsed ? 'flex justify-center' : ''}`}>
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="flex items-center justify-center flex-shrink-0 w-8 h-8 text-xs font-bold text-gray-600 bg-gray-200 rounded-full" title={user.name}>
              {initials}
            </div>
            {!isCollapsed && (
              <div className="flex-1 min-w-0 transition-opacity duration-300 whitespace-nowrap">
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
    </>
  )
}