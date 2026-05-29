export function renderHome(user) {

  const container = document.getElementById("appContent");

  const permissions = user.permissions || [];

  const has = (perm) => permissions.includes(perm);

  const canUsers =
    has("users:read") || has("users:read:all");

  const canRoles =
    has("roles:read") || has("roles:read:all");

  const canProjects =
    permissions.some(p => p.startsWith("projects:"));

  const canTasks =
    permissions.some(p => p.startsWith("tasks:"));

  container.innerHTML = `
    <div class="container py-4">

      <!-- HEADER -->
      <div class="mb-4 p-4 bg-white rounded shadow-sm">
        <h2>👋 Welcome, ${user.username}</h2>
        <p class="text-muted mb-0">Dashboard based on JWT permissions</p>
      </div>

      <!-- ROLES -->
      <div class="card mb-4">
        <div class="card-body">
          <h5>🔐 Roles</h5>
          ${user.roles.map(r => `
            <span class="badge bg-primary me-1">
              ${r.name || r}
            </span>
          `).join("")}
        </div>
      </div>

      <!-- MODULES -->
      <div class="row g-3">

        ${canUsers ? `
          <div class="col-md-6">
            <div class="card p-3 shadow-sm">
              <h5>👤 Users Module</h5>
              <p class="text-muted mb-0">
                ${has("users:read:all")
                  ? "Full access"
                  : "Limited access"}
              </p>
            </div>
          </div>
        ` : ""}

        ${canRoles ? `
          <div class="col-md-6">
            <div class="card p-3 shadow-sm">
              <h5>🔐 Roles Module</h5>
              <p class="text-muted mb-0">
                ${has("roles:read:all")
                  ? "Full access"
                  : "Read-only access"}
              </p>
            </div>
          </div>
        ` : ""}

        ${canProjects ? `
          <div class="col-md-6">
            <div class="card p-3 shadow-sm">
              <h5>📁 Projects</h5>
              <p class="text-muted mb-0">
                ${has("projects:delete")
                  ? "Full control"
                  : "Limited access"}
              </p>
            </div>
          </div>
        ` : ""}

        ${canTasks ? `
          <div class="col-md-6">
            <div class="card p-3 shadow-sm">
              <h5>📝 Tasks</h5>
              <p class="text-muted mb-0">
                ${has("tasks:delete")
                  ? "Full control"
                  : "Limited access"}
              </p>
            </div>
          </div>
        ` : ""}

      </div>

    </div>
  `;
}