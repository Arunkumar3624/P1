import api from "./api";

const unwrap = (response) => response?.data;

export const authService = {
  login: async (payload) => unwrap(await api.post("/auth/login", payload)),
  register: async (payload) =>
    unwrap(await api.post("/auth/register", payload)),
  me: async () => unwrap(await api.get("/auth/me")),
  logout: async () => unwrap(await api.post("/auth/logout")),
};
