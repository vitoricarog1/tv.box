import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';

// Admin Pages
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminLogin from './pages/admin/AdminLogin';
import DevicesPage from './pages/admin/DevicesPage';
import ContentPage from './pages/admin/ContentPage';
import PlaylistsPage from './pages/admin/PlaylistsPage';
import CampaignsPage from './pages/admin/CampaignsPage';
import AnalyticsPage from './pages/admin/AnalyticsPage';
import SettingsPage from './pages/admin/SettingsPage';

// TV Box Pages
import TVBoxDisplay from './pages/tvbox/TVBoxDisplay';
import TVBoxSetup from './pages/tvbox/TVBoxSetup';

// Components
import ProtectedRoute from './components/ProtectedRoute';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
            <div className="min-h-screen bg-gray-50">
              <Routes>
                {/* Admin Routes - Login disabled for now */}
                {/* <Route path="/admin/login" element={<AdminLogin />} /> */}
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<Navigate to="/admin/dashboard" replace />} />
                  <Route path="dashboard" element={<AdminDashboard />} />
                  <Route path="devices" element={<DevicesPage />} />
                  <Route path="content" element={<ContentPage />} />
                  <Route path="playlists" element={<PlaylistsPage />} />
                  <Route path="campaigns" element={<CampaignsPage />} />
                  <Route path="analytics" element={<AnalyticsPage />} />
                  <Route path="settings" element={<SettingsPage />} />
                </Route>

                {/* TV Box Routes */}
                <Route path="/tvbox/setup" element={<TVBoxSetup />} />
                <Route path="/tvbox/:deviceId" element={<TVBoxDisplay />} />
                <Route path="/tvbox" element={<TVBoxDisplay />} />

                {/* Default redirect */}
                <Route path="/" element={<Navigate to="/admin" replace />} />
                <Route path="*" element={<Navigate to="/admin" replace />} />
              </Routes>
            </div>
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
              }}
            />
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;