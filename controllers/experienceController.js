const { Client } = require("pg");

// Function to fetch messages from the database
async function getHomePage(req, res) {
  const client = new Client({
    connectionString: "postgresql://postgres:gonzalo08@localhost:5432/myTennis",
  });

  try {
    await client.connect();
    const result = await client.query('SELECT * FROM tennis ORDER BY added DESC');
    // Use 'experiences' as the variable name here to match your EJS view
    res.render('index', { title: 'Tennis Experience Board', experiences: result.rows });
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
    connectionString: "postgresql://postgres:gonzalo08@localhost:5432/myTennis",
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

module.exports = {
  getHomePage,
  getAboutPage,
  getSubmitPage,
  postNewExperience
};
