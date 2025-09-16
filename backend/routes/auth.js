import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../config/database.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Register endpoint
router.post('/register', async (req, res) => {
  try {
    const { email, password, name, role = 'user' } = req.body;

    // Demo registration - in production this would create in database
    const newUser = {
      id: Math.floor(Math.random() * 1000) + 2,
      email,
      name,
      role,
      tenant_id: 1,
      created_at: new Date().toISOString()
    };

    res.status(201).json({
      message: 'Usuário registrado com sucesso',
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Demo authentication - in production this would check the database
    if (email === 'admin@oricontrol.com' && password === 'admin123') {
      const user = {
        id: 1,
        email: 'admin@oricontrol.com',
        role: 'admin',
        tenant_id: 1,
        name: 'Administrador'
      };

      // Generate JWT token
      const token = jwt.sign(
        { 
          userId: user.id,
          email: user.email,
          role: user.role,
          tenant_id: user.tenant_id
        },
        process.env.JWT_SECRET || 'demo-secret',
        { expiresIn: '24h' }
      );

      res.json({ token, user });
    } else {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get current user
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = req.user;
    
    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        createdAt: user.created_at
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Refresh token
router.post('/refresh', authMiddleware, async (req, res) => {
  try {
    const user = req.user;

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.json({ token });
  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Logout endpoint
router.post('/logout', authMiddleware, async (req, res) => {
  try {
    // Demo logout - in production this might blacklist the token
    res.json({ message: 'Logout realizado com sucesso' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

export default router;