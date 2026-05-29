import { createProject } from "../../api/projectApi.js";
import { renderProjects } from "./renderProjects.js";
import { decodeJWT } from "../../api/configApi.js";
import { getAllUsers } from "../../api/userApi.js";

export async function renderCreateProject() {

  const users = await getAllUsers();

  const modalHTML = `
  <div class="modal fade" id="createProjectModal" tabindex="-1">

    <div class="modal-dialog modal-lg modal-dialog-centered">

      <div class="modal-content shadow-lg border-0 rounded-4">

        <!-- HEADER -->
        <div class="modal-header border-0">
          <h5 class="modal-title fw-bold">Create Project</h5>
          <button class="btn-close" data-bs-dismiss="modal"></button>
        </div>

        <!-- BODY -->
        <div class="modal-body px-4 pb-4">

          <!-- NAME -->
          <div class="mb-3">
            <label class="form-label fw-semibold">Project name</label>
            <input
              id="createName"
              class="form-control form-control-lg"
              placeholder="e.g. Task Manager API"/>
          </div>

          <!-- DESCRIPTION -->
          <div class="mb-3">
            <label class="form-label fw-semibold">Description</label>
            <textarea
              id="createDescription"
              class="form-control"
              rows="5"
              placeholder="Project description..."></textarea>
          </div>

          <!-- OWNER -->
          <div class="mb-2">
            <label class="form-label fw-semibold">Owner</label>

            <select id="createOwner" class="form-select form-select-lg">

              <option value="">Select owner...</option>

              ${users.map(u => `
                <option value="${u.id}">
                  ${u.username} (${u.email}) - ${u.roles?.map(r => r.name).join(", ")}
                </option>
              `).join("")}

            </select>

          </div>

        </div>

        <!-- FOOTER -->
        <div class="modal-footer border-0 px-4 pb-4">

          <button class="btn btn-outline-secondary" data-bs-dismiss="modal">
            Cancel
          </button>

          <button class="btn btn-primary px-4" id="saveProject">
            Create project
          </button>

        </div>

      </div>

    </div>

  </div>
  `;

  document.body.insertAdjacentHTML("beforeend", modalHTML);

  const modalElement = document.getElementById("createProjectModal");
  const modal = new bootstrap.Modal(modalElement);
  modal.show();

  document.getElementById("saveProject")
    .addEventListener("click", async () => {

      try {

        const projectData = {
          name: document.getElementById("createName").value,
          description: document.getElementById("createDescription").value,

          // 👇 ID del usuario seleccionado
          owner: Number(document.getElementById("createOwner").value)
        };

        await createProject(projectData);

        modal.hide();

        const token = localStorage.getItem("jwtToken");
        const user = decodeJWT(token);

        renderProjects(user);

      } catch (err) {
        alert(err.message);
      }

    });

  modalElement.addEventListener("hidden.bs.modal", () => {
    modalElement.remove();
  });

}