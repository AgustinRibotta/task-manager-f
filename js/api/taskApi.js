import { API_URL } from './configApi.js';

// Get all tasks
export async function getAllTasks() {
  const token = localStorage.getItem('jwtToken');
  const response = await fetch(`${API_URL}/tasks/all`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch tasks');
  }
    return await response.json();
}

// Get task by ID
export async function getTaskById(taskId) {
  const token = localStorage.getItem('jwtToken');
  const response = await fetch(`${API_URL}/tasks/task/${taskId}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch task');
  }
    return await response.json();
}

// Get tasks by user ID
export async function getTasksByUserId(userId) {
  const token = localStorage.getItem('jwtToken');
  const response = await fetch(`${API_URL}/tasks/userId/${userId}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch user tasks');
  }
    return await response.json();
}

// Create new task
export async function createTask(taskData) {
  const token = localStorage.getItem('jwtToken');
  const response = await fetch(`${API_URL}/tasks/task/new`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(taskData)
  });
  
  if (!response.ok) {
    throw new Error('Failed to create task');
  }
    return await response.json();
}

// Update task by ID
export async function updateTask(taskId, taskData) {
  const token = localStorage.getItem('jwtToken');
  const response = await fetch(`${API_URL}/tasks/task/${taskId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(taskData)
  });
  
  if (!response.ok) {
    throw new Error('Failed to update task');
  }
    return await response.json();
}

// Delete task by ID
export async function deleteTask(taskId) {
  const token = localStorage.getItem('jwtToken');
  const response = await fetch(`${API_URL}/tasks/task/${taskId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  if (!response.ok) {
    throw new Error('Failed to delete task');
  }
    return true;
}