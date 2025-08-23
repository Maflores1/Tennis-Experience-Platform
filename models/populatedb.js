#! /usr/bin/env node

// Import the Pool class from the 'pg' module to interact with PostgreSQL
const { Pool } = require("pg");
const bcrypt = require("bcrypt");
require('dotenv').config();

// Function to hash passwords properly
async function hashPassword(password) {
  return await bcrypt.hash(password, 10);
}

// Main function to execute the SQL commands
async function main() {
  console.log("seeding..."); // Log a message indicating the seeding process has started

// Use environment variable for better security, fallback to your hardcoded string for development
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});
  
  try {
    // First, create the users table if it doesn't exist
    const createUsersTableSQL = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(50) UNIQUE NOT NULL,
      email VARCHAR(100) UNIQUE,
      password VARCHAR(255) NOT NULL,
      first_name VARCHAR(50),
      last_name VARCHAR(50),
      university VARCHAR(100),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    `;

    await pool.query(createUsersTableSQL);
    console.log("Users table created/verified successfully");

    // Check if user_id column exists in tennis table, if not add it
    const checkTennisColumn = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name='tennis' AND column_name='user_id'
    `);

    if (checkTennisColumn.rows.length === 0) {
      await pool.query('ALTER TABLE tennis ADD COLUMN user_id INTEGER REFERENCES users(id)');
      console.log("Added user_id column to tennis table");
    }

    // Check if user_id column exists in responses table, if not add it
    const checkResponsesColumn = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name='responses' AND column_name='user_id'
    `);

    if (checkResponsesColumn.rows.length === 0) {
      await pool.query('ALTER TABLE responses ADD COLUMN user_id INTEGER REFERENCES users(id)');
      console.log("Added user_id column to responses table");
    }

    // Create indexes for better performance (now that columns exist)
    const createIndexesSQL = `
    CREATE INDEX IF NOT EXISTS idx_tennis_user_id ON tennis(user_id);
    CREATE INDEX IF NOT EXISTS idx_responses_user_id ON responses(user_id);
    CREATE INDEX IF NOT EXISTS idx_responses_experience_id ON responses(experience_id);
    `;

    await pool.query(createIndexesSQL);
    console.log("Indexes created successfully");

    // Check if we need to update the users table schema (add email column if missing)
    const checkEmailColumn = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name='users' AND column_name='email'
    `);

    if (checkEmailColumn.rows.length === 0) {
      await pool.query(`
        ALTER TABLE users 
        ADD COLUMN email VARCHAR(100) UNIQUE,
        ADD COLUMN first_name VARCHAR(50),
        ADD COLUMN last_name VARCHAR(50),
        ADD COLUMN university VARCHAR(100),
        ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      `);
      console.log("Updated users table schema");
    }

    // Hash passwords for test users
    const testUserPassword = await hashPassword('test123');
    const adminPassword = await hashPassword('admin123');
    const mateoPassword = await hashPassword('mateo123');
    const arthurPassword = await hashPassword('arthur123');

    // Insert users with proper hashed passwords
    const insertUsersSQL = `
    INSERT INTO users (username, email, password, first_name, last_name, university)
    VALUES
      ('testuser', 'test@example.com', $1, 'Test', 'User', 'Sample University'),
      ('admin', 'admin@example.com', $2, 'Admin', 'User', 'Tennis Academy'),
      ('mateo', 'mateo@example.com', $3, 'Mateo', 'Flores', 'College University'),
      ('arthur', 'arthur@example.com', $4, 'Arthur', 'Silva', 'Brazilian Tennis College')
    ON CONFLICT (username) DO NOTHING;
    `;

    await pool.query(insertUsersSQL, [testUserPassword, adminPassword, mateoPassword, arthurPassword]);
    console.log("Users inserted successfully");

    // Update existing tennis experiences to link with users (if not already linked)
    const updateTennisSQL = `
    UPDATE tennis 
    SET user_id = (
      CASE 
        WHEN author = 'Mateo' THEN (SELECT id FROM users WHERE username = 'mateo')
        WHEN author = 'Arthur' THEN (SELECT id FROM users WHERE username = 'arthur')
        ELSE (SELECT id FROM users WHERE username = 'testuser')
      END
    )
    WHERE user_id IS NULL;
    `;

    await pool.query(updateTennisSQL);
    console.log("Updated existing tennis experiences with user IDs");

    // Update existing responses to link with users (if not already linked)
    const updateResponsesSQL = `
    UPDATE responses 
    SET user_id = (
      CASE 
        WHEN author = 'John' THEN (SELECT id FROM users WHERE username = 'testuser')
        WHEN author = 'Sarah' THEN (SELECT id FROM users WHERE username = 'admin')
        WHEN author = 'Lucas' THEN (SELECT id FROM users WHERE username = 'testuser')
        ELSE (SELECT id FROM users WHERE username = 'testuser')
      END
    )
    WHERE user_id IS NULL;
    `;

    await pool.query(updateResponsesSQL);
    console.log("Updated existing responses with user IDs");

    // Insert any missing tennis experiences
    const insertTennisSQL = `
    INSERT INTO tennis (author, text, category, user_id)
    SELECT 'Mateo', 'I had a really hard match yesterday, but what helped me the most was staying positive!', 'College Tournament', u.id
    FROM users u WHERE u.username = 'mateo'
    AND NOT EXISTS (
      SELECT 1 FROM tennis WHERE text LIKE '%staying positive%'
    );

    INSERT INTO tennis (author, text, category, user_id)
    SELECT 'Arthur', 'Tennis practice in the USA is not the same as in Brazil. We really need to practice extra to be able to keep up our level.', 'College Practice', u.id
    FROM users u WHERE u.username = 'arthur'
    AND NOT EXISTS (
      SELECT 1 FROM tennis WHERE text LIKE '%practice in the USA%'
    );
    `;

    await pool.query(insertTennisSQL);
    console.log("Tennis experiences verified/inserted successfully");

    console.log("Database seeded successfully");
    console.log("Test users created:");
    console.log("- Username: testuser, Password: test123");
    console.log("- Username: admin, Password: admin123");
    console.log("- Username: mateo, Password: mateo123");
    console.log("- Username: arthur, Password: arthur123");

  } catch (err) {
    console.error("Error during seeding:", err);
  } finally {
    // Close the database connection
    await pool.end();
    console.log("Database connection closed");
  }
}

// Call the main function to run the script
main();