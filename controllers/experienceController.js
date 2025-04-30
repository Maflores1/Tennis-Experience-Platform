// Import the Client class from the 'pg' module to interact with PostgreSQL
const { Client } = require("pg");

// Function to fetch messages and their responses from the database
async function getHomePage(req, res) {
  // Create a new client instance to connect to the PostgreSQL database
  const client = new Client({
    connectionString: "postgresql://postgres:postgres@localhost:5432/myTennis", // Connection string for the database
  });

  try {
    // Connect to the database
    await client.connect();
    
    // Fetch all experiences from the 'tennis' table, ordered by the date they were added (ascending)
    const experiencesResult = await client.query('SELECT * FROM tennis ORDER BY added ASC');
    const experiences = experiencesResult.rows; // Store the fetched experiences in a variable

    // Loop through each experience to fetch its responses
    for (let exp of experiences) {
      // Fetch responses for the current experience, ordered by the date they were added (ascending)
      const responsesResult = await client.query('SELECT * FROM responses WHERE experience_id = $1 ORDER BY added ASC', [exp.id]);
      exp.responses = responsesResult.rows; // Add the fetched responses to the current experience
    }

    // Render the 'index' view and pass the experiences to it
    res.render('index', { title: 'Tennis Experience Board', experiences });
  } catch (err) {
    // If there's an error, log it to the console
    console.error("Error fetching messages:", err);
    // Render the 'index' view with an empty experiences array
    res.render('index', { title: 'Tennis Experience Board', experiences: [] });
  } finally {
    // Close the database connection
    await client.end();
  }
}

// Function to render the About Us page
function getAboutPage(req, res) {
  res.render('about', { title: 'About Us' }); // Render the 'about' view
}

// Function to render the new message submission form
function getSubmitPage(req, res) {
  res.render('submit', { title: 'New Message' }); // Render the 'submit' view
}

// Function to handle new message submission
async function postNewExperience(req, res) {
  const { author, text, category } = req.body;

  // Create a new client instance to connect to the PostgreSQL database
  const client = new Client({
    connectionString: "postgresql://postgres:postgres@localhost:5432/myTennis", // Connection string for the database
  });

  try {
    // Connect to the database
    await client.connect();
    // Insert the new experience into the 'tennis' table
    await client.query('INSERT INTO tennis (author, text, category) VALUES ($1, $2, $3)', [author, text, category]);
  } catch (err) {
    // If there's an error, log it to the console
    console.error("Error inserting message:", err);
  } finally {
    // Close the database connection
    await client.end();
  }

  // Redirect the user back to the home page after submission
  res.redirect('/');
}

// Function to handle responses to experiences
async function postResponse(req, res) {
  const { experience_id, responseAuthor, responseText } = req.body;

  // Create a new client instance to connect to the PostgreSQL database
  const client = new Client({
    connectionString: "postgresql://postgres:postgres@localhost:5432/myTennis", // Connection string for the database
  });

  try {
    // Connect to the database
    await client.connect();
    // Insert the new response into the 'responses' table
    await client.query('INSERT INTO responses (experience_id, author, text) VALUES ($1, $2, $3)', [experience_id, responseAuthor, responseText]);
  } catch (err) {
    // If there's an error, log it to the console
    console.error("Error inserting response:", err);
  } finally {
    // Close the database connection
    await client.end();
  }

  // Redirect the user back to the home page after submitting the response
  res.redirect('/');
}

// Export the functions so they can be used in other parts of the application
module.exports = {
  getHomePage,
  getAboutPage,
  getSubmitPage,
  postNewExperience,
  postResponse
};