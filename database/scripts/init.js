const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function initDatabase() {
  const client = new Client({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USER || 'user',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'recruitment_db'
  });

  try {
    await client.connect();
    
    // Read and execute the init.sql file
    const initSQL = fs.readFileSync(path.join(__dirname, '../migrations/init.sql'), 'utf8');
    await client.query(initSQL);
    
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
  } finally {
    await client.end();
  }
}

initDatabase();
