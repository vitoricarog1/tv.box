import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from '../components/admin/AdminLayout';
import AdminDashboard from './admin/AdminDashboard';
import DevicesPage from './admin/DevicesPage';
import MediaPage from './admin/MediaPage';
import PlaylistsPage from './admin/PlaylistsPage';

const AdminApp: React.FC = () => {
  return (
    <AdminLayout>
      <Routes>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="devices" element={<DevicesPage />} />
        <Route path="media" element={<MediaPage />} />
        <Route path="playlists" element={<PlaylistsPage />} />
      </Routes>
    </AdminLayout>
  );
};

export default AdminApp;