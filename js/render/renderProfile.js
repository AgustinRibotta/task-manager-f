import { getUserById } from "../api/userApi.js";

export async function renderProfile(id) {

  const container = document.getElementById("appContent");

  try {

    const response = await getUserById(id);

    // 🔥 formatter bonito
    const formatPermission = (perm) => {
      const map = {
        read: { label: "View", icon: "👁️" },
        create: { label: "Create", icon: "➕" },
        update: { label: "Edit", icon: "✏️" },
        delete: { label: "Delete", icon: "🗑️" }
      };

      const [resource, action] = perm.split(":");
      const meta = map[action] || { label: action, icon: "🔹" };

      return {
        module: resource,
        text: `${meta.icon} ${meta.label} ${resource}`
      };
    };

    // 🔥 sacar permisos desde roles
    const permissions = [
      ...new Map(
        response.roles
          .flatMap(r => r.permissions || [])
          .map(p => [p.name, p])
      ).values()
    ];

    // 🔥 agrupar por módulo
    const groupedPermissions = permissions.reduce((acc, p) => {

      const { module, text } = formatPermission(p.name);

      if (!acc[module]) acc[module] = [];

      acc[module].push(text);

      return acc;

    }, {});

    container.innerHTML = `
    <div class="container py-4">

      <div class="card shadow-sm border-0 rounded-4 p-4">

        <!-- HEADER -->
        <div class="mb-4">
          <h2 class="fw-bold mb-1">👤 Profile</h2>
          <p class="text-muted mb-0">User permissions grouped by module</p>
        </div>

        <!-- BASIC INFO -->
        <div class="mb-4">
          <div class="row g-2">

            <div class="col-md-4">
              <div class="p-3 border rounded-3">
                <small class="text-muted">Username</small>
                <div class="fw-semibold">${response.username}</div>
              </div>
            </div>

            <div class="col-md-4">
              <div class="p-3 border rounded-3">
                <small class="text-muted">Email</small>
                <div class="fw-semibold">${response.email}</div>
              </div>
            </div>

          </div>
        </div>

        <hr />

        <!-- ROLES -->
        <div class="mb-4">
          <h5 class="mb-2">Roles</h5>

          <div class="d-flex flex-wrap gap-2">
            ${response.roles.map(role => `
              <span class="badge bg-primary px-3 py-2">
                ${role.name || role}
              </span>
            `).join("")}
          </div>
        </div>

        <hr />

        <!-- PERMISSIONS GROUPED -->
        <div class="mb-4">
          <h5 class="mb-3">Permissions</h5>

          ${
            Object.keys(groupedPermissions).length > 0
              ? Object.entries(groupedPermissions).map(([module, perms]) => `
                <div class="mb-3">

                  <div class="fw-bold text-uppercase text-muted mb-2">
                    ${module}
                  </div>

                  <div class="d-flex flex-wrap gap-2">
                    ${perms.map(p => `
                      <span class="badge rounded-pill bg-secondary-subtle text-dark border px-3 py-2">
                        ${p}
                      </span>
                    `).join("")}
                  </div>

                </div>
              `).join("")
              : `<p class="text-muted">No permissions</p>`
          }
        </div>

        <hr />

        <!-- PROJECTS -->
        <div class="mb-4">
          <h5 class="mb-2">Projects</h5>

          ${response.projects.length > 0
            ? response.projects.map(project => `
                <div class="p-2 border rounded-3 mb-2">
                  <strong>${project.name}</strong>
                </div>
            `).join("")
            : "<p class='text-muted'>No projects</p>"
          }
        </div>

        <hr />

        <!-- TASKS -->
        <div class="mb-2">
          <h5 class="mb-2">Tasks</h5>

          ${response.tasks.length > 0
            ? response.tasks.map(task => `
                <div class="p-2 border rounded-3 mb-2">
                  ${task.title || task.name || "Task"}
                </div>
            `).join("")
            : "<p class='text-muted'>No tasks</p>"
          }
        </div>

      </div>
    </div>
    `;

  } catch (error) {
    container.innerHTML = `<p>Error loading profile</p>`;
    console.error(error);
  }
}