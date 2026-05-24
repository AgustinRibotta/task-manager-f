import { login } from "../api/userApi.js";
import { decodeJWT } from "../api/configApi.js";

export function initLoginForm() {

  const form = document.getElementById("loginForm");

  form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    try {

      // LOGIN
      const token = await login(username, password);

      // DECODIFICAR
      const user = decodeJWT(token);

      const isAdmin = user.roles.includes("ADMIN");
      
      window.location.href = "./dashboard.html";
      
    } catch (err) {

      alert(err.message);

    }
  });
}