import { API_URL } from './configApi.js';

// Get all projects
export async function getAllProjects() {
  const token = localStorage.getItem('jwtToken');
  const response = await fetch(`${API_URL}/projects`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch projects');
  }
    return await response.json();
}

// Get project by ID
export async function getProjectById(projectId) {
  const token = localStorage.getItem('jwtToken');
  const response = await fetch(`${API_URL}/projects/${projectId}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch project');
  }
    return await response.json();
}

// Get projects by user ID
export async function getProjectByUserId(userId) {
  const token = localStorage.getItem('jwtToken');
  const response = await fetch(`${API_URL}/projects/user/${userId}/projects`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch user projects');
  }
    return await response.json();
}

// Create new project
export async function createProject(projectData) {
  const token = localStorage.getItem('jwtToken');
  const response = await fetch(`${API_URL}/projects`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(projectData)
  });
  
  if (!response.ok) {
    throw new Error('Failed to create project');
  }
    return await response.json();
}

// Update project by ID
export async function updateProject(projectId, projectData) {
  const token = localStorage.getItem('jwtToken');
  const response = await fetch(`${API_URL}/projects/${projectId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(projectData)
  });
  
  if (!response.ok) {
    throw new Error('Failed to update project');
  }
    return await response.json();
}

// Delete project by ID
export async function deleteProject(projectId) {
  const token = localStorage.getItem('jwtToken');
  const response = await fetch(`${API_URL}/projects/${projectId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  if (!response.ok) {
    throw new Error('Failed to delete project');
  }
    return true;
}