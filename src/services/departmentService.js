import api from "./api";

export const departmentService = {
  getDepartments: () => api.get("/departments").then((res) => res.data)
};
