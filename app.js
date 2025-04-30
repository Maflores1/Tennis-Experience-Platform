//FINAL PROJECT WEB DEV - MATEO FLORES, GONZALO DOMINGO, MAIRIN DUFFY

// Import the required modules
const express = require("express");
const path = require("node:path");
const experienceRoutes = require("./routes/experienceRoutes.js");

const app = express(); // Create an instance of the Express application

// Set the views directory and view engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Middleware to parse URL-encoded data
app.use(express.urlencoded({ extended: true }));

// Serve static files (CSS, JS)
app.use(express.static(path.join(__dirname, "public")));

// Define routes
app.use("/", experienceRoutes); // Use the experience routes for handling requests

// Home page route
app.get("/", (req, res) => {
  res.render("index"); // Render the home page (index.ejs)
});

// About page route
app.get("/about", (req, res) => {
  res.render("about"); // Render the about page (about.ejs)
});

// Submit page route
app.get("/submit", (req, res) => {
  res.render("submit"); // Render the submit page (submit.ejs)
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Tennis Experience Board - listening on port ${PORT}!`);
});