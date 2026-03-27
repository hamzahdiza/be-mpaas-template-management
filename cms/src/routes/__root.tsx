import { createRootRoute, Outlet, useRouter, useLocation } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Sidebar } from '../components/Sidebar'
import { useState, useEffect } from 'react'
import { Toaster } from 'react-hot-toast'

function RootComponent() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const router = useRouter();
  const location = useLocation();
  
  const token = localStorage.getItem('token');
  const isLoginPage = location.pathname === '/login';
  const isRegisterPage = location.pathname === '/register';

  useEffect(() => {
    if (!token && !isLoginPage && !isRegisterPage) {
      router.navigate({ to: '/login' });
    }
  }, [token, isLoginPage, isRegisterPage, router]);

  if (isLoginPage || isRegisterPage) {
    return (
        <>
            <Outlet />
            <Toaster position="top-right" />
            <TanStackRouterDevtools />
            <ReactQueryDevtools />
        </>
    );
  }

  if (!token) return null; // Wait for redirect

  return (
    <>
      <div className="min-h-screen bg-gray-50 text-gray-900 font-sans flex">
        <Sidebar isCollapsed={isSidebarCollapsed} onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)} />
        <main className={`flex-1 p-8 transition-all duration-300 ${isSidebarCollapsed ? 'ml-20' : 'ml-64'}`}>
          <Outlet />
        </main>
      </div>
      <Toaster position="top-right" />
      <TanStackRouterDevtools />
      <ReactQueryDevtools />
    </>
  )
}

export const Route = createRootRoute({
  component: RootComponent,
})
