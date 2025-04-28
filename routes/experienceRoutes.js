const { Router } = require("express");
const {
  getHomePage,
  getAboutPage,
  getSubmitPage,
  postNewExperience,
  postResponse // Import the postResponse function
} = require("../controllers/experienceController.js");

const experienceRouter = Router();

// Define the routes
experienceRouter.get("/", getHomePage); // Home page route
experienceRouter.get("/about", getAboutPage); // About page route
experienceRouter.get("/submit", getSubmitPage); // Route to render the submit page
experienceRouter.post("/experiences", postNewExperience); // Route to submit new experiences
experienceRouter.post("/responses", postResponse); // Route to submit responses

module.exports = experienceRouter;