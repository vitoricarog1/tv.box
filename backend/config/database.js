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
    "workbox-window": "^7.0.0",
        device_id INT UNIQUE NOT NULL,
    "react-hot-toast": "^2.6.0",
    "react-router-dom": "^7.9.0",
    "react-sortable-hoc": "^2.0.0"
  },
  "devDependencies": {
    "@eslint/js": "^9.9.1",
    "@types/react": "^18.3.5",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.3.1",
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
        status ENUM('active', 'blocked') DEFAULT 'active',
        last_seen TIMESTAMP NULL,
        user_agent TEXT,
        screen_info JSON,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Create playlist_items table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS playlist_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        device_id INT NOT NULL,
        media_id INT NOT NULL,
        duration_seconds INT NULL,
        order_index INT NOT NULL DEFAULT 0,
        active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (device_id) REFERENCES devices(device_id) ON DELETE CASCADE,
        FOREIGN KEY (media_id) REFERENCES media(id) ON DELETE CASCADE,
        INDEX idx_device_order (device_id, order_index)
      )
    `);
    // Create media table
    // Create device_logs table for telemetry
      CREATE TABLE IF NOT EXISTS media (
      CREATE TABLE IF NOT EXISTS device_logs (
        filename VARCHAR(255) NOT NULL,
        device_id INT NOT NULL,
        event_type ENUM('heartbeat', 'playback', 'error') NOT NULL,
        data JSON,
        uploaded_by VARCHAR(50) DEFAULT 'admin',
        FOREIGN KEY (device_id) REFERENCES devices(device_id) ON DELETE CASCADE,
        INDEX idx_device_time (device_id, created_at)
      )
    `);
    // Create client_changes table for client-admin collaboration
      CREATE TABLE IF NOT EXISTS client_changes (
        device_id INT NOT NULL,
        change_type ENUM('add', 'remove', 'reorder', 'duration') NOT NULL,
        data JSON NOT NULL,
        status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
        requested_by VARCHAR(50) DEFAULT 'client',
        reviewed_by VARCHAR(50) NULL,
        reviewed_at TIMESTAMP NULL,
        FOREIGN KEY (device_id) REFERENCES devices(device_id) ON DELETE CASCADE