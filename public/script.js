// Function to handle user login
function login() {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  // Check if username and password are not blank
  if (username.trim() === '' || password.trim() === '') {
    document.getElementById('loginErrorMessage').innerText = 'Username and password cannot be blank.';
    document.getElementById('loginErrorMessage').style.display = 'block';
    return;
  }

  fetch('http://localhost:3000/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username, password })
  })
    .then(response => response.json())
    .then(data => {
      if (data.message === 'Invalid credentials') {
        document.getElementById('loginErrorMessage').innerText = 'Invalid credentials. Please try again.';
        document.getElementById('loginErrorMessage').style.display = 'block';
      } else if (data.encryption_key) {
        // The user is logged in. Use the encryption_key as needed.
        // For example, you can store it in a cookie or local storage for later use.
        document.getElementById('loginForm').style.display = 'none';
        document.getElementById('loggedInHeader').style.display = 'block';
        document.getElementById('loggedInMessage').style.display = 'block';
        document.getElementById('logoutButton').style.display = 'block'; // Show the Logout button

        // Store login status in local storage
        localStorage.setItem('loggedIn', 'true');
      }
    })
    .catch(error => {
      console.error('Error:', error);
      document.getElementById('loginErrorMessage').innerText = 'An error occurred. Please try again later.';
      document.getElementById('loginErrorMessage').style.display = 'block';
    });
}

// Function to handle user logout
function logout() {
  // Clear the login status from local storage
  localStorage.removeItem('loggedIn');

  // Show the login form and hide the "Logged In" elements
  document.getElementById('loginForm').style.display = 'block';
  document.getElementById('loggedInHeader').style.display = 'none';
  document.getElementById('loggedInMessage').style.display = 'none';
  document.getElementById('logoutButton').style.display = 'none'; // Hide the Logout button
}

// Function to show logged-in state when the page loads
function showLoggedInState() {
  const isLoggedIn = localStorage.getItem('loggedIn') === 'true';

  if (isLoggedIn) {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('loggedInHeader').style.display = 'block';
    document.getElementById('loggedInMessage').style.display = 'block';
    document.getElementById('logoutButton').style.display = 'block'; // Show the Logout button
  }
}

// Call the function to show the logged-in state when the page loads
showLoggedInState();