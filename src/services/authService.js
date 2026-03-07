import api from "./api";

const unwrap = (response) => response?.data;

export const authService = {
  login: async (payload) => unwrap(await api.post("/login", payload)),
  register: async (payload) => unwrap(await api.post("/register", payload)),
  me: async () => unwrap(await api.get("/me")),
  logout: async () => unwrap(await api.post("/logout")),
};
