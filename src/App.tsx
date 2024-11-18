
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'react-hot-toast';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { ProductsPage } from './pages/ProductsPage';
import { CustomersPage } from './pages/CustomersPage';
import { UsersPage } from './pages/UsersPage';
import { FleetPage } from './pages/FleetPage';
import { OperationsPage } from './pages/OperationsPage';
import { DeliveriesPage } from './pages/DeliveriesPage';
import { RoutePlanningPage } from './pages/RoutePlanningPage';
import { ReportsPage } from './pages/ReportsPage';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          
          <Route
            path="/"
            element={
              <ProtectedRoute allowedRoles={['SALES', 'OPERATIONS', 'MANAGER', 'DRIVER']}>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardPage />} />
            <Route path="products" element={<ProductsPage />} />
            <Route path="customers" element={<CustomersPage />} />
            <Route 
              path="users" 
              element={
                <ProtectedRoute allowedRoles={['MANAGER']}>
                  <UsersPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="fleet" 
              element={
                <ProtectedRoute allowedRoles={['OPERATIONS', 'MANAGER']}>
                  <FleetPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="operations" 
              element={
                <ProtectedRoute allowedRoles={['OPERATIONS', 'MANAGER']}>
                  <OperationsPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="Dashboard" 
              element={
                <ProtectedRoute allowedRoles={['OPERATIONS', 'MANAGER' ]}>
                  <DashboardPage />
                </ProtectedRoute>
              }
/>
            <Route 
              path="Deliveries" 
              element={
                <ProtectedRoute allowedRoles={['OPERATIONS', 'MANAGER' ]}>
                  <DeliveriesPage />
                </ProtectedRoute>
              }
              />
              <Route 
                path="Products" 
                element={
                  <ProtectedRoute allowedRoles={['OPERATIONS', 'MANAGER' ]}>
                    <ProductsPage />
                  </ProtectedRoute>
                }
                />
                <Route 
                  path="RoutePlanning" 
                  element={
                    <ProtectedRoute allowedRoles={['OPERATIONS', 'MANAGER' ]}>
                      <RoutePlanningPage />
                    </ProtectedRoute>
                  }
                  />
                  <Route 
                    path="Users" 
                    element={
                      <ProtectedRoute allowedRoles={['OPERATIONS', 'MANAGER' ]}>
                        <UsersPage />
                      </ProtectedRoute>
                    }

                    />
                    <Route 
                      path="Reports" 
                      element={
                        <ProtectedRoute allowedRoles={['OPERATIONS', 'MANAGER' ]}>
                          <ReportsPage />
                        </ProtectedRoute>
                      }
            />
            <Route path="deliveries" element={<DeliveriesPage />} />
            <Route 
              path="route-planning" 
              element={
                <ProtectedRoute allowedRoles={['OPERATIONS', 'MANAGER']}>
                  <RoutePlanningPage />
                </ProtectedRoute>
              } 
            />
            <Route path="reports" element={<ReportsPage />} />
          </Route>
        </Routes>
      </Router>
      <Toaster position="top-right" />
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}

export default App;