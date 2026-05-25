import { createProject } from "../../api/projectApi.js";
import { renderProjects } from "./renderProjects.js";
import { decodeJWT } from "../../api/configApi.js";

export function renderCreateProject() {

  const modalHTML = `
    <div class="modal fade" id="createProjectModal" tabindex="-1">

      <div class="modal-dialog modal-lg">

        <div class="modal-content">

          <div class="modal-header">
            <h5 class="modal-title">Create Project</h5>
            <button class="btn-close" data-bs-dismiss="modal"></button>
          </div>

          <div class="modal-body">

            <input
              id="createName"
              class="form-control mb-3"
              placeholder="Project Name"/><textarea
              id="createDescription"
              class="form-control"
              rows="6"
              placeholder="Project Description"></textarea>

          </div>

          <div class="modal-footer">

            <button
              class="btn btn-outline-danger"
              data-bs-dismiss="modal">
              Cancel
            </button>

            <button
              class="btn btn-outline-primary"
              id="saveProject">
              Create
            </button>

          </div>

        </div>

      </div>

    </div>
  `;

  // insertar modal
  document.body.insertAdjacentHTML("beforeend", modalHTML);

  const modalElement = document.getElementById("createProjectModal");

  const modal = new bootstrap.Modal(modalElement);

  modal.show();

  // CREATE
  document.getElementById("saveProject")
    .addEventListener("click", async () => {

      try {

        const projectData = {
          name: document.getElementById("createName").value,
          description: document.getElementById("createDescription").value
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

  // limpiar DOM
  modalElement.addEventListener("hidden.bs.modal", () => {
    modalElement.remove();
  });

}