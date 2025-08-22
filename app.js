// FINAL PROJECT WEB DEV - MATEO FLORES, GONZALO DOMINGO, MAIRIN DUFFY

// Import the required modules
const express = require("express");
const path = require("node:path");
const experienceRoutes = require("./routes/experienceRoutes.js");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const { Pool } = require("pg");
require('dotenv').config();

const app = express();

// Set the views directory and view engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Middleware to parse URL-encoded data
app.use(express.urlencoded({ extended: true }));

// Serve static files (CSS, JS)
app.use(express.static(path.join(__dirname, "public")));

// Configure Express Session
app.use(session({
  secret: process.env.SESSION_SECRET || "your_secret_key_change_in_production",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // Set to true if using HTTPS in production
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// PostgreSQL connection pool setup
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Test database connection
pool.connect()
  .then(() => console.log("Connected to the PostgreSQL database"))
  .catch(err => console.error("Database connection error:", err.stack));

// Configure Passport Local Strategy
passport.use(new LocalStrategy(
  { usernameField: 'username' }, // Can also accept email
  async (username, password, done) => {
    try {
      // Allow login with username or email
      const res = await pool.query(
        'SELECT * FROM users WHERE username = $1 OR email = $1', 
        [username]
      );
      const user = res.rows[0];
      
      if (!user) {
        return done(null, false, { message: "Invalid username or email." });
      }
      
      const match = await bcrypt.compare(password, user.password);
      if (match) {
        return done(null, user);
      } else {
        return done(null, false, { message: "Incorrect password." });
      }
    } catch (err) {
      console.error("Authentication error:", err);
      return done(err);
    }
  }
));

// Serialize user
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user
passport.deserializeUser(async (id, done) => {
  try {
    const res = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    const user = res.rows[0];
    done(null, user);
  } catch (err) {
    console.error("Deserialize user error:", err);
    done(err);
  }
});

// Registration route
app.post("/register", async (req, res) => {
  const { username, email, password, confirmPassword, firstName, lastName, university } = req.body;
  
  // Basic validation
  if (password !== confirmPassword) {
    return res.render("register", { 
      user: null, 
      error: "Passwords do not match" 
    });
  }
  
  if (password.length < 6) {
    return res.render("register", { 
      user: null, 
      error: "Password must be at least 6 characters long" 
    });
  }

  try {
    // Check if user already exists
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE username = $1 OR email = $2',
      [username, email]
    );

    if (existingUser.rows.length > 0) {
      return res.render("register", { 
        user: null, 
        error: "Username or email already exists" 
      });
    }

    // Hash password and create user
    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query(
      'INSERT INTO users (username, email, password, first_name, last_name, university) VALUES ($1, $2, $3, $4, $5, $6)', 
      [username, email, hashedPassword, firstName, lastName, university]
    );
    
    res.render("login", { 
      user: null, 
      success: "Registration successful! Please log in." 
    });
  } catch (err) {
    console.error("Registration error:", err);
    res.render("register", { 
      user: null, 
      error: "Registration failed. Please try again." 
    });
  }
});

// Login route
app.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      console.error("Login error:", err);
      return res.render("login", { 
        user: null, 
        error: "Login failed. Please try again.",
        success: null 
      });
    }
    
    if (!user) {
      return res.render("login", { 
        user: null, 
        error: info.message || "Invalid credentials",
        success: null 
      });
    }
    
    req.logIn(user, (err) => {
      if (err) {
        console.error("Login error:", err);
        return res.render("login", { 
          user: null, 
          error: "Login failed. Please try again.",
          success: null 
        });
      }
      return res.redirect("/");
    });
  })(req, res, next);
});

// Logout route
app.post("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error("Logout error:", err);
    }
    res.redirect("/");
  });
});

// Middleware to protect routes
function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

// Make pool available to routes (if needed)
app.locals.pool = pool;

// Define routes
app.use("/", experienceRoutes);

// Login page route
app.get("/login", (req, res) => {
  res.render("login", { 
    user: req.user || null,
    error: null,
    success: null
  });
});

// Registration page route
app.get("/register", (req, res) => {
  res.render("register", { 
    user: req.user || null,
    error: null 
  });
});

// Submit page route (protected)
app.get("/submit", isAuthenticated, (req, res) => {
  res.render("submit", { user: req.user });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Tennis Experience Board - listening on port ${PORT}!`);
});