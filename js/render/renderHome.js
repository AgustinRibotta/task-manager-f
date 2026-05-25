export function renderHome(user) {

  const container = document.getElementById("appContent");

  const isAdmin = user.roles.includes("ADMIN");
  const isManager = user.roles.includes("MANAGER");

  container.innerHTML = `
    <div class="container py-4">

      <!-- HEADER -->
      <div class="mb-4 p-4 bg-white rounded shadow-sm">
        <h2>👋 Welcome, ${user.username}</h2>
      </div>

      <!-- ROLES -->
      <div class="card mb-4">
        <div class="card-body">
          <h5>🔐 Roles</h5>
          ${user.roles.map(r => `<span class="badge text-primary-emphasis bg-primary-subtle border border-primary-subtle me-1">${r}</span>`).join("")}
        </div>
      </div>

      <!-- MODULES (ONLY IF ALLOWED) -->
      <div class="row g-3">

        ${isAdmin ? `
          <div class="col-md-6">
            <div class="card p-3">
              <h5>👤 Users Module</h5>
              <p>You can manage all users</p>
            </div>
          </div>

          <div class="col-md-6">
            <div class="card p-3">
              <h5>🔐 Roles Module</h5>
              <p>You can manage system roles</p>
            </div>
          </div>
        ` : ""}

        <div class="col-md-6">
          <div class="card p-3">
            <h5>📁 Projects</h5>
            <p>
              ${isAdmin ? "Full access" : isManager ? "Limited management access" : "Read-only access"}
            </p>
          </div>
        </div>

        <div class="col-md-6">
          <div class="card p-3">
            <h5>📝 Tasks</h5>
            <p>
              ${isAdmin ? "Full access" : isManager ? "Limited management access" : "Read-only access"}
            </p>
          </div>
        </div>

      </div>

    </div>
  `;
}