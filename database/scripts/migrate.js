const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function migrate(direction) {
  const client = new Client({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USER || 'user',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'recruitment_db'
  });

  try {
    await client.connect();
    
    if (direction === 'up') {
      // For demonstration, this will re-run the init.sql
      // In a real app, you'd have numbered migrations
      const initSQL = fs.readFileSync(path.join(__dirname, '../migrations/init.sql'), 'utf8');
      await client.query(initSQL);
      console.log('Migration up completed successfully');
    } else if (direction === 'down') {
      // Drop all tables
      await client.query(`
        DROP TABLE IF EXISTS 
          interview_progress_history,
          interview_progress,
          interview_stages,
          candidate_skills,
          skills,
          candidate_history,
          candidates,
          job_positions CASCADE;
          
        DROP TYPE IF EXISTS interview_status, candidate_status CASCADE;
        DROP FUNCTION IF EXISTS update_updated_at_column CASCADE;
      `);
      console.log('Migration down completed successfully');
    }
  } catch (error) {
    console.error('Error during migration:', error);
  } finally {
    await client.end();
  }
}

const direction = process.argv[2];
if (direction !== 'up' && direction !== 'down') {
  console.error('Please specify migration direction: up or down');
  process.exit(1);
}

migrate(direction);
