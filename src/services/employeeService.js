import api from "./api";

export const employeeService = {
  getEmployees: (params) => api.get("/employees", { params }).then((res) => res.data),
  updateEmployee: (id, payload) =>
    api.put(`/employees/${id}`, payload).then((res) => res.data),
  deleteEmployee: (id) => api.delete(`/employees/${id}`).then((res) => res.data)
};
