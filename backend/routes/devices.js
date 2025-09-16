import express from 'express';
import { db } from '../config/database.js';
import { broadcastToDevice, broadcastToAdmins } from '../websocket/socketHandler.js';

const router = express.Router();

// Register a new device
router.post('/register', async (req, res) => {
  try {
    const { deviceId, name, userAgent, screen } = req.body;

    if (!deviceId || !Number.isInteger(deviceId) || deviceId <= 0) {
      return res.status(400).json({
        success: false,
        message: 'ID do dispositivo deve ser um número inteiro positivo'
      });
    }

    // Check if device already exists
    const [existingDevices] = await db.execute(
      'SELECT * FROM devices WHERE device_id = ?',
      [deviceId]
    );

    if (existingDevices.length > 0) {
      const device = existingDevices[0];
      
      if (device.status === 'blocked') {
        return res.status(403).json({
          success: false,
          message: 'Este dispositivo foi bloqueado pelo administrador'
        });
      }

      // Update existing device info
      await db.execute(
        'UPDATE devices SET name = ?, user_agent = ?, screen_info = ?, last_seen = CURRENT_TIMESTAMP WHERE device_id = ?',
        [name || device.name, userAgent, JSON.stringify(screen), deviceId]
      );

      return res.json({
        success: true,
        message: 'Dispositivo reconectado com sucesso',
        device: {
          deviceId,
          name: name || device.name,
          status: device.status
        }
      });
    }

    // Create new device
    await db.execute(
      'INSERT INTO devices (device_id, name, user_agent, screen_info, status, last_seen) VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)',
      [deviceId, name || `Dispositivo ${deviceId}`, userAgent, JSON.stringify(screen), 'active']
    );

    res.json({
      success: true,
      message: 'Dispositivo registrado com sucesso',
      device: {
        deviceId,
        name: name || `Dispositivo ${deviceId}`,
        status: 'active'
      }
    });

  } catch (error) {
    console.error('Device registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// Get device status
router.get('/:deviceId/status', async (req, res) => {
  try {
    const { deviceId } = req.params;

    const [devices] = await db.execute(
      'SELECT device_id, name, status, last_seen FROM devices WHERE device_id = ?',
      [deviceId]
    );

    if (devices.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Dispositivo não encontrado'
      });
    }

    const device = devices[0];
    res.json({
      success: true,
      deviceId: device.device_id,
      name: device.name,
      status: device.status,
      lastSeen: device.last_seen
    });

  } catch (error) {
    console.error('Get device status error:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// Get device info (for client app)
router.get('/:deviceId/info', async (req, res) => {
  try {
    const { deviceId } = req.params;

    const [devices] = await db.execute(
      'SELECT device_id, name, location, status, last_seen, created_at FROM devices WHERE device_id = ?',
      [deviceId]
    );

    if (devices.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Dispositivo não encontrado'
      });
    }

    const device = devices[0];
    res.json({
      success: true,
      device: {
        deviceId: device.device_id,
        name: device.name,
        location: device.location,
        status: device.status,
        lastSeen: device.last_seen,
        createdAt: device.created_at
      }
    });

  } catch (error) {
    console.error('Get device info error:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// Get device playlist
router.get('/:deviceId/playlist', async (req, res) => {
  try {
    const { deviceId } = req.params;

    // Verify device exists and is active
    const [devices] = await db.execute(
      'SELECT status FROM devices WHERE device_id = ?',
      [deviceId]
    );

    if (devices.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Dispositivo não encontrado'
      });
    }

    if (devices[0].status === 'blocked') {
      return res.status(403).json({
        success: false,
        message: 'Dispositivo bloqueado'
      });
    }

    // Get playlist items
    const [items] = await db.execute(`
      SELECT 
        pi.id,
        pi.duration_seconds,
        pi.order_index as \`order\`,
        pi.active,
        m.type,
        m.url,
        m.checksum,
        m.filename
      FROM playlist_items pi
      JOIN media m ON pi.media_id = m.id
      WHERE pi.device_id = ? AND pi.active = true
      ORDER BY pi.order_index ASC
    `, [deviceId]);

    res.json({
      success: true,
      deviceId: parseInt(deviceId),
      items: items.map(item => ({
        id: item.id,
        type: item.type,
        url: item.url,
        duration_seconds: item.duration_seconds,
        order: item.order,
        active: item.active,
        checksum: item.checksum
      })),
      version: items.length, // Simple version based on item count
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Get playlist error:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// Log device events (heartbeat, playback, errors)
router.post('/:deviceId/events', async (req, res) => {
  try {
    const { deviceId } = req.params;
    const { type, data } = req.body;

    if (!['heartbeat', 'playback', 'error'].includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'Tipo de evento inválido'
      });
    }

    // Log event
    await db.execute(
      'INSERT INTO device_logs (device_id, event_type, data) VALUES (?, ?, ?)',
      [deviceId, type, JSON.stringify(data)]
    );

    // Update device last seen for heartbeat
    if (type === 'heartbeat') {
      await db.execute(
        'UPDATE devices SET last_seen = CURRENT_TIMESTAMP WHERE device_id = ?',
        [deviceId]
      );
    }

    res.json({
      success: true,
      message: 'Evento registrado com sucesso'
    });

  } catch (error) {
    console.error('Log event error:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

export default router;