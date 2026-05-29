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

  const isOwner = (project, user) =>
    project.owner?.id === user.id;

  const isAdminInProject = (project, user) =>
    project.users?.some(u =>
      u.id === user.id && u.roles?.some(r => r.name === "ADMIN")
    );

  content.innerHTML = `
    <div class="container py-4">

      <!-- HEADER -->
      <div class="d-flex justify-content-between align-items-center mb-4">

        <div>
          <h2 class="mb-0">📁 Projects</h2>
          <small class="text-muted">Manage your workspace projects</small>
        </div>

        ${isGlobalAdmin ? `
          <button class="btn btn-primary shadow-sm" id="createProjectBtn">
            + Create Project
          </button>
        ` : ""}

      </div>

      <!-- GRID -->
      <div class="row g-3">

        ${projects.map(project => `

          <div class="col-md-4">

            <div class="card border-0 shadow-sm project-card h-100 position-relative"
                 style="cursor:pointer;"
                 data-id="${project.id}">

              <!-- BADGES -->
              <div class="position-absolute top-0 end-0 m-2 d-flex gap-1">

                ${isOwner(project, user) ? `
                  <span class="badge bg-dark">
                    Owner
                  </span>
                ` : ""}

                ${isAdminInProject(project, user) ? `
                  <span class="badge bg-warning text-dark">
                    Member
                  </span>
                ` : ""}

              </div>

              <div class="card-body">

                <h5 class="card-title mb-2">
                  ${project.name}
                </h5>

                <p class="card-text text-muted small mb-3">
                  ${project.description || "No description"}
                </p>

                <div class="d-flex justify-content-between">

                  <span class="badge bg-primary-subtle text-primary border">
                    📝 ${project.tasks?.length ?? 0} Tasks
                  </span>

                  <span class="badge bg-success-subtle text-success border">
                    👥 ${project.users?.length ?? 0} Users
                  </span>

                </div>

              </div>

              <div class="card-footer bg-white border-0 text-muted small">
                Click to open
              </div>

            </div>

          </div>

        `).join("")}

      </div>
    </div>
  `;

  // CLICK
  document.querySelectorAll(".project-card").forEach(card => {
    card.addEventListener("click", () => {
      renderProjectDetail(card.dataset.id);
    });
  });

  // CREATE
  document.getElementById("createProjectBtn")
    ?.addEventListener("click", renderCreateProject);
}