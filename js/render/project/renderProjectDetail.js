import { getProjectById } from "../../api/projectApi.js";
import { renderEditProject } from "./renderEditProject.js";
import { renderDeleteProject } from "./renderDeleteProject.js";
import { decodeJWT } from "../../api/configApi.js";

export async function renderProjectDetail(id) {

  const content = document.getElementById("appContent");

  const token = localStorage.getItem("jwtToken");
  const user = decodeJWT(token);

  const isAdmin = user.roles.includes("ADMIN");

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
          <div class="d-flex flex-wrap gap-2 justify-content-end align-items-center">

            ${isAdmin ? `
              
              <button class="btn btn-outline-primary btn-sm d-flex align-items-center gap-1"
                      id="assignTaskBtn">
                <span>➕</span> Assign Task
              </button>

              <button class="btn btn-outline-success btn-sm d-flex align-items-center gap-1"
                      id="assignUserBtn">
                <span>👤</span> Assign User
              </button>

              <div class="vr"></div>

              <button class="btn btn-outline-warning btn-sm d-flex align-items-center gap-1"
                      id="editProject">
                <span>✏️</span> Edit
              </button>

              <button class="btn btn-outline-danger btn-sm d-flex align-items-center gap-1"
                      id="deleteProject">
                <span>🗑️</span> Delete
              </button>

            ` : ""}

          </div>

        </div>
      </div>

      <div class="row">

        <!-- TASKS -->
        <div class="col-md-8">
          <div class="card p-3 shadow-sm">

            <div class="d-flex justify-content-between align-items-center mb-3">
              <h5 class="mb-0">📝 Tasks (${project.tasks.length})</h5>
            </div>

            ${project.tasks.map(task => `
              <div class="border rounded p-2 mb-2 task-card"
                   style="cursor:pointer"
                   data-id="${task.id}">

                <strong>${task.name}</strong>

                <p class="mb-1">${task.description}</p>

                <span class="badge 
                  ${task.status === "DONE"
                    ? "bg-success"
                    : task.status === "IN_PROGRESS"
                    ? "bg-warning"
                    : "bg-secondary"}">

                  ${task.status}

                </span>

              </div>
            `).join("")}

          </div>
        </div>

        <!-- USERS -->
        <div class="col-md-4">
          <div class="card p-3 shadow-sm">

            <div class="d-flex justify-content-between align-items-center mb-3">
              <h5 class="mb-0">👥 Users (${project.users.length})</h5>
            </div>

            ${project.users.map(users => `
              <div class="border rounded p-2 mb-2 user-card"
                   style="cursor:pointer"
                   data-id="${users.id}">

                <strong>${users.username}</strong>

                <p class="mb-0 text-muted">
                  ${users.roles.map(role => role.name).join(", ")}
                </p>

                <p class="mb-0 text-muted">
                  ${users.email}
                </p>

              </div>
            `).join("")}

          </div>
        </div>

      </div>
    </div>
  `;

  // TASK DETAIL
  document.querySelectorAll(".task-card").forEach(task => {
    task.addEventListener("click", () => {
      const taskId = task.dataset.id;
      console.log("Open task:", taskId);

      // renderTaskDetail(taskId)
    });
  });

  // USER DETAIL
  document.querySelectorAll(".user-card").forEach(userCard => {
    userCard.addEventListener("click", () => {
      const userId = userCard.dataset.id;
      console.log("Open user:", userId);

      // renderUserProfile(userId)
    });
  });

  // EDIT PROJECT
  if (isAdmin) {

    document.getElementById("editProject")
      .addEventListener("click", () => {
        renderEditProject(id);
      });

    document.getElementById("deleteProject")
      .addEventListener("click", () => {
        renderDeleteProject(id);
      });

    // ASSIGN TASK
    document.getElementById("assignTaskBtn")
      .addEventListener("click", () => {
        renderAssignTask(id);
      });

    // ASSIGN USER
    document.getElementById("assignUserBtn")
      .addEventListener("click", () => {
        renderAssignUser(id);
      });

  }

}