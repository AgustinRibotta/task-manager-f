import { getAllTasks, getTasksByUserId } from "../../api/taskApi.js";

export async function renderTasks(user) {
  const content = document.getElementById("appContent");

  const isAdmin = user.roles.includes("ADMIN");

  const permissions = user.permissions || [];
  const has = (perm) => permissions.includes(perm);

  const can = {
    viewAllTasks: has("tasks:read:all"),
    createTask: has("tasks:create"),
  };

  const tasks = isAdmin
    ? await getAllTasks()
    : await getTasksByUserId(user.id);

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
    <div class="container py-4">

      <!-- HEADER -->
      <div class="d-flex justify-content-between align-items-center mb-4">

        <div>
          <h2 class="mb-0">📝 Tasks</h2>
          <small class="text-muted">Manage and track your work</small>
        </div>

        ${can.createTask ? `
          <button class="btn btn-primary shadow-sm" id="createTaskBtn">
            + Create Task
          </button>
        ` : ""}

      </div>

      <!-- GRID -->
      <div class="row g-3">

        ${Object.values(grouped).map(group => `

          <div class="col-md-4">

            <div class="card border-0 shadow-sm h-100">

              <!-- HEADER -->
              <div class="card-header bg-white border-0">
                <h5 class="mb-0">
                  📁 ${group.project?.name ?? "My Tasks"}
                </h5>
                <small class="text-muted">
                  ${group.tasks.length} tasks
                </small>
              </div>

              <!-- BODY -->
              <div class="card-body">

                ${group.tasks.map(task => `

                  <div class="border rounded p-2 mb-2 task-card position-relative"
                       style="cursor:pointer"
                       data-id="${task.id}">

                    <!-- BADGE -->
                    ${isAdmin && isAssignedToUser(task, user) ? `
                      <span class="badge bg-warning text-dark position-absolute top-0 end-0 m-1">
                        Assigned
                      </span>
                    ` : ""}

                    <strong class="d-block">
                      ${task.name}
                    </strong>

                    <small class="text-muted d-block mb-2">
                      ${task.description || "No description"}
                    </small>

                    <div class="d-flex justify-content-between">

                      <span class="badge bg-success-subtle text-success border">
                        👥 ${task.users?.length ?? 0}
                      </span>

                      <span class="badge ${
                        task.status === "DONE"
                          ? "bg-success"
                          : task.status === "IN_PROGRESS"
                          ? "bg-warning text-dark"
                          : "bg-secondary"
                      }">
                        ${task.status}
                      </span>

                    </div>
                    <div class="card-footer bg-white border-0 text-muted small">
                      Click to open
                    </div>  
                  </div>

                `).join("")}

              </div>

            </div>

          </div>

        `).join("")}
           
      </div>
    </div>
  `;

  // CLICK TASK
  document.querySelectorAll(".task-card").forEach(card => {
    card.addEventListener("click", () => {
      const id = card.dataset.id;
      console.log("Open task:", id);
      // renderTaskDetail(id);
    });
  });

  // CREATE TASK
  document.getElementById("createTaskBtn")
    ?.addEventListener("click", () => {
      console.log("Create task");
      // renderCreateTask();
    });
}