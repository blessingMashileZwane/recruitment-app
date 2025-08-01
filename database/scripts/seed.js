const { Client } = require('pg');
require('dotenv').config();

async function seed() {
  const client = new Client({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USER || 'user',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'recruitment_db'
  });

  try {
    await client.connect();

    // Insert some initial data
    await client.query(`
      -- Insert some skills
      INSERT INTO skills (name, category) VALUES
        ('JavaScript', 'Programming'),
        ('React', 'Frontend'),
        ('Node.js', 'Backend'),
        ('PostgreSQL', 'Database');

      -- Insert interview stages
      INSERT INTO interview_stages (name, description, order_index) VALUES
        ('Resume Screening', 'Initial resume review', 1),
        ('Technical Interview', 'Technical skills assessment', 2),
        ('Cultural Fit', 'Team and company culture assessment', 3),
        ('Final Interview', 'Final round with senior management', 4);

      -- Insert a job position
      INSERT INTO job_positions (title, department, description, requirements) VALUES
        ('Full Stack Developer', 'Engineering', 
         'We are looking for a Full Stack Developer to join our team', 
         'Experience with React, Node.js, and databases required');
    `);

    console.log('Seed data inserted successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await client.end();
  }
}

seed();
