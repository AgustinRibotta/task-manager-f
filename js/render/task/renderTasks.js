import { getAllTasks, getTasksByUserId } from "../../api/taskApi.js";

export async function renderTasks(user) {
  const content = document.getElementById("appContent");

  const isAdmin = user.roles.includes("ADMIN");

  const tasks = isAdmin
    ? await getAllTasks()
    : await getTasksByUserId(user.id);

  // 👇 helper: si el usuario está asignado a la task
  const isAssignedToUser = (task, user) =>
    task.users?.some(u => u.id === user.id);

  const grouped = tasks.reduce((acc, task) => {
    const project = task.project;
    const key = project?.id ?? "my-tasks";

    if (!acc[key]) {
      acc[key] = {
        project,
        tasks: []
      };
    }

    acc[key].tasks.push(task);

    return acc;
  }, {});

  content.innerHTML = `
    <div class="p-4">

      <!-- HEADER -->
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h2 class="mb-0">📝 Task</h2>

        ${isAdmin ? `
          <button class="btn btn-outline-primary" id="createTaskBtn">
            + Create Task
          </button>
        ` : ""}
      </div>

      <!-- GRID -->
      <div class="d-flex flex-wrap gap-3">

        ${Object.values(grouped).map(group => `

          <div class="border rounded p-3 shadow-sm"
               style="width: 320px; background: #fff;">

            <!-- TITLE -->
            <h5 class="mb-3">
              📁 ${group.project?.name ?? "My Tasks"}
            </h5>

            <!-- TASK LIST -->
            ${group.tasks.map(task => `

              <div class="border rounded p-2 mb-2 project-card position-relative"
                   style="cursor:pointer"
                   data-id="${task.id}">

                <!-- ⭐ SOLO ADMIN + ASIGNADO -->
                ${isAdmin && isAssignedToUser(task, user) ? `
                  <span class="badge bg-warning text-dark position-absolute top-0 end-0 m-1">
                    Assigned
                  </span>
                ` : ""}

                <strong>${task.name}</strong>

                <p class="mb-1 small text-muted">
                  ${task.description || ""}
                </p>

                <span class="badge text-success-emphasis bg-success-subtle border border-success-subtle">
                  Users: ${task.users?.length ?? 0}
                </span>

              </div>

            `).join("")}

          </div>

        `).join("")}

      </div>
    </div>
  `;

  // CLICK HANDLER
  document.querySelectorAll(".project-card").forEach(card => {
    card.addEventListener("click", () => {
      const id = card.getAttribute("data-id");
      renderTaskDetail(id);
    });
  });

  // CREATE TASK
  const createBtn = document.getElementById("createTaskBtn");
  if (createBtn) {
    createBtn.addEventListener("click", () => {
      renderCreateTask();
    });
  }
}