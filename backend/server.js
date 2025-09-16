import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { WebSocketServer } from 'ws';
import { createServer } from 'http';

// Import routes
import authRoutes from './routes/auth.js';
import deviceRoutes from './routes/devices.js';
import contentRoutes from './routes/content.js';
import playlistRoutes from './routes/playlists.js';
import campaignRoutes from './routes/campaigns.js';
import analyticsRoutes from './routes/analytics.js';
import systemRoutes from './routes/system.js';
import videoProcessingRoutes from './src/routes/videoProcessing.js';

// Import middleware
import { authMiddleware } from './middleware/auth.js';
import { errorHandler } from './middleware/errorHandler.js';
import { rateLimiter } from './middleware/rateLimiter.js';

// Import WebSocket handler
import { setupWebSocket } from './websocket/index.js';

// Import database
import { testConnection, initializeDatabase } from './config/database.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Create HTTP server
const server = createServer(app);

// Setup WebSocket
const wss = new WebSocketServer({ server });
setupWebSocket(wss);

// Initialize database
const initDB = async () => {
  const connected = await testConnection();
  if (connected) {
    await initializeDatabase();
  } else {
    console.error('❌ Failed to connect to database. Please check your MySQL configuration.');
    process.exit(1);
  }
};

initDB();

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  crossOriginEmbedderPolicy: false
}));
app.use(cors({
  origin: true, // Allow all origins for network access
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Range']
}));

// Rate limiting with improved limits
app.use('/api', rateLimiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files for uploads with proper headers for video streaming
app.use('/uploads', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Range');
  res.header('Accept-Ranges', 'bytes');
  next();
}, express.static('uploads'));

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/devices', authMiddleware, deviceRoutes);
app.use('/api/v1/content', authMiddleware, contentRoutes);
// Public content endpoint for TV Box display (no auth required)
app.use('/api/v1/public/content', contentRoutes);
app.use('/api/v1/playlists', authMiddleware, playlistRoutes);
app.use('/api/v1/campaigns', authMiddleware, campaignRoutes);
app.use('/api/v1/analytics', authMiddleware, analyticsRoutes);
app.use('/api/v1/system', authMiddleware, systemRoutes);
// Video processing routes (with auth for upload, public for streaming)
app.use('/api/v1/video-processing', videoProcessingRoutes);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Error handling
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl
  });
});

// Start server
server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 ORI.CONTROL Backend running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🌐 Network access: http://[YOUR_IP]:${PORT}/health`);
  console.log(`🔌 WebSocket server ready`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down server...');
  server.close(() => {
    console.log('✅ Server stopped');
    process.exit(0);
  });
});