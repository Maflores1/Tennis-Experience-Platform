const { Router } = require("express");
const { getHomePage, getAboutPage, postNewExperience } = require("../controllers/experienceController.js");
const experienceRouter = Router();

// Define the routes
experienceRouter.get("/", getHomePage); // Home page route
experienceRouter.get("/about", getAboutPage); // About page route
experienceRouter.post("/experiences", postNewExperience); // Route to submit new experiences

module.exports = experienceRouter;