import { getProjectById, updateProject } from "../../api/projectApi.js";
import { renderProjectDetail } from "./renderProjectDetail.js";

export async function renderEditProject(id) {

  const project = await getProjectById(id);

  const modalHTML = `
  <div class="modal fade" id="editProjectModal" tabindex="-1">

    <div class="modal-dialog modal-lg">

      <div class="modal-content">

        <div class="modal-header">
          <h5 class="modal-title">Edit Project</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>

        <div class="modal-body">

          <input id="editName" class="form-control mb-3" value="${project.name}" />

          <textarea id="editDescription" class="form-control" rows="6">
  ${project.description}
          </textarea>

        </div>

        <div class="modal-footer">

          <button class="btn btn-secondary" data-bs-dismiss="modal">
            Cancel
          </button>

          <button class="btn btn-primary" id="saveProject">
            Save
          </button>

        </div>

      </div>

    </div>

  </div>
  `;

  document.body.insertAdjacentHTML("beforeend", modalHTML);

  const modalElement = document.getElementById("editProjectModal");

  if (!modalElement) {
    throw new Error("Modal not found in DOM");
  }

  const modal = new bootstrap.Modal(modalElement);
  modal.show();

  document.getElementById("saveProject").addEventListener("click", async () => {

    const updatedProject = {
      name: document.getElementById("editName").value,
      description: document.getElementById("editDescription").value
    };

    await updateProject(id, updatedProject);

    modal.hide();


    project.name = updatedProject.name;
    project.description = updatedProject.description;

    renderProjectDetail(id);
  });

  modalElement.addEventListener("hidden.bs.modal", () => {
    modalElement.remove();
  });
}