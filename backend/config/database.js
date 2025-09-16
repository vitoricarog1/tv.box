import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'tvbox_db',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Create connection pool
export const db = mysql.createPool(dbConfig);

// Test connection
export const testConnection = async () => {
  try {
    const connection = await db.getConnection();
    await connection.ping();
    connection.release();
    console.log('✅ MySQL database connection successful');
    return true;
  } catch (error) {
    console.error('❌ MySQL database connection failed:', error.message);
    return false;
  }
};

// Initialize database tables
export const initializeDatabase = async () => {
  try {
    // Create users table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        role ENUM('admin', 'user') DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Create devices table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS devices (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        location VARCHAR(255),
        status ENUM('online', 'offline', 'maintenance') DEFAULT 'offline',
        last_seen TIMESTAMP NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Create content table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS content (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        type ENUM('image', 'video', 'text', 'url') NOT NULL,
        file_path VARCHAR(500),
        url VARCHAR(500),
        duration INT DEFAULT 10,
        active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Create playlists table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS playlists (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Create playlist_content junction table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS playlist_content (
        id INT AUTO_INCREMENT PRIMARY KEY,
        playlist_id INT NOT NULL,
        content_id INT NOT NULL,
        order_index INT NOT NULL DEFAULT 0,
        FOREIGN KEY (playlist_id) REFERENCES playlists(id) ON DELETE CASCADE,
        FOREIGN KEY (content_id) REFERENCES content(id) ON DELETE CASCADE
      )
    `);

    // Create campaigns table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS campaigns (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        playlist_id INT,
        start_date DATETIME,
        end_date DATETIME,
        active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (playlist_id) REFERENCES playlists(id) ON DELETE SET NULL
      )
    `);

    // Create device_campaigns junction table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS device_campaigns (
        id INT AUTO_INCREMENT PRIMARY KEY,
        device_id INT NOT NULL,
        campaign_id INT NOT NULL,
        FOREIGN KEY (device_id) REFERENCES devices(id) ON DELETE CASCADE,
        FOREIGN KEY (campaign_id) REFERENCES campaigns(id) ON DELETE CASCADE
      )
    `);

    console.log('✅ Database tables initialized successfully');
    return true;
  } catch (error) {
    console.error('❌ Database initialization failed:', error.message);
    return false;
  }
};