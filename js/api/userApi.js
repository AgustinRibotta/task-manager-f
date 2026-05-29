import { API_URL } from './configApi.js';

// Login function
export async function login(username, password) {
  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username, password })
  });

  if (!response.ok) {
    throw new Error('Login failed');
  }

  const data = await response.json();
  localStorage.setItem('jwtToken', data.jwtToken);
  return data.jwtToken;
}

// Logout function
export function logout() {
  localStorage.removeItem("jwtToken");
  window.location.href = "../html/login.html";  
}

// Get user profile
export async function getUserById(userId) {
  const token = localStorage.getItem('jwtToken');
  const response = await fetch(`${API_URL}/users/${userId}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    throw new Error('Failed to fetch user profile');
  }

  return await response.json();
}

// Get all users 
export async function getAllUsers() {
  const token = localStorage.getItem('jwtToken');
  const response = await fetch(`${API_URL}/users`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    throw new Error('Failed to fetch users');
  }

  return await response.json();
}
