const { Client } = require("pg");

// Function to fetch messages and their responses from the database
async function getHomePage(req, res) {
  const client = new Client({
    connectionString: "postgresql://postgres:postgres@localhost:5432/myTennis",
  });

  try {
    await client.connect();
    
    // Fetch experiences
    const experiencesResult = await client.query('SELECT * FROM tennis ORDER BY added ASC');
    const experiences = experiencesResult.rows;

    // Fetch responses for each experience
    for (let exp of experiences) {
      const responsesResult = await client.query('SELECT * FROM responses WHERE experience_id = $1 ORDER BY added ASC', [exp.id]);
      exp.responses = responsesResult.rows; // Add responses to each experience
    }

    res.render('index', { title: 'Tennis Experience Board', experiences });
  } catch (err) {
    console.error("Error fetching messages:", err);
    res.render('index', { title: 'Tennis Experience Board', experiences: [] });
  } finally {
    await client.end();
  }
}

function getAboutPage(req, res) {
  res.render('about', { title: 'About Us' });
}

// Function to render the new message form
function getSubmitPage(req, res) {
  res.render('submit', { title: 'New Message' });
}

// Function to handle new message submission
async function postNewExperience(req, res) {
  const { author, text, category } = req.body;

  const client = new Client({
    connectionString: "postgresql://postgres:postgres@localhost:5432/myTennis",
  });

  try {
    await client.connect();
    await client.query('INSERT INTO tennis (author, text, category) VALUES ($1, $2, $3)', [author, text, category]);
  } catch (err) {
    console.error("Error inserting message:", err);
  } finally {
    await client.end();
  }

  res.redirect('/');
}

// Function to handle responses to experiences
async function postResponse(req, res) {
  const { experience_id, responseAuthor, responseText } = req.body;

  const client = new Client({
    connectionString: "postgresql://postgres:postgres@localhost:5432/myTennis",
  });

  try {
    await client.connect();
    await client.query('INSERT INTO responses (experience_id, author, text) VALUES ($1, $2, $3)', [experience_id, responseAuthor, responseText]);
  } catch (err) {
    console.error("Error inserting response:", err);
  } finally {
    await client.end();
  }

  res.redirect('/');
}

module.exports = {
  getHomePage,
  getAboutPage,
  getSubmitPage,
  postNewExperience,
  postResponse // Export the new function
};