import axios from "axios";
import {
  LOGIN_USER,
  REGISTER_USER,
  AUTH_USER,
  AUTHENTICATE_USER,
} from "./type";

export function loginUser(dataToSubmit) {
  const request = axios
    .post("/api/users/login", dataToSubmit)
    .then((response) => {
      return response.data;
    });

  return { type: LOGIN_USER, payload: request };
}
export function registerUser(dataToSubmit) {
  const request = axios
    .post("/api/users/register", dataToSubmit)
    .then((response) => response.data);

  return { type: REGISTER_USER, payload: request };
}
export function auth() {
  const request = axios
    .get("/api/users/auth")
    .then((response) => response.data);

  return { type: AUTH_USER, payload: request };
}

export function authenticateUser(dataToSubmit) {
  const request = axios
    .post("/api/users/authentication", null, {
      headers: {
        "x-auth": dataToSubmit,
      },
    })
    .then((response) => response.data);

  return { type: AUTHENTICATE_USER, payload: request };
}
