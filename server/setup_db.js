const mysql = require('mysql2/promise');
require('dotenv').config();

async function createDb() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '0000',
    });
    await connection.query('CREATE DATABASE IF NOT EXISTS apsrtc_bus_booking;');
    console.log('Database apsrtc_bus_booking created or already exists.');
    await connection.end();
  } catch (err) {
    console.error('Error creating database:', err.message);
  }
}

createDb();
