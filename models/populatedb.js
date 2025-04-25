#! /usr/bin/env node

const { Client } = require("pg");

const SQL = `
CREATE TABLE IF NOT EXISTS tennis (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  author VARCHAR(255),
  text TEXT NOT NULL,
  category TEXT NOT NULL,
  added TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO tennis (author, text, category)
VALUES
  ('Mateo', 'I had a really hard match yesterday, but what helped me the most was staying positive!', 'College Tournament'),
  ('Arthur', 'Tennis practice in the USA is not the same as in Brazil. We really need to practice extra to be able to keep up our level.', 'College Practice')
ON CONFLICT DO NOTHING;
`;

async function main() {
  console.log("seeding...");
  const client = new Client({
    connectionString: "postgresql://postgres:postgres@localhost:5432/myTennis",
  });
  await client.connect();
  await client.query(SQL);
  await client.end();
  console.log("done");
}

main();
