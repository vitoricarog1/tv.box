{
  "name": "tvbox-control-system",
  "private": true,
  "version": "1.0.0",
  "description": "Sistema de Controle TVBOX - Controle remoto de dispositivos",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint .",
    "preview": "vite preview"
  },
    "@tanstack/react-query": "^5.87.4",
    "axios": "^1.12.1",
    "idb": "^8.0.0",
    "idb": "^8.0.0",
    "lucide-react": "^0.344.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
// Main Components
import DeviceApp from './pages/DeviceApp';
import AdminApp from './pages/AdminApp';
import ClientApp from './pages/ClientApp';
    "autoprefixer": "^10.4.18",
    "eslint": "^9.9.1",
    "eslint-plugin-react-hooks": "^5.1.0-rc.0",
    "eslint-plugin-react-refresh": "^0.4.11",
    "globals": "^15.9.0",
    "postcss": "^8.4.35",
    "tailwindcss": "^3.4.1",
    "typescript": "^5.5.3",
    "typescript-eslint": "^8.3.0",
    "vite": "^5.4.2",
    "vite-plugin-pwa": "^0.17.4",
    "workbox-build": "^7.0.0",
    "workbox-precaching": "^7.0.0",
    "workbox-routing": "^7.0.0",
    "workbox-strategies": "^7.0.0"
  }
}

      <Router>
        <Routes>
          {/* Device/Player Routes */}
          <Route path="/" element={<DeviceApp />} />
          <Route path="/device" element={<DeviceApp />} />
          
          {/* Admin Routes */}
          <Route path="/admin/*" element={<AdminApp />} />
          
          {/* Client Routes */}
          <Route path="/client/:deviceId" element={<ClientApp />} />
          
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        
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