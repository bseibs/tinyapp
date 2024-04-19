const express = require("express");
const app = express();
const PORT = 8080;
const cookieSession = require("cookie-session");

// Function to generate a random alphanumeric string
function generateRandomString(length) {
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let randomString = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    randomString += charset[randomIndex];
  }
  return randomString;
}

// CookieSession middleware
app.use(
  cookieSession({
    name: "session",
    keys: ["tinyapp1", "tinyapp2"],

    // Cookie Options
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  })
);

// Set view engine to EJS
app.set("view engine", "ejs");

// Middleware to parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// URL database
const urlDatabase = {
  b2xVn2: "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
};

// Route to render login page
app.get("/login", (req, res) => {
  if (req.session.username) {
    res.redirect(`/urls`);
  } else {
    res.render(`login`);
  }
});

// Route to render homepage
app.get("/", (req, res) => {
  if (req.session.username) {
    res.redirect(`/urls`);
  } else {
    res.redirect(`/login`);
  }
});
// Route to render a register page

// Middleware to check if the user is logged in
app.use((req, res, next) => {
  res.locals.loggedIn = !!req.session.username;
  next();
});

// Route to render list of URLs
app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase, username: req.session.username };
  res.render("urls_index", templateVars);
});

// Route to render form for creating a new URL
app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

// Route to render details of a specific URL
app.get("/urls/:id", (req, res) => {
  const id = req.params.id;
  const longURL = urlDatabase[id];

  if (longURL) {
    const templateVars = { id: id, longURL: longURL };
    res.render("urls_show", templateVars);
  } else {
    res.status(404).send("URL not found");
  }
});

// Redirect any request to "/u/:id" to its longURL
app.get("/u/:id", (req, res) => {
  const id = req.params.id;
  const longURL = urlDatabase[id];

  if (longURL) {
    res.redirect(longURL); // Redirect to the longURL
  } else {
    res.status(404).send("URL not found");
  }
});

// POST route to handle deletion of a URL resource
app.post("/urls/:id/delete", (req, res) => {
  const id = req.params.id;

  // Check if the URL exists in the database
  if (urlDatabase[id]) {
    // Use JavaScript's delete operator to remove the URL
    delete urlDatabase[id];
    // Redirect the client back to the urls_index page ("/urls")
    res.redirect("/urls");
  } else {
    // If the URL doesn't exist, send a 404 error response
    res.status(404).send("URL not found");
  }
});

// POST route to update a URL resource
app.post("/urls/:id", (req, res) => {
  const id = req.params.id;
  const newLongURL = req.body.longURL;

  // Check if the URL exists in the database
  if (urlDatabase[id]) {
    // Update the value of the stored long URL based on the new value in req.body
    urlDatabase[id] = newLongURL;
    // Redirect the client back to /urls
    res.redirect("/urls");
  } else {
    // If the URL doesn't exist, send a 404 error response
    res.status(404).send("URL not found");
  }
});

// POST route to handle login
app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  // Here you would typically validate the email and password
  // For now, let's just set a cookie with the username/email
  req.session.username = email;

  // Redirect to /urls after successful login
  res.redirect("/urls");
});

// POST route to handle logout
app.post("/logout", (req, res) => {
  // Clear the username cookie
  req.session = null;

  // Redirect the user back to the /urls page
  res.redirect("/urls");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
