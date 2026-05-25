import { getAllProjects, getProjectByUserId } from "../../api/projectApi.js";
import { renderProjectDetail } from "./renderProjectDetail.js";
import { renderCreateProject } from "./renderCreateProject.js";

export async function renderTasks(user) {

  const content = document.getElementById("appContent");

  const isAdmin = user.roles.includes("ADMIN");

  const projects = isAdmin
    ? await getAllProjects()
    : await getProjectByUserId(user.id);

  content.innerHTML = `
    <div class="card p-4 shadow-sm">

      <!-- HEADER -->
      <div class="d-flex justify-content-between align-items-center mb-3">

        <h2 class="mb-0">📁 Projects</h2>

        ${isAdmin ? `
          <button class="btn btn-outline-primary btn-sm" id="createProjectBtn">
            + Create Project
          </button>
        ` : ""}

      </div>

      ${
        projects?.length
          ? projects.map(project => `
            <div class="border rounded p-3 mb-3 project-card"
                style="cursor:pointer"
                data-id="${project.id}">

              <h5>${project.name}</h5>
              <p class="text-muted">${project.description || ""}</p>

              <div class="d-flex gap-2">

                <span class="badge text-primary-emphasis bg-primary-subtle border border-primary-subtle">
                  Tasks: ${project.tasksDto?.length ?? 0}
                </span>

                <span class="badge text-success-emphasis bg-success-subtle border border-success-subtle">
                  Users: ${project.usersDto?.length ?? 0}
                </span>

              </div>

            </div>
          `).join("")
          : `<p class="text-muted">No projects found.</p>`
      }

    </div>
  `;

  // OPEN PROJECT
  document.querySelectorAll(".project-card").forEach(card => {
    card.addEventListener("click", () => {
      const id = card.dataset.id;
      renderProjectDetail(id);
    });
  });

  // CREATE PROJECT (ADMIN ONLY)
  const createBtn = document.getElementById("createProjectBtn");

  if (createBtn) {
    createBtn.addEventListener("click", () => {
      renderCreateProject();
    });
  }
}