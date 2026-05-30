import { getAllUsers } from "../../api/userApi.js";
import { updateProjectOwner } from "../../api/projectApi.js";
import { renderProjectDetail } from "./renderProjectDetail.js";

export async function renderAssignOwner(projectId, currentOwnerId) {
  const users = await getAllUsers();

  const modalHTML = `
    <div class="modal fade" id="assignOwnerModal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">

          <div class="modal-header">
            <h5 class="modal-title">Assign Owner</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal">
            </button>
          </div>

          <div class="modal-body">
            <select id="ownerSelect" class="form-select">
              ${users
                .map(
                  user => `
                    <option
                      value="${user.id}"
                      ${user.id === currentOwnerId ? "selected" : ""}
                    >
                      ${user.username} ${user.email}
                    </option>
                  `
                )
                .join("")}
            </select>
          </div>

          <div class="modal-footer">
            <button
              class="btn btn-outline-danger"
              data-bs-dismiss="modal">
              Cancel
            </button>

            <button
              class="btn btn-outline-primary"
              id="saveOwner">
              Save
            </button>
          </div>

        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML("beforeend", modalHTML);

  const modalElement = document.getElementById("assignOwnerModal");
  const modal = new bootstrap.Modal(modalElement);

  modal.show();

  document.getElementById("saveOwner").addEventListener("click", async () => {
    const ownerId = document.getElementById("ownerSelect").value;

    await updateProjectOwner(projectId, ownerId);

    modal.hide();

    renderProjectDetail(projectId);
  });

  modalElement.addEventListener("hidden.bs.modal", () => {
    modalElement.remove();
  });
}