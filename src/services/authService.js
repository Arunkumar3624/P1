import api from "./api";

const unwrap = (response) => response?.data;
const normalizeCredentials = (payload = {}) => ({
  email: String(payload.email || "")
    .trim()
    .toLowerCase(),
  password: String(payload.password || ""),
});

export const authService = {
  login: async (payload) =>
    unwrap(await api.post("/auth/login", normalizeCredentials(payload))),
  register: async (payload) =>
    unwrap(
      await api.post("/auth/register", {
        ...payload,
        email: String(payload?.email || "")
          .trim()
          .toLowerCase(),
      }),
    ),
  me: async () => unwrap(await api.get("/auth/me")),
  logout: async () => unwrap(await api.post("/auth/logout")),
};
