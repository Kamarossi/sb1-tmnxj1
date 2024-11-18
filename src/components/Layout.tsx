import { Outlet, Link, useLocation } from 'react-router-dom';
import { 
  Package, Users, Truck, ClipboardList, MapPin, 
  BarChart2, LogOut, Menu, X, User, Building2
} from 'lucide-react';
import { getCurrentUser, removeToken } from '../lib/auth';
import { useState } from 'react';

export const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();
  const user = getCurrentUser();

  const navigation = [
    { name: 'Products', href: '/products', icon: Package },
    { name: 'Customers', href: '/customers', icon: Building2 },
    { name: 'Users', href: '/users', icon: Users, roles: ['MANAGER'] },
    { name: 'Fleet', href: '/fleet', icon: Truck, roles: ['OPERATIONS', 'MANAGER'] },
    { name: 'Operations', href: '/operations', icon: ClipboardList, roles: ['OPERATIONS', 'MANAGER'] },
    { name: 'Deliveries', href: '/deliveries', icon: Package },
    { name: 'Route Planning', href: '/route-planning', icon: MapPin, roles: ['OPERATIONS', 'MANAGER'] },
    { name: 'Reports', href: '/reports', icon: BarChart2 },
  ];

  const handleLogout = () => {
    removeToken();
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0`}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between px-4 h-16 border-b">
            <h1 className="text-xl font-bold text-gray-800">Logistics Hub</h1>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden p-2 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              if (item.roles && !item.roles.includes(user?.role || '')) {
                return null;
              }

              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                    isActive
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t">
            <div className="flex items-center">
              <User className="h-8 w-8 text-gray-400" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">{user?.name}</p>
                <p className="text-xs text-gray-500">{user?.role}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="mt-4 flex items-center w-full px-4 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900"
            >
              <LogOut className="mr-3 h-5 w-5" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsSidebarOpen(true)}
          className={`p-2 rounded-md text-gray-500 hover:text-gray-600 hover:bg-white ${
            isSidebarOpen ? 'hidden' : 'block'
          }`}
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {/* Main content */}
      <div className={`lg:pl-64 flex flex-col min-h-screen`}>
        <main className="flex-1 py-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};