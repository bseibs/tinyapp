const express = require("express");
const app = express();
const PORT = 8080;

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

// Set view engine to EJS
app.set("view engine", "ejs");

// Middleware to parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// URL database
const urlDatabase = {
  b2xVn2: "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
};

// POST route to handle new URLs
app.post("/urls", (req, res) => {
  // Extract the long URL from the request body
  const longURL = req.body.longURL;

  // Generate a random short URL ID
  const shortURL = generateRandomString(6);

  // Save the mapping to the URL database
  urlDatabase[shortURL] = longURL;

  // Redirect to the page showing the new URL
  res.redirect(`/urls/${shortURL}`);
});

// Route to render homepage
app.get("/", (req, res) => {
  res.send("Hello!");
});

// Route to render list of URLs
app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
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

// Start the server
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
