import {
  getAllProjects,
  getProjectByUserId
} from "../../api/projectApi.js";

import { renderProjectDetail } from "./renderProjectDetail.js";
import { renderCreateProject } from "./renderCreateProject.js";

export async function renderProjects(user) {

  const content = document.getElementById("appContent");

  const isGlobalAdmin = user.roles.includes("ADMIN");

  const projects = isGlobalAdmin
    ? await getAllProjects()
    : await getProjectByUserId(user.id);

  // 👇 usuario con rol ADMIN dentro del proyecto
  const isAdminInProject = (project, user) =>
    project.users?.some(u =>
      u.id === user.id && u.roles?.some(r => r.name === "ADMIN")
    );

  content.innerHTML = `
    <div class="p-4">

      <!-- HEADER -->
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h2 class="mb-0">📁 Projects</h2>

        ${isGlobalAdmin ? `
          <button class="btn btn-outline-primary" id="createProjectBtn">
            + Create Project
          </button>
        ` : ""}
      </div>

      <!-- GRID -->
      <div class="d-flex flex-wrap gap-3">

        ${projects.map(project => `

          <div class="border rounded p-3 shadow-sm position-relative project-card"
               style="width: 320px; cursor: pointer;"
               data-id="${project.id}">

            <!-- 👑 ADMIN EN PROYECTO -->
            ${isAdminInProject(project, user) ? `
              <span class="badge bg-warning text-dark position-absolute top-0 end-0 m-2">
                Assigned
              </span>
            ` : ""}

            <h5 class="mb-2">${project.name}</h5>

            <p class="text-muted small">
              ${project.description || ""}
            </p>

            <div class="d-flex gap-2 flex-wrap">

              <span class="badge text-primary-emphasis bg-primary-subtle border border-primary-subtle">
                Tasks: ${project.tasks?.length ?? 0}
              </span>

              <span class="badge text-success-emphasis bg-success-subtle border border-success-subtle">
                Users: ${project.users?.length ?? 0}
              </span>

            </div>

          </div>

        `).join("")}

      </div>
    </div>
  `;

  // CLICK
  document.querySelectorAll(".project-card").forEach(card => {
    card.addEventListener("click", () => {
      const id = card.getAttribute("data-id");
      renderProjectDetail(id);
    });
  });

  // CREATE
  const createBtn = document.getElementById("createProjectBtn");
  if (createBtn) {
    createBtn.addEventListener("click", () => {
      renderCreateProject();
    });
  }
}