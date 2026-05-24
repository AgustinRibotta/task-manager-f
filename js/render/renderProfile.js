import { getUserById } from "../api/userApi.js";

export async function renderProfile(id) {

  const container = document.getElementById("appContent");

  try {

    const response = await getUserById(id);

    container.innerHTML = `
    <div class="card p-4 shadow-sm">

        <h2 class="mb-3">👤 Profile</h2>

        <!-- BASIC INFO -->
        <div class="mb-3">
        <p><strong>ID:</strong> ${response.id}</p>
        <p><strong>Username:</strong> ${response.username}</p>
        <p><strong>Email:</strong> ${response.email}</p>
        </div>

        <hr />

        <!-- ROLES -->
        <div class="mb-3">
        <h5>Roles</h5>
        <ul>
            ${response.roleDto.map(role => `
            <li>${role.name || role}</li>
            `).join("")}
        </ul>
        </div>

        <hr />

        <!-- PROJECTS -->
        <div class="mb-3">
        <h5>Projects</h5>

        ${response.projectResponseDto.length > 0
            ? response.projectResponseDto.map(project => `
                <div class=" rounded p-2 mb-2">
                <strong>${project.name}</strong>
                </div>
            `).join("")
            : "<p>No projects</p>"
        }
        </div>

        <hr />

        <!-- TASKS -->
        <div class="mb-3">
        <h5>Tasks</h5>

        ${response.taskDto.length > 0
            ? response.taskDto.map(task => `
                <div class=" rounded p-2 mb-2">
                <p class="mb-0">${task.title || task.name || "Task"}</p>
                </div>
            `).join("")
            : "<p>No tasks</p>"
        }
        </div>

    </div>
    `;
  } catch (error) {
    container.innerHTML = `<p>Error loading profile</p>`;
    console.error(error);
  }
}