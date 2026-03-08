import api from "./api";

export const departmentService = {
  getDepartments: () => api.get("/departments").then((res) => res.data),
  createDepartment: (payload) =>
    api.post("/departments", payload).then((res) => res.data),
  updateDepartment: (id, payload) =>
    api.put(`/departments/${id}`, payload).then((res) => res.data),
  deleteDepartment: (id) =>
    api.delete(`/departments/${id}`).then((res) => res.data),
};
