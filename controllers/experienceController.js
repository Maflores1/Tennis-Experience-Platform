// Import the Pool class from the 'pg' module to interact with PostgreSQL
const { Pool } = require("pg");
require('dotenv').config(); // Load environment variables from .env file

// Create a new pool instance for managing database connections
const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Use the DATABASE_URL from the .env file
});

// Function to fetch messages and their responses from the database
async function getHomePage(req, res) {
  try {
    // Enhanced query to get user information with experiences
    const experiencesResult = await pool.query(`
      SELECT t.*, u.username as user_username, u.first_name, u.last_name, u.university
      FROM tennis t
      LEFT JOIN users u ON t.user_id = u.id
      ORDER BY t.added DESC
    `);
    const experiences = experiencesResult.rows;

    // Get responses for each experience with user information
    for (let exp of experiences) {
      const responsesResult = await pool.query(`
        SELECT r.*, u.username as user_username, u.first_name, u.last_name
        FROM responses r
        LEFT JOIN users u ON r.user_id = u.id
        WHERE r.experience_id = $1
        ORDER BY r.added ASC
      `, [exp.id]);
      exp.responses = responsesResult.rows;
    }

    res.render('index', { 
      title: 'Tennis Experience Board', 
      experiences,
      user: req.user || null // Passport.js provides req.user
    });
  } catch (err) {
    console.error("Error fetching messages:", err);
    res.render('index', { 
      title: 'Tennis Experience Board', 
      experiences: [],
      user: req.user || null
    });
  }
}


// Function to render the new message submission form
function getSubmitPage(req, res) {
  // Check if user is authenticated (Passport.js way)
  if (!req.isAuthenticated()) {
    return res.redirect('/login');
  }

  res.render('submit', { 
    title: 'New Message',
    user: req.user
  });
}

// Function to handle new message submission
async function postNewExperience(req, res) {
  // Check if user is authenticated (Passport.js way)
  if (!req.isAuthenticated()) {
    return res.redirect('/login');
  }

  const { text, category } = req.body;
  const userId = req.user.id;
  const author = req.user.username; // Get the logged-in user's username

  try {
    await pool.query(
      'INSERT INTO tennis (author, text, category, user_id) VALUES ($1, $2, $3, $4)', 
      [author, text, category, userId]
    );
    console.log("New experience added successfully by user:", author);
    res.redirect('/');
  } catch (err) {
    console.error("Error inserting message:", err);
    res.redirect('/submit');
  }
}

// Function to handle responses to experiences
async function postResponse(req, res) {
  // Check if user is authenticated (Passport.js way)
  if (!req.isAuthenticated()) {
    return res.redirect('/login');
  }

  const { experience_id, responseText } = req.body;
  const userId = req.user.id;
  const responseAuthor = req.user.username; // Get the logged-in user's username

  try {
    await pool.query(
      'INSERT INTO responses (experience_id, author, text, user_id) VALUES ($1, $2, $3, $4)', 
      [experience_id, responseAuthor, responseText, userId]
    );
    console.log("Response added successfully by user:", responseAuthor);
    res.redirect('/');
  } catch (err) {
    console.error("Error inserting response:", err);
    res.redirect('/');
  }
}

// Function to get user profile page
async function getUserProfile(req, res) {
  if (!req.isAuthenticated()) {
    return res.redirect('/login');
  }

  try {
    // Get user's experiences
    const experiencesResult = await pool.query(
      'SELECT * FROM tennis WHERE user_id = $1 ORDER BY added DESC',
      [req.user.id]
    );

    // Get user's responses
    const responsesResult = await pool.query(`
      SELECT r.*, t.text as experience_text, t.category, t.author as exp_author
      FROM responses r 
      JOIN tennis t ON r.experience_id = t.id 
      WHERE r.user_id = $1 
      ORDER BY r.added DESC
    `, [req.user.id]);

    res.render('profile', {
      title: 'My Profile',
      user: req.user,
      experiences: experiencesResult.rows,
      responses: responsesResult.rows
    });

  } catch (err) {
    console.error("Error fetching user profile:", err);
    res.redirect('/');
  }
}

// Export the functions so they can be used in other parts of the application
module.exports = {
  getHomePage,
  getSubmitPage,
  postNewExperience,
  postResponse,
  getUserProfile
};