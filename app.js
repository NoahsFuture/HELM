const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(express.static('public')); // Serve static files from the "public" directory

// Read the users data from the users.json file
const usersData = fs.readFileSync('./users.json', 'utf8');
const users = JSON.parse(usersData).users;

// Read the encryption key and IV from the config.json file
const configData = fs.readFileSync('./config.json', 'utf8');
const config = JSON.parse(configData);

// Endpoint to log in the user
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  const user = users.find(u => u.username === username && u.password === password);

  if (!user) {
    return res.status(401).json({ "message": "Invalid credentials" });
  }

  // Generate a session token using the 'uuid' library
  const sessionToken = uuidv4();

  // Set the session token as a secure HTTP cookie (you may want to set secure: true in production)
  res.cookie('sessionToken', sessionToken, { httpOnly: true, sameSite: 'strict' });

  user.ip = req.ip;
  res.json({ "message": "Login successful", "encryption_key": config.encryption_key, "iv": config.iv });
});

// Endpoint to log out the user and reset the "LoggedIn" status to false
app.post('/logout', (req, res) => {
  const { username } = req.body;

  const user = users.find(u => u.username === username);
  if (!user) {
    return res.status(401).json({ "message": "User not found" });
  }

  // Set the "LoggedIn" status to false
  user.LoggedIn = false;

  res.json({ "message": "Logout successful" });
});

// Endpoint to check if the user is logged in and return the encryption key and IV
app.post('/check_login', (req, res) => {
  const { sessionToken } = req.cookies;

  if (!sessionToken) {
    return res.status(401).json({ "message": "User not logged in" });
  }

  // Here, you would typically validate the session token and retrieve the user's data from the session
  // For simplicity, we'll assume the session token is valid and retrieve the user data from the users array based on the sessionToken
  const user = users.find(u => u.sessionToken === sessionToken);

  if (!user) {
    return res.status(401).json({ "message": "User not logged in" });
  }

  res.json({ "message": "User is logged in", "encryption_key": config.encryption_key, "iv": config.iv });
});

// Serve the index.html file when the root path is accessed
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// Start the server
const PORT = 3000; // You can choose any available port
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});