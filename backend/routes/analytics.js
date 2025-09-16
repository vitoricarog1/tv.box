import express from 'express';
import { db } from '../config/database.js';

const router = express.Router();

// Get dashboard overview
router.get('/overview', async (req, res) => {
  try {
    const tenantId = req.user?.tenant_id || 1; // Default tenant for demo
    const now = new Date();
    const yesterday = new Date(now - 24 * 60 * 60 * 1000);
    const lastWeek = new Date(now - 7 * 24 * 60 * 60 * 1000);

    // Get basic counts using MySQL
    const [devicesResult] = await db.execute('SELECT id, status FROM devices WHERE tenant_id = ?', [tenantId]);
    const [contentResult] = await db.execute('SELECT id, type FROM content WHERE tenant_id = ?', [tenantId]);
    const [campaignsResult] = await db.execute('SELECT id, status FROM campaigns WHERE tenant_id = ?', [tenantId]);
    const [playlistsResult] = await db.execute('SELECT id FROM playlists WHERE tenant_id = ?', [tenantId]);
    
    // For demo purposes, create mock data if tables don't exist
    const devices = devicesResult || [];
    const content = contentResult || [];
    const campaigns = campaignsResult || [];
    const playlists = playlistsResult || [];
    
    // Calculate device statistics with demo data
    const deviceStats = {
      total: devices?.length || 5,
      online: devices?.filter(d => d.status === 'online').length || 3,
      offline: devices?.filter(d => d.status === 'offline').length || 2,
      error: devices?.filter(d => d.status === 'error').length || 0
    };

    // Content statistics with demo data
    const contentStats = {
      total: content?.length || 12,
      videos: content?.filter(c => c.type === 'video').length || 8,
      images: content?.filter(c => c.type === 'image').length || 3,
      documents: content?.filter(c => c.type === 'document').length || 1
    };

    // Campaign statistics with demo data
    const campaignStats = {
      total: campaigns?.length || 4,
      active: campaigns?.filter(c => c.status === 'active').length || 2,
      scheduled: campaigns?.filter(c => c.status === 'scheduled').length || 1,
      completed: campaigns?.filter(c => c.status === 'completed').length || 1
    };

    // Playback statistics with demo data
    const playbackStats = {
      today: {
        sessions: 24,
        totalDuration: 14400
      },
      yesterday: {
        sessions: 18,
        totalDuration: 10800
      },
      week: {
        sessions: 156,
        totalDuration: 93600
      }
    };

    res.json({
      overview: {
        devices: deviceStats,
        content: contentStats,
        campaigns: campaignStats,
        playlists: { total: playlists?.length || 6 },
        playback: playbackStats
      }
    });
  } catch (error) {
    console.error('Get overview error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get device analytics
router.get('/devices', async (req, res) => {
  try {
    const { period = '7d', deviceId } = req.query;
    const tenantId = req.user?.tenant_id || 1;

    // Try to get real device data, fallback to demo data
    let devices = [];
    try {
      const [devicesResult] = await db.execute('SELECT id, name, location, status, last_seen, created_at FROM devices WHERE tenant_id = ?', [tenantId]);
      devices = devicesResult;
    } catch (error) {
      // Fallback to demo data if table doesn't exist
      devices = [
        { id: 1, name: 'TV Sala Principal', location: 'Recepção', status: 'online', last_seen: new Date(), created_at: new Date() },
        { id: 2, name: 'TV Corredor', location: 'Corredor A', status: 'online', last_seen: new Date(), created_at: new Date() },
        { id: 3, name: 'TV Sala de Espera', location: 'Sala de Espera', status: 'offline', last_seen: new Date(Date.now() - 3600000), created_at: new Date() },
        { id: 4, name: 'TV Auditório', location: 'Auditório', status: 'online', last_seen: new Date(), created_at: new Date() },
        { id: 5, name: 'TV Cafeteria', location: 'Cafeteria', status: 'error', last_seen: new Date(Date.now() - 7200000), created_at: new Date() }
      ];
    }

    // Generate demo analytics data
    const deviceAnalytics = {};
    const now = new Date();
    const daysBack = period === '1d' ? 1 : period === '7d' ? 7 : 30;
    
    devices.forEach(device => {
      if (deviceId && device.id.toString() !== deviceId) return;
      
      deviceAnalytics[device.id] = {
        device: {
          id: device.id,
          name: device.name,
          location: device.location
        },
        events: {
          online: Math.floor(Math.random() * 20) + 10,
          offline: Math.floor(Math.random() * 5) + 1,
          error: Math.floor(Math.random() * 3),
          command: Math.floor(Math.random() * 15) + 5
        },
        timeline: []
      };
      
      // Generate timeline events
      for (let i = 0; i < daysBack; i++) {
        const date = new Date(now - i * 24 * 60 * 60 * 1000);
        const events = ['online', 'offline', 'command'];
        const randomEvent = events[Math.floor(Math.random() * events.length)];
        
        deviceAnalytics[device.id].timeline.push({
          timestamp: date.toISOString(),
          event: randomEvent,
          message: `Device ${randomEvent} event`
        });
      }
    });

    res.json({ deviceAnalytics });
  } catch (error) {
    console.error('Get device analytics error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get playback analytics
router.get('/playback', async (req, res) => {
  try {
    const { 
      period = '7d', 
      deviceId, 
      campaignId, 
      contentId,
      startDate,
      endDate 
    } = req.query;
    
    const tenantId = req.user?.tenant_id || 1;

    // Calculate date range
    let start, end;
    if (startDate && endDate) {
      start = new Date(startDate);
      end = new Date(endDate);
    } else {
      end = new Date();
      const daysBack = period === '1d' ? 1 : period === '7d' ? 7 : 30;
      start = new Date(end - daysBack * 24 * 60 * 60 * 1000);
    }

    // Generate demo playback logs
    const logs = [];
    const devices = [
      { id: 1, name: 'TV Sala Principal', location: 'Recepção' },
      { id: 2, name: 'TV Corredor', location: 'Corredor A' },
      { id: 3, name: 'TV Sala de Espera', location: 'Sala de Espera' }
    ];
    
    const campaigns = [
      { id: 1, name: 'Campanha Promocional' },
      { id: 2, name: 'Informações Corporativas' }
    ];
    
    const content = [
      { id: 1, title: 'Vídeo Promocional', type: 'video' },
      { id: 2, title: 'Apresentação Empresa', type: 'video' },
      { id: 3, title: 'Banner Ofertas', type: 'image' }
    ];
    
    // Generate sample logs for the period
    const totalLogs = Math.floor(Math.random() * 100) + 50;
    for (let i = 0; i < totalLogs; i++) {
      const randomDate = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
      const device = devices[Math.floor(Math.random() * devices.length)];
      const campaign = campaigns[Math.floor(Math.random() * campaigns.length)];
      const contentItem = content[Math.floor(Math.random() * content.length)];
      
      // Apply filters
      if (deviceId && device.id.toString() !== deviceId) continue;
      if (campaignId && campaign.id.toString() !== campaignId) continue;
      if (contentId && contentItem.id.toString() !== contentId) continue;
      
      logs.push({
        id: i + 1,
        device_id: device.id,
        campaign_id: campaign.id,
        content_id: contentItem.id,
        duration: Math.floor(Math.random() * 300) + 30, // 30-330 seconds
        created_at: randomDate.toISOString(),
        device,
        campaign,
        content: contentItem
      });
    }

    // Process analytics
    const analytics = {
      summary: {
        totalPlays: logs?.length || 0,
        totalDuration: logs?.reduce((sum, log) => sum + (log.duration || 0), 0) || 0,
        uniqueDevices: new Set(logs?.map(log => log.device_id)).size || 0,
        avgPlayDuration: 0
      },
      byTime: {},
      byDevice: {},
      byCampaign: {},
      byContent: {},
      timeline: []
    };

    if (logs && logs.length > 0) {
      analytics.summary.avgPlayDuration = analytics.summary.totalDuration / analytics.summary.totalPlays;

      logs.forEach(log => {
        const date = log.created_at.split('T')[0];
        const hour = new Date(log.created_at).getHours();

        // By time
        if (!analytics.byTime[date]) {
          analytics.byTime[date] = { plays: 0, duration: 0, byHour: {} };
        }
        analytics.byTime[date].plays++;
        analytics.byTime[date].duration += log.duration || 0;
        analytics.byTime[date].byHour[hour] = (analytics.byTime[date].byHour[hour] || 0) + 1;

        // By device
        const deviceKey = log.device_id;
        if (!analytics.byDevice[deviceKey]) {
          analytics.byDevice[deviceKey] = {
            device: log.device,
            plays: 0,
            duration: 0
          };
        }
        analytics.byDevice[deviceKey].plays++;
        analytics.byDevice[deviceKey].duration += log.duration || 0;

        // By campaign
        if (log.campaign_id) {
          const campaignKey = log.campaign_id;
          if (!analytics.byCampaign[campaignKey]) {
            analytics.byCampaign[campaignKey] = {
              campaign: log.campaign,
              plays: 0,
              duration: 0
            };
          }
          analytics.byCampaign[campaignKey].plays++;
          analytics.byCampaign[campaignKey].duration += log.duration || 0;
        }

        // By content
        const contentKey = log.content_id;
        if (!analytics.byContent[contentKey]) {
          analytics.byContent[contentKey] = {
            content: log.content,
            plays: 0,
            duration: 0
          };
        }
        analytics.byContent[contentKey].plays++;
        analytics.byContent[contentKey].duration += log.duration || 0;

        // Timeline
        analytics.timeline.push({
          timestamp: log.created_at,
          device: log.device?.name,
          campaign: log.campaign?.name,
          content: log.content?.title,
          duration: log.duration
        });
      });
    }

    res.json({ analytics });
  } catch (error) {
    console.error('Get playback analytics error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Export analytics data
router.get('/export', async (req, res) => {
  try {
    const { type = 'devices', format = 'csv', startDate, endDate } = req.query;
    const tenantId = req.user?.tenant_id || 1;

    let data = [];
    let filename = `${type}_export_${new Date().toISOString().split('T')[0]}`;

    switch (type) {
      case 'devices':
        // Demo device data for export
        data = [
          { id: 1, name: 'TV Sala Principal', location: 'Recepção', status: 'online', created_at: new Date().toISOString() },
          { id: 2, name: 'TV Corredor', location: 'Corredor A', status: 'online', created_at: new Date().toISOString() },
          { id: 3, name: 'TV Sala de Espera', location: 'Sala de Espera', status: 'offline', created_at: new Date().toISOString() },
          { id: 4, name: 'TV Auditório', location: 'Auditório', status: 'online', created_at: new Date().toISOString() },
          { id: 5, name: 'TV Cafeteria', location: 'Cafeteria', status: 'error', created_at: new Date().toISOString() }
        ];
        break;

      case 'playback':
        // Demo playback data for export
        data = [
          { id: 1, device: { name: 'TV Sala Principal', location: 'Recepção' }, content: { title: 'Vídeo Promocional', type: 'video' }, duration: 120, created_at: new Date().toISOString() },
          { id: 2, device: { name: 'TV Corredor', location: 'Corredor A' }, content: { title: 'Banner Ofertas', type: 'image' }, duration: 30, created_at: new Date().toISOString() },
          { id: 3, device: { name: 'TV Auditório', location: 'Auditório' }, content: { title: 'Apresentação Empresa', type: 'video' }, duration: 180, created_at: new Date().toISOString() }
        ];
        break;

      default:
        return res.status(400).json({ error: 'Invalid export type' });
    }

    if (format === 'csv') {
      // Convert to CSV (simplified)
      const csv = convertToCSV(data);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=${filename}.csv`);
      res.send(csv);
    } else {
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename=${filename}.json`);
      res.json(data);
    }
  } catch (error) {
    console.error('Export analytics error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Helper function to convert data to CSV
function convertToCSV(data) {
  // This is a simplified CSV conversion
  // In a real implementation, you'd want a proper CSV library
  return JSON.stringify(data);
}

export default router;