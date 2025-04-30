#! /usr/bin/env node

// Import the Client class from the 'pg' module to interact with PostgreSQL
const { Client } = require("pg");

// SQL commands to create tables and insert initial data
const SQL = `
CREATE TABLE IF NOT EXISTS tennis (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  author VARCHAR(255),
  text TEXT NOT NULL,
  category TEXT NOT NULL,
  added TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS responses (
  id SERIAL PRIMARY KEY,
  experience_id INTEGER REFERENCES tennis(id) ON DELETE CASCADE,
  author VARCHAR(255) NOT NULL,
  text TEXT NOT NULL,
  added TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO tennis (author, text, category)
VALUES
  ('Mateo', 'I had a really hard match yesterday, but what helped me the most was staying positive!', 'College Tournament'),
  ('Arthur', 'Tennis practice in the USA is not the same as in Brazil. We really need to practice extra to be able to keep up our level.', 'College Practice')
ON CONFLICT DO NOTHING;

INSERT INTO responses (experience_id, author, text)
VALUES
  (1, 'John', 'I completely agree! Staying positive is key.'),
  (1, 'Sarah', 'That’s a great mindset, Mateo! Keep it up!'),
  (2, 'Lucas', 'I feel the same way about practice differences.')
ON CONFLICT DO NOTHING;
`;

// Main function to execute the SQL commands
async function main() {
  console.log("seeding..."); // Log a message indicating the seeding process has started
  const client = new Client({
    connectionString: "postgresql://postgres:postgres@localhost:5432/myTennis", // Connection string for the database
  });
  
  // Connect to the PostgreSQL database
  await client.connect();
  
  // Execute the SQL commands to create tables and insert data
  await client.query(SQL);
  
  // Close the database connection
  await client.end();
  
  console.log("done"); // Log a message indicating the seeding process is complete
}

// Call the main function to run the script
main();