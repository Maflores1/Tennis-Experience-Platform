// In-memory array to store experiences
let experiences = [
  {
    author: "Mateo",
    text: "I had a really hard match yesterday, but what helped me the most was staying positive!",
    category: "College Tournament",
    added: new Date()
  },
  {
    author: "Arthur",
    text: "Tennis practice in the USA is not the same as in Brazil. We really need to practice extra to be able to keep up our level.",
    category: "College Practice",
    added: new Date()
  }

];


// Function to fetch experiences (for the home page)
function getHomePage(req, res) {
  res.render('index', { title: 'Tennis Experience Board', experiences }); // Render the home page with experiences
}

// Function to render the about page
function getAboutPage(req, res) {
  res.render('about'); // Render the about page
}

// Function to render the submit experience form
function getSubmitPage(req, res) {
  res.render('submit'); // Render the submit page
}

// Function to handle new experience submission
function postNewExperience(req, res) {
  const { author, text, category } = req.body; // Get data from the form

  // Create a new experience object
  const newExperience = {
    author,
    text,
    category,
    added: new Date() // Add a timestamp
  };

  // Push the new experience to the in-memory array
  experiences.push(newExperience);

  res.redirect('/'); // Redirect to the home page after submission
}

module.exports = {
  getHomePage,
  getAboutPage,
  getSubmitPage, // Export the new function
  postNewExperience
};