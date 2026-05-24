import { getProjectById } from "../../api/projectApi.js";
import { renderEditProject } from "./renderEditProject.js";
import { deleteProject } from "../../api/projectApi.js";
import { renderDeleteProject } from "./renderDeleteProject.js";
import { decodeJWT } from "../../api/configApi.js";

export async function renderProjectDetail(id) {

  const content = document.getElementById("appContent");
  
  const token = localStorage.getItem("jwtToken");
  const user = decodeJWT(token);  
  const isAdmin = user.roles.includes("ADMIN")


  const project = await getProjectById(id);

  content.innerHTML = `
    <div class="container py-4">

      <!-- HEADER -->
      <div class="card p-3 mb-3 shadow-sm">

        <div class="d-flex justify-content-between align-items-start">

          <div>
            <h2>${project.name}</h2>
            <p class="text-muted">${project.description}</p>
          </div>

          <!-- ACTIONS -->
          <div class="d-flex gap-2">
            ${isAdmin ? `
              <button class="btn btn-warning btn-sm" id="editProject">
                Edit
              </button>

              <button class="btn btn-danger btn-sm" id="deleteProject">
                Delete
              </button>
            ` : ""}
          </div>

        </div>
      </div>

      <div class="row">

        <!-- TASKS -->
        <div class="col-md-8">
          <div class="card p-3 shadow-sm">

            <h5>📝 Tasks (${project.tasksDto.length})</h5>

            ${project.tasksDto.map(task => `
              <div class="border rounded p-2 mb-2 task-card"
                   style="cursor:pointer"
                   data-id="${task.id}">

                <strong>${task.name}</strong>
                <p class="mb-1">${task.description}</p>

                <span class="badge 
                  ${task.status === "DONE" ? "bg-success" :
                    task.status === "IN_PROGRESS" ? "bg-warning" :
                    "bg-secondary"}">

                  ${task.status}

                </span>

              </div>
            `).join("")}

          </div>
        </div>

        <!-- USERS -->
        <div class="col-md-4">
          <div class="card p-3 shadow-sm">

            <h5>👥 Users (${project.usersDto.length})</h5>

            ${project.usersDto.map(user => `
              <div class="border rounded p-2 mb-2 user-card"
                   style="cursor:pointer"
                   data-id="${user.id}">

                <strong>${user.username}</strong>
                <p class="mb-0 text-muted">${user.roleDto.map(role => role.name).join(", ")}</p>
                <p class="mb-0 text-muted">${user.email}</p>

              </div>
            `).join("")}

          </div>
        </div>

      </div>
    </div>
  `;

  // TASK CLICK
  document.querySelectorAll(".task-card").forEach(task => {
    task.addEventListener("click", () => {
      const taskId = task.dataset.id;
      console.log("Open task:", taskId);
      // renderTaskDetail(taskId)
    });
  });

  // USER CLICK
  document.querySelectorAll(".user-card").forEach(user => {
    user.addEventListener("click", () => {
      const userId = user.dataset.id;
      console.log("Open user:", userId);
      // renderUserProfile(userId)
    });
  });

  // PROJECT ACTIONS
  document.getElementById("editProject").addEventListener("click", () => {
    renderEditProject(id)
  });

  document.getElementById("deleteProject").addEventListener("click", () => {
    renderDeleteProject(id)
  });

}