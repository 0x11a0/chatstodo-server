/**
 * user.test.js
 * 
 * This script tests the user-related functionalities of the server API using Axios.
 * We'll cover:
 * 1. Registering a new user.
 * 2. Refreshing all user data.
 * 3. Adding a platform link.
 * 4. Removing a platform link.
 * 5. Retrieving all platform links for a user.
 * 
 */

require('dotenv').config();
const axios = require('axios');

// Base URL of your server, defaulting to localhost.
const BASE_URL = 'http://localhost:3000/api'; 

// Sample user data for testing.
const testUser = {
  username: 'testUser',
  email: 'test@example.com',
  password: 'password123'
};

// Sample platform link data for testing.
const platformLink = {
  platform: "Telegram",
  credentials: {
    token: "abc123",
    otherKey: "value"
  }
};

// Variable to store the user ID after successful registration.
let userId;

/**
 * Test function to register a new user.
 */
async function registerUser() {
  try {
    const response = await axios.post(`${BASE_URL}/users/register`, testUser);
    console.log('User registered:', response.data);
    // Extract userId from response if your API returns it, otherwise adjust as needed
    userId = response.data.userId;
  } catch (error) {
    console.error('Error registering user:', error.response.data);
  }
}

/**
 * Test function to refresh all user data.
 */
async function refreshAllUserData() {
  try {
    const response = await axios.post(`${BASE_URL}/users/${userId}/refreshAll`);
    console.log('Refreshed all user data:', response.data);
  } catch (error) {
    console.error('Error refreshing user data:', error.response.data);
  }
}

/**
 * Test function to add a platform link.
 */
async function addPlatformLink() {
  try {
    const response = await axios.post(`${BASE_URL}/users/${userId}/platforms`, platformLink);
    console.log('Platform link added:', response.data);
  } catch (error) {
    console.error('Error adding platform link:', error.response.data);
  }
}

/**
 * Test function to remove a platform link.
 */
async function removePlatformLink() {
  try {
    const response = await axios.delete(`${BASE_URL}/users/${userId}/platforms`, { data: { platform: platformLink.platform } });
    console.log('Platform link removed:', response.data);
  } catch (error) {
    console.error('Error removing platform link:', error.response.data);
  }
}

/**
 * Test function to retrieve all platform links.
 */
async function getPlatformLinks() {
  try {
    const response = await axios.get(`${BASE_URL}/users/${userId}/platforms`);
    console.log('All platform links:', response.data);
  } catch (error) {
    console.error('Error retrieving platform links:', error.response.data);
  }
}

// Sequence to run the tests one after the other.
(async function() {
  await registerUser();
  await refreshAllUserData();
  await addPlatformLink();
  await removePlatformLink();
  await getPlatformLinks();
})();
