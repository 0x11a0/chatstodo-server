/**
 * user.test.js
 * 
 * This script tests the user-related functionalities of the server API using Axios.
 * We'll cover:
 * 1. Registering a new user.
 * 2. Logging in an existing user.
 * 3. Retrieving the authenticated user's profile.
 * 4. Logging out the user from the current device.
 * 5. Logging out the user from all devices.
 * 
 * It's designed for educational purposes to showcase how HTTP requests can be made 
 * using Axios and how to handle their responses.
 */

require('dotenv').config();
const axios = require('axios');

// Base URL of your server, defaulting to localhost.
const BASE_URL = 'http://localhost:3000/api'; 

// Sample user data for testing.
const testUser = {
  username: 'testUser5',
  email: 'test5@example.com',
  password: 'password123'
};

// Variable to store the token after successful login.
let userToken;

/**
 * Test function to register a new user.
 */
async function registerUser() {
  try {
    const response = await axios.post(`${BASE_URL}/users/register`, testUser);
    console.log('User registered:', response.data);
  } catch (error) {
    console.error('Error registering user:', error.response.data);
  }
}

/**
 * Test function to log in an existing user and store the token.
 */
async function loginUser() {
  try {
    const response = await axios.post(`${BASE_URL}/users/login`, {
      email: testUser.email,
      password: testUser.password
    });
    console.log('User logged in:', response.data);
    userToken = response.data.token;
  } catch (error) {
    console.error('Error logging in:', error.response.data);
  }
}

/**
 * Test function to retrieve the profile of the logged-in user.
 */
async function getProfile() {
  try {
    const response = await axios.get(`${BASE_URL}/users/me`, {
      headers: {
        Authorization: `Bearer ${userToken}`
      }
    });
    console.log('User profile:', response.data);
  } catch (error) {
    console.error('Error fetching profile:', error.response.data);
  }
}

/**
 * Test function to log out the user from the current device.
 */
async function logout() {
  try {
    await axios.post(`${BASE_URL}/users/logout`, {}, {
      headers: {
        Authorization: `Bearer ${userToken}`
      }
    });
    console.log('Logged out from current device.');
  } catch (error) {
    console.error('Error during logout:', error.response.data);
  }
}

/**
 * Test function to log out the user from all devices.
 */
async function logoutAll() {
  try {
    await axios.post(`${BASE_URL}/users/logoutAll`, {}, {
      headers: {
        Authorization: `Bearer ${userToken}`
      }
    });
    console.log('Logged out from all devices.');
  } catch (error) {
    console.error('Error during logout from all devices:', error.response.data);
  }
}

// Sequence to run the tests one after the other.
(async function() {
  await registerUser();
  await loginUser();
  await getProfile();
  await logout();
  await loginUser(); // Login again to test logoutAll
  await logoutAll();
})();
