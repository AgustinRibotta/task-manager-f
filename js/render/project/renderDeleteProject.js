import { deleteProject } from "../../api/projectApi.js";
import { renderProjects } from "./renderProjects.js";
import { decodeJWT } from "../../api/configApi.js";

export function renderDeleteProject(id) {

  const modalHTML = `
    <div class="modal fade" id="deleteProjectModal" tabindex="-1">

      <div class="modal-dialog modal-sm">
        <div class="modal-content">

          <div class="modal-header">
            <h5 class="modal-title">Delete Project</h5>
            <button class="btn-close" data-bs-dismiss="modal"></button>
          </div>

          <div class="modal-body">
            <p>Are you sure you want to delete this project?</p>
          </div>

          <div class="modal-footer">
            <button class="btn btn-secondary" data-bs-dismiss="modal">
              Cancel
            </button>

            <button class="btn btn-danger" id="confirmDeleteBtn">
              Delete
            </button>
          </div>

        </div>
      </div>

    </div>
  `;

  document.body.insertAdjacentHTML("beforeend", modalHTML);

  const modalEl = document.getElementById("deleteProjectModal");
  const modal = new bootstrap.Modal(modalEl);
  modal.show();

  document.getElementById("confirmDeleteBtn").addEventListener("click", async () => {

    try {

      await deleteProject(id);

      modal.hide();

      modalEl.addEventListener("hidden.bs.modal", () => {
        modalEl.remove();
      });
      
      const token = localStorage.getItem("jwtToken");
      const user = decodeJWT(token);

      renderProjects(user);

    } catch (err) {
      alert(err.message);
    }

  });
}