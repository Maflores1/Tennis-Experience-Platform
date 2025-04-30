// Import the Router class from the 'express' module to create a new router
const { Router } = require("express");

// Import the controller functions that handle the requests
const {
    getHomePage,      // Function to get the home page
    getAboutPage,     // Function to get the about page
    getSubmitPage,    // Function to render the submit page
    postNewExperience, // Function to handle new experience submissions
    postResponse      // Function to handle responses to experiences
  } = require("../controllers/experienceController.js");

const experienceRouter = Router(); // Create a new router instance

// Define the routes
experienceRouter.get("/", getHomePage); // Home page route
experienceRouter.get("/about", getAboutPage); // About page route
experienceRouter.get("/submit", getSubmitPage); // Route to render the submit page
experienceRouter.post("/experiences", postNewExperience); // Route to submit new experiences
experienceRouter.post("/responses", postResponse); // Route to submit responses

module.exports = experienceRouter; // Export the experienceRouter so it can be used in other parts of the application