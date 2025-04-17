// In-memory array to store experiences
let experiences = [];

// Function to fetch experiences (for the home page)
function getHomePage(req, res) {
  res.render('index', { title: 'Tennis Experience Board', experiences }); // Render the home page with experiences
}

// Function to render the about page
function getAboutPage(req, res) {
  res.render('about'); // Render the about page
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
  postNewExperience
};