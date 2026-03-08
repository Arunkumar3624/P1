import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { employeeService } from "../services/employeeService";
import { departmentService } from "../services/departmentService";
import { useDebounce } from "../hooks/useDebounce";
import StatusBadge from "../components/UI/StatusBadge";
import TableSkeleton from "../components/UI/TableSkeleton";
import EmptyState from "../components/UI/EmptyState";
import EmployeeEditModal from "../components/UI/EmployeeEditModal";

const sortOptions = [
  { label: "Newest", value: "createdAt:desc" },
  { label: "Joining Date", value: "joiningDate:desc" },
  { label: "Salary High", value: "salary:desc" },
  { label: "Salary Low", value: "salary:asc" }
];

export default function EmployeesPage() {
  const { user } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [meta, setMeta] = useState({ page: 1, totalPages: 1, total: 0, limit: 10 });
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("createdAt:desc");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [departments, setDepartments] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState("");
  const [departmentName, setDepartmentName] = useState("");
  const [editingDepartmentId, setEditingDepartmentId] = useState("");
  const [departmentSaving, setDepartmentSaving] = useState(false);
  const [departmentDeletingId, setDepartmentDeletingId] = useState("");

  const debouncedSearch = useDebounce(search, 400);
  const [sortBy, sortOrder] = useMemo(() => sort.split(":"), [sort]);
  const canManageEmployees = Boolean(user);

  const loadEmployees = async (page = 1) => {
    try {
      setLoading(true);
      const response = await employeeService.getEmployees({
        page,
        limit: meta.limit,
        search: debouncedSearch,
        sortBy,
        sortOrder
      });
      setEmployees(response.data);
      setMeta(response.meta);
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadDepartments = async () => {
    try {
      const response = await departmentService.getDepartments();
      setDepartments(response.data);
    } catch {
      setDepartments([]);
    }
  };

  useEffect(() => {
    loadDepartments();
  }, []);

  useEffect(() => {
    loadEmployees(1);
  }, [debouncedSearch, sort]);

  const handlePageChange = (nextPage) => {
    if (nextPage < 1 || nextPage > meta.totalPages) return;
    loadEmployees(nextPage);
  };

  const handleDelete = async (id) => {
    setError("");
    setDeletingId(id);
    const previous = employees;
    setEmployees((curr) => curr.filter((employee) => employee.id !== id));
    try {
      await employeeService.deleteEmployee(id);
      const nextCount = previous.length - 1;
      if (nextCount <= 0 && meta.page > 1) {
        await loadEmployees(meta.page - 1);
      } else {
        await loadEmployees(meta.page);
      }
    } catch (err) {
      setEmployees(previous);
      setError(err.message);
    } finally {
      setDeletingId("");
    }
  };

  const handleSave = async (payload) => {
    if (!selectedEmployee) return;
    try {
      setSaving(true);
      setError("");
      const response = await employeeService.updateEmployee(selectedEmployee.id, payload);
      setEmployees((curr) =>
        curr.map((item) => (item.id === selectedEmployee.id ? response.data : item))
      );
      setSelectedEmployee(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleCreate = async (payload) => {
    try {
      setSaving(true);
      setError("");
      await employeeService.createEmployee(payload);
      setIsAddModalOpen(false);
      await loadEmployees(1);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const resetDepartmentForm = () => {
    setDepartmentName("");
    setEditingDepartmentId("");
  };

  const handleDepartmentSubmit = async () => {
    const normalizedName = departmentName.trim();
    if (!normalizedName) {
      setError("Department name is required.");
      return;
    }

    try {
      setDepartmentSaving(true);
      setError("");
      if (editingDepartmentId) {
        await departmentService.updateDepartment(editingDepartmentId, {
          name: normalizedName,
        });
      } else {
        await departmentService.createDepartment({ name: normalizedName });
      }
      await loadDepartments();
      resetDepartmentForm();
    } catch (err) {
      setError(err.message);
    } finally {
      setDepartmentSaving(false);
    }
  };

  const handleDepartmentEdit = (department) => {
    setEditingDepartmentId(department.id);
    setDepartmentName(department.name);
    setError("");
  };

  const handleDepartmentDelete = async (id) => {
    try {
      setDepartmentDeletingId(id);
      setError("");
      await departmentService.deleteDepartment(id);
      if (editingDepartmentId === id) {
        resetDepartmentForm();
      }
      await loadDepartments();
    } catch (err) {
      setError(err.message);
    } finally {
      setDepartmentDeletingId("");
    }
  };

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-panel">
        <div>
          <h2 className="font-display text-lg font-semibold text-navy">Employee Directory</h2>
          <p className="text-sm text-slate-500">{meta.total} records</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {canManageEmployees && (
            <button
              type="button"
              onClick={() => {
                setError("");
                setIsAddModalOpen(true);
              }}
              className="rounded-lg bg-actionBlue px-3 py-2 text-sm font-semibold text-white"
            >
              Add Employee
            </button>
          )}
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, designation..."
            className="w-64 rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && <p className="rounded-lg bg-rose-100 p-3 text-sm text-rose-700">{error}</p>}

      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-panel">
        <h3 className="font-display text-base font-semibold text-navy">Manage Departments</h3>
        <p className="mt-1 text-xs text-slate-500">
          Create departments here, then use them while adding employees.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <input
            value={departmentName}
            onChange={(e) => setDepartmentName(e.target.value)}
            placeholder="Department name"
            className="w-72 rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
          <button
            type="button"
            onClick={handleDepartmentSubmit}
            disabled={departmentSaving}
            className="rounded-lg bg-actionBlue px-3 py-2 text-sm font-semibold text-white disabled:opacity-60"
          >
            {departmentSaving
              ? "Saving..."
              : editingDepartmentId
                ? "Update Department"
                : "Add Department"}
          </button>
          {editingDepartmentId && (
            <button
              type="button"
              onClick={resetDepartmentForm}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
            >
              Cancel Edit
            </button>
          )}
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {departments.map((department) => (
            <div
              key={department.id}
              className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2"
            >
              <span className="text-sm font-medium text-slate-700">{department.name}</span>
              <button
                type="button"
                onClick={() => handleDepartmentEdit(department)}
                className="rounded-md bg-actionBlue px-2 py-1 text-xs font-semibold text-white"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => handleDepartmentDelete(department.id)}
                disabled={departmentDeletingId === department.id}
                className="rounded-md bg-rose-500 px-2 py-1 text-xs font-semibold text-white disabled:opacity-60"
              >
                {departmentDeletingId === department.id ? "Deleting..." : "Delete"}
              </button>
            </div>
          ))}
        </div>
      </div>

      {loading ? (
        <TableSkeleton rows={8} />
      ) : employees.length === 0 ? (
        <EmptyState
          title="No employees match your filters"
          description="Try widening your search or adjusting sorting preferences."
        />
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-panel">
          <div className="max-h-[580px] overflow-auto">
            <table className="w-full min-w-[980px] text-left text-sm">
              <thead className="sticky top-0 z-10 bg-navy text-xs uppercase tracking-wide text-slate-200">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Department</th>
                  <th className="px-4 py-3">Designation</th>
                  <th className="px-4 py-3">Salary</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((employee, idx) => (
                  <tr key={employee.id} className={idx % 2 ? "bg-slate-50" : "bg-white"}>
                    <td className="px-4 py-3 font-medium text-slate-800">
                      {employee.firstName} {employee.lastName}
                    </td>
                    <td className="px-4 py-3 text-slate-600">{employee.email}</td>
                    <td className="px-4 py-3 text-slate-600">{employee.department?.name || "N/A"}</td>
                    <td className="px-4 py-3 text-slate-600">{employee.designation}</td>
                    <td className="px-4 py-3 text-slate-600">${Number(employee.salary).toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={employee.status} />
                    </td>
                    <td className="px-4 py-3">
                      {canManageEmployees ? (
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => setSelectedEmployee(employee)}
                            className="rounded-md bg-actionBlue px-3 py-1 text-xs font-semibold text-white"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(employee.id)}
                            disabled={deletingId === employee.id}
                            className="rounded-md bg-rose-500 px-3 py-1 text-xs font-semibold text-white disabled:opacity-60"
                          >
                            {deletingId === employee.id ? "Deleting..." : "Delete"}
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs font-semibold text-slate-400">View Only</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between border-t border-slate-200 p-3">
            <button
              type="button"
              onClick={() => handlePageChange(meta.page - 1)}
              className="rounded border border-slate-300 px-3 py-1 text-xs disabled:opacity-40"
              disabled={meta.page === 1}
            >
              Previous
            </button>
            <span className="text-xs text-slate-500">
              Page {meta.page} of {meta.totalPages}
            </span>
            <button
              type="button"
              onClick={() => handlePageChange(meta.page + 1)}
              className="rounded border border-slate-300 px-3 py-1 text-xs disabled:opacity-40"
              disabled={meta.page >= meta.totalPages}
            >
              Next
            </button>
          </div>
        </div>
      )}

      <EmployeeEditModal
        isOpen={isAddModalOpen}
        mode="create"
        employee={null}
        departments={departments}
        saving={saving}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleCreate}
        errorMessage={error}
      />

      <EmployeeEditModal
        isOpen={Boolean(selectedEmployee)}
        mode="edit"
        employee={selectedEmployee}
        departments={departments}
        saving={saving}
        onClose={() => setSelectedEmployee(null)}
        onSave={handleSave}
        errorMessage={error}
      />
    </section>
  );
}
