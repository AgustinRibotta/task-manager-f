import { decodeJWT } from "./api/configApi.js";
import { logout } from "./api/userApi.js";
import { renderProfile } from "./render/renderProfile.js";
import { renderHome } from "./render/renderHome.js";
import { renderProjects } from "./render/project/renderProjects.js";

document.addEventListener("DOMContentLoaded", () => {

  const token = localStorage.getItem("jwtToken");

  if (!token) {
    window.location.href = "../html/login.html";
    return;
  }

  const user = decodeJWT(token);

  // HOME PAGE
  renderHome(user);
  const home = document.getElementById("navDashboard");
  if (home) {
    home.addEventListener("click", (e) => {
      e.preventDefault();
      renderHome(user);
    });
  }

  // ROLES
  const isAdmin = user.roles.includes("ADMIN");

  const navUsers = document.getElementById("navUsers");
  const navRoles = document.getElementById("navRoles");

  if (!isAdmin) {
    if (navUsers) navUsers.style.display = "none";
    if (navRoles) navRoles.style.display = "none";
  }

  // USERNAME
  const userElement = document.getElementById("sidebarUser");

  if (userElement) {
    userElement.textContent = user.username;
  }

  // ACTIVE LINK PROJECTS
  const navProjects = document.getElementById("navProjects");
  if (navProjects) {
    navProjects.addEventListener("click", (e) => {
      e.preventDefault();
      renderProjects(user);
    });
  }



  // PROFILE
  const profileLink = document.getElementById("navProfile");

  if (profileLink) {
    profileLink.addEventListener("click", (e) => {
      e.preventDefault();

      const token = localStorage.getItem("jwtToken");
      const user = decodeJWT(token);

      renderProfile(user.id);
    });
  }

  // LOGOUT
  const btn = document.getElementById("logoutBtn");

  if (btn) {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      logout();
    });
  }

});