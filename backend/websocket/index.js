import { db } from '../config/database.js';

const deviceConnections = new Map();
const adminConnections = new Map();

export const setupWebSocket = (wss) => {
  wss.on('connection', (ws, req) => {
    console.log('New WebSocket connection');

    ws.on('message', async (message) => {
      try {
        const data = JSON.parse(message.toString());
        
        switch (data.type) {
          case 'DEVICE_REGISTER':
            await handleDeviceRegister(ws, data);
            break;
          case 'ADMIN_REGISTER':
            await handleAdminRegister(ws, data);
            break;
          case 'HEARTBEAT':
            await handleHeartbeat(ws, data);
            break;
          case 'PLAYBACK_LOG':
            await handlePlaybackLog(data);
            break;
          case 'DEVICE_STATUS':
            await handleDeviceStatus(data);
            break;
          case 'SCREENSHOT_RESULT':
            await handleScreenshotResult(data);
            break;
          default:
            console.log('Unknown message type:', data.type);
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    });

    ws.on('close', () => {
      // Remove connection from maps
      for (const [key, connection] of deviceConnections) {
        if (connection.ws === ws) {
          deviceConnections.delete(key);
          console.log(`Device ${key} disconnected`);
          break;
        }
      }
      
      for (const [key, connection] of adminConnections) {
        if (connection.ws === ws) {
          adminConnections.delete(key);
          console.log(`Admin ${key} disconnected`);
          break;
        }
      }
    });

    // Send initial ping
    ws.send(JSON.stringify({ type: 'CONNECTED' }));
  });

  // Heartbeat to keep connections alive
  setInterval(() => {
    wss.clients.forEach(ws => {
      if (ws.readyState === ws.OPEN) {
        ws.ping();
      }
    });
  }, 30000);
};

const handleDeviceRegister = async (ws, data) => {
  try {
    const { deviceId, token } = data;

    // Verify device exists
    const [devices] = await db.execute(
      'SELECT * FROM devices WHERE id = ?',
      [deviceId]
    );

    if (devices.length === 0) {
      ws.send(JSON.stringify({ 
        type: 'ERROR', 
        message: 'Device not found' 
      }));
      return;
    }

    const device = devices[0];

    // Register device connection
    deviceConnections.set(deviceId, {
      ws,
      deviceId,
      lastSeen: new Date(),
      device
    });

    // Update device status
    await db.execute(
      'UPDATE devices SET status = ?, last_seen = CURRENT_TIMESTAMP WHERE id = ?',
      ['online', deviceId]
    );

    console.log(`Device ${deviceId} connected via WebSocket`);

    ws.send(JSON.stringify({ 
      type: 'REGISTERED',
      deviceId 
    }));

    // Notify admins
    broadcastToAdmins({
      type: 'DEVICE_ONLINE',
      data: { deviceId, device: device.name }
    }, device.tenant_id);

    console.log(`Device ${deviceId} registered`);
  } catch (error) {
    console.error('Device register error:', error);
  }
};

const handleAdminRegister = async (ws, data) => {
  try {
    const { userId, token } = data;

    // Verify user token
    // In a real implementation, verify JWT token here
    
    adminConnections.set(userId, {
      ws,
      userId,
      lastSeen: new Date()
    });

    ws.send(JSON.stringify({ 
      type: 'REGISTERED',
      userId 
    }));

    console.log(`Admin ${userId} registered`);
  } catch (error) {
    console.error('Admin register error:', error);
  }
};

const handleHeartbeat = async (ws, data) => {
  try {
    const { deviceId } = data;

    if (deviceConnections.has(deviceId)) {
      const connection = deviceConnections.get(deviceId);
      connection.lastSeen = new Date();

      // Update device last seen
      await db.execute(
        'UPDATE devices SET last_seen = CURRENT_TIMESTAMP WHERE id = ?',
        [deviceId]
      );

      ws.send(JSON.stringify({ type: 'HEARTBEAT_ACK' }));
    }
  } catch (error) {
    console.error('Heartbeat error:', error);
  }
};

const handlePlaybackLog = async (data) => {
  try {
    const { deviceId, contentId, campaignId, duration, startTime, endTime } = data;

    console.log(`Playback log: Device ${deviceId}, Content ${contentId}, Duration: ${duration}`);

    // Broadcast to admins
    broadcastToAdmins({
      type: 'PLAYBACK_UPDATE',
      data: { deviceId, contentId, campaignId, duration, startTime, endTime }
    });
  } catch (error) {
    console.error('Playback log error:', error);
  }
};

const handleDeviceStatus = async (data) => {
  try {
    const { deviceId, status, stats } = data;

    console.log(`Device ${deviceId} status: ${status}`, stats);

    // Broadcast status to admins
    broadcastToAdmins({
      type: 'DEVICE_STATUS_UPDATE',
      data: { deviceId, status, stats }
    });
  } catch (error) {
    console.error('Device status error:', error);
  }
};

const handleScreenshotResult = async (data) => {
  try {
    const { deviceId, screenshot, timestamp } = data;

    console.log(`Screenshot received from device ${deviceId}`);

    // Notify admins
    broadcastToAdmins({
      type: 'SCREENSHOT_READY',
      data: { deviceId, screenshot, timestamp: timestamp || new Date().toISOString() }
    });
  } catch (error) {
    console.error('Screenshot result error:', error);
  }
};

export const broadcastToDevice = (deviceId, message) => {
  if (deviceId === 'all') {
    // Broadcast to all connected devices
    let sentCount = 0;
    for (const connection of deviceConnections.values()) {
      if (connection.ws.readyState === connection.ws.OPEN) {
        connection.ws.send(JSON.stringify(message));
        sentCount++;
      }
    }
    return sentCount > 0;
  } else {
    // Broadcast to specific device
    const connection = deviceConnections.get(deviceId);
    if (connection && connection.ws.readyState === connection.ws.OPEN) {
      connection.ws.send(JSON.stringify(message));
      return true;
    }
    return false;
  }
};

export const broadcastToAdmins = (message) => {
  for (const connection of adminConnections.values()) {
    if (connection.ws.readyState === connection.ws.OPEN) {
      connection.ws.send(JSON.stringify(message));
    }
  }
};

// Cleanup offline devices
setInterval(async () => {
  const now = new Date();
  const timeout = 5 * 60 * 1000; // 5 minutes

  for (const [deviceId, connection] of deviceConnections) {
    if (now - connection.lastSeen > timeout) {
      console.log(`Device ${deviceId} timed out`);
      
      // Update device status
      await db.execute(
        'UPDATE devices SET status = ? WHERE id = ?',
        ['offline', deviceId]
      );

      // Remove connection
      deviceConnections.delete(deviceId);

      // Notify admins
      if (connection.device) {
        broadcastToAdmins({
          type: 'DEVICE_OFFLINE',
          data: { deviceId, device: connection.device.name }
        });
      }
    }
  }
}, 60000); // Check every minute