export const API_URL = 'http://localhost:8080/api/v1';

import { login } from '../api/userApi.js';

export function decodeJWT(token) {
  const parts = token.split(".");

  if (parts.length !== 3) {
    throw new Error("JWT inválido");
  }

  const base64UrlDecode = (str) => {
    str = str.replace(/-/g, "+").replace(/_/g, "/");

    const pad = str.length % 4;

    if (pad) {
      str += "=".repeat(4 - pad);
    }

    return JSON.parse(atob(str));
  };

  const payload = base64UrlDecode(parts[1]);

  return {
    username: payload.sub || null,
    id: payload.userId || null,
    roles: payload.roles || []
  };
}


export function getCurrentUser() {

  const token = localStorage.getItem("jwtToken");

  if (!token) {
    return null;
  }

  return decodeJWT(token);
}