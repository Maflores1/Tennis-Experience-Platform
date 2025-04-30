# Tennis Experience Board

Welcome to the Tennis Experience Board! This web application allows users to share their tennis experiences, read others' experiences, and respond to them. It is built using Node.js, Express, and PostgreSQL.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)

## Features

- Users can submit their tennis experiences.
- Users can view recent experiences shared by others.
- Users can respond to experiences.
- The application has a user-friendly interface.

## Technologies Used

- **Node.js**: JavaScript runtime for building the server.
- **Express**: Web framework for Node.js.
- **PostgreSQL**: Relational database for storing experiences and responses.
- **EJS**: Templating engine for rendering HTML views.
- **CSS**: For styling the application.

## Installation

Follow these steps to set up the project locally:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/tennis-experience-board.git
   cd tennis-experience-board

Install dependencies: Make sure you have Node.js and npm installed. Then run:
npm install

Set up the PostgreSQL database:
- Ensure you have PostgreSQL installed and running.
- Create a new database: myTennis;
- Then run node models/populatedb.js to connect to the database

## Usage
Start the server:
node app.js

The application will be running on http://localhost:3000.

**Access the application:** Open your web browser and navigate to http://localhost:3000. You will see the Tennis Experience Board interface.

**Submit an experience:** Click on the "Submit Experience" link to share your tennis experience.

**View experiences:** The main page displays recent experiences. You can read them and respond to any experience.

**Toggle response forms:** Click the "Reply" button to show the response form for each experience. After submitting a response, the form will automatically close.
