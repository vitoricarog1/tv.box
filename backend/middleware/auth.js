import jwt from 'jsonwebtoken';
import { db } from '../config/database.js';

export const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Access token required' });
    }

    const token = authHeader.substring(7);
    
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Get user from database
      const [users] = await db.execute(
        'SELECT * FROM users WHERE id = ?',
        [decoded.userId]
      );

      if (users.length === 0) {
        return res.status(401).json({ error: 'Invalid token' });
      }

      const user = users[0];

      req.user = user;
      next();
    } catch (jwtError) {
      return res.status(401).json({ error: 'Invalid token' });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const userRoles = Array.isArray(req.user.roles) ? req.user.roles : [req.user.role];
    const hasRole = roles.some(role => userRoles.includes(role));

    if (!hasRole) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    next();
  };
};

export const requirePermission = (permission) => {
  return async (req, res, next) => {
    try {
      // Demo permission check - in production this would check the database
      const userPermissions = [
        'read_devices', 'write_devices', 'read_content', 'write_content',
        'read_campaigns', 'write_campaigns', 'read_analytics', 'admin'
      ];

      const hasPermission = userPermissions.includes(permission) || req.user?.role === 'admin';

      if (!hasPermission) {
        return res.status(403).json({ error: 'Permissão negada' });
      }

      next();
    } catch (error) {
      console.error('Permission middleware error:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  };
};