import { getProjectById } from "../../api/projectApi.js";
import { renderEditProject } from "./renderEditProject.js";
import { renderDeleteProject } from "./renderDeleteProject.js";
import { renderAssignOwner } from "./renderAssignOwner.js";
import { decodeJWT } from "../../api/configApi.js";

export async function renderProjectDetail(id) {

  const content = document.getElementById("appContent");

  const token = localStorage.getItem("jwtToken");
  const user = decodeJWT(token) || {};

  const permissions = user.permissions || [];
  const has = (perm) => permissions.includes(perm);

  const can = {
    createTask: has("tasks:create"),
    assignUser: has("users:update") || has("users:create"),
    editProject: has("projects:update"),
    deleteProject: has("projects:delete"),
  };

  // 🔥 FIRST: LOAD PROJECT
  const project = await getProjectById(id);

  // 🔥 ROLE ORDER
  const roleOrder = {
    ADMIN: 1,
    MANAGER: 2,
    DEVELOPER: 3,
    USER: 4
  };

  const sortedUsers = [...(project.users || [])].sort((a, b) => {
    const priorityA = Math.min(
      ...((a.roles || []).map(r => roleOrder[r.name] || 999))
    );

    const priorityB = Math.min(
      ...((b.roles || []).map(r => roleOrder[r.name] || 999))
    );

    return priorityA - priorityB;
  });

  // 🔥 TASK ORDER
  const taskOrder = {
    TODO: 1,
    IN_PROGRESS: 2,
    REVIEW: 3,
    TESTING: 4,
    DONE: 5
  };

  const sortedTasks = [...(project.tasks || [])].sort((a, b) => {
    return (
      (taskOrder[a.status] || 999) -
      (taskOrder[b.status] || 999)
    );
  });

  content.innerHTML = `
    <div class="container py-4">

      <!-- HEADER -->
      <div class="card p-3 mb-3 shadow-sm">

        <div class="d-flex justify-content-between align-items-start">

          <div>

            <h2 class="mb-1 fw-semibold">
              ${project.name}
            </h2>

            ${project.owner ? `
              <div class="d-flex align-items-center gap-2 mb-2">

                <span class="badge bg-dark-subtle text-dark border">
                  👤 Project Manager
                </span>

                <div class="d-flex flex-column">

                  <span class="fw-medium small">
                    ${project.owner.username || "Unknown"}
                  </span>

                  <small class="text-muted">
                    ${project.owner.email || ""}
                  </small>

                </div>

              </div>
            ` : ""}

            <p class="text-muted mb-0">
              ${project.description || "No description provided"}
            </p>

          </div>

          <!-- ACTIONS -->
          <div class="d-flex flex-wrap gap-2 justify-content-end align-items-center">

            ${can.createTask ? `
              <button class="btn btn-outline-primary btn-sm" id="assignTaskBtn">
                ➕ Task
              </button>
            ` : ""}

            ${can.assignUser ? `
              <button class="btn btn-outline-success btn-sm" id="assignUserBtn">
                👤 User
              </button>
            ` : ""}

            ${(can.editProject || can.deleteProject) ? `
              <div class="vr"></div>
            ` : ""}

            ${can.assignUser ? `
              <button class="btn btn-outline-secondary btn-sm" id="changeOwnerBtn">
                👤 Project Manager
              </button>
            ` : ""}

            ${can.editProject ? `
              <button class="btn btn-outline-warning btn-sm" id="editProject">
                ✏️ Edit
              </button>
            ` : ""}

            ${can.deleteProject ? `
              <button class="btn btn-outline-danger btn-sm" id="deleteProject">
                🗑️ Delete
              </button>
            ` : ""}

          </div>

        </div>

      </div>

      <div class="row">

        <!-- TASKS -->
        <div class="col-md-8">

          <div class="card border-0 shadow-sm p-3">

            <h5 class="mb-3">
              📝 Tasks (${project.tasks?.length || 0})
            </h5>

            ${sortedTasks.map(task => `
              <div
                class="border rounded p-3 mb-2 task-card position-relative"
                style="cursor:pointer"
                data-id="${task.id}"
              >

                <span class="badge position-absolute top-0 end-0 m-2 ${
                  task.status === "DONE"
                    ? "bg-success"
                    : task.status === "IN_PROGRESS"
                    ? "bg-warning text-dark"
                    : "bg-secondary"
                }">
                  ${task.status}
                </span>

                <strong class="d-block mb-1">
                  ${task.name}
                </strong>

                <p class="mb-0 text-muted small">
                  ${task.description || ""}
                </p>

              </div>
            `).join("")}

          </div>

        </div>

        <!-- USERS -->
        <div class="col-md-4">

          <div class="card border-0 shadow-sm p-3">

            <h5 class="mb-3">
              👥 Users (${project.users?.length || 0})
            </h5>

            ${sortedUsers.map(u => `
              <div
                class="border rounded p-3 mb-2 user-card"
                style="cursor:pointer"
                data-id="${u.id}"
              >

                <div class="d-flex justify-content-between align-items-start mb-1">

                  <strong>${u.username}</strong>

                  <span class="badge bg-primary-subtle text-primary border">
                    ${(u.roles || []).map(r => r.name).join(", ")}
                  </span>

                </div>

                <small class="text-muted d-block">
                  ${u.email}
                </small>

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
      console.log("Open task:", task.dataset.id);
    });
  });

  // USER DETAIL
  document.querySelectorAll(".user-card").forEach(userCard => {
    userCard.addEventListener("click", () => {
      console.log("Open user:", userCard.dataset.id);
    });
  });

  // EDIT PROJECT
  document.getElementById("editProject")
    ?.addEventListener("click", () => renderEditProject(id));

  // DELETE PROJECT
  document.getElementById("deleteProject")
    ?.addEventListener("click", () => renderDeleteProject(id));

  // ASSIGN TASK
  document.getElementById("assignTaskBtn")
    ?.addEventListener("click", () => renderAssignTask(id));

  // ASSIGN USER
  document.getElementById("assignUserBtn")
    ?.addEventListener("click", () => renderAssignUser(id));

  // CHANGE OWNER
  document.getElementById("changeOwnerBtn")
    ?.addEventListener("click", () => {
      renderAssignOwner(id, project.owner?.id);
    });
}