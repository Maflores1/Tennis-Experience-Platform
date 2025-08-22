// Import the Router class from the 'express' module to create a new router
const { Router } = require("express");

// Import the controller functions that handle the requests
const {
    getHomePage,      // Function to get the home page
    getSubmitPage,    // Function to render the submit page
    postNewExperience, // Function to handle new experience submissions
    postResponse,     // Function to handle responses to experiences
    getUserProfile    // Function to get user profile page
} = require("../controllers/experienceController.js");

const experienceRouter = Router(); // Create a new router instance

// Middleware to protect routes
function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login"); // Redirect to login if not authenticated
}

// Define the routes
experienceRouter.get("/", getHomePage); // Home page route
experienceRouter.get("/submit", isAuthenticated, getSubmitPage); // Protected route to render the submit page
experienceRouter.get("/profile", isAuthenticated, getUserProfile); // Protected route for user profile
experienceRouter.post("/experiences", isAuthenticated, postNewExperience); // Protected route to submit new experiences
experienceRouter.post("/responses", isAuthenticated, postResponse); // Protected route to submit responses

module.exports = experienceRouter; // Export the experienceRouter so it can be used in other parts of the application