import { useEffect } from "react";
import { useForm } from "react-hook-form";

const formatDateInput = (value) => {
  if (!value) return "";
  if (typeof value === "string" && value.length >= 10) return value.slice(0, 10);
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
};

export default function EmployeeEditModal({
  isOpen,
  mode = "edit",
  employee,
  departments,
  onClose,
  onSave,
  saving,
  errorMessage = "",
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm();

  useEffect(() => {
    reset({
      firstName: employee?.firstName || "",
      lastName: employee?.lastName || "",
      email: employee?.email || "",
      phone: employee?.phone || "",
      departmentId: employee?.departmentId || departments?.[0]?.id || "",
      designation: employee?.designation || "",
      salary: employee?.salary || "",
      status: employee?.status || "Active",
      joiningDate: formatDateInput(employee?.joiningDate),
    });
  }, [employee, departments, reset]);

  const submitHandler = (values) => {
    const payload = {
      firstName: values.firstName.trim(),
      lastName: values.lastName.trim(),
      email: values.email.trim().toLowerCase(),
      phone: values.phone.trim(),
      departmentId: values.departmentId,
      designation: values.designation.trim(),
      salary: Number(values.salary),
      status: values.status,
      joiningDate: values.joiningDate,
    };
    onSave(payload);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-40 grid place-items-center bg-slate-900/40 p-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-panel">
        <h3 className="mb-4 font-display text-xl font-semibold text-navy">
          {mode === "create" ? "Add Employee" : "Edit Employee"}
        </h3>
        <form onSubmit={handleSubmit(submitHandler)} className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <input className="rounded-lg border border-slate-300 px-3 py-2 text-sm" placeholder="First Name" {...register("firstName", { required: true })} />
          <input className="rounded-lg border border-slate-300 px-3 py-2 text-sm" placeholder="Last Name" {...register("lastName", { required: true })} />
          <input className="rounded-lg border border-slate-300 px-3 py-2 text-sm md:col-span-2" placeholder="Email" {...register("email", { required: true })} />
          <input className="rounded-lg border border-slate-300 px-3 py-2 text-sm" placeholder="Phone" {...register("phone", { required: true })} />
          <select className="rounded-lg border border-slate-300 px-3 py-2 text-sm" {...register("departmentId", { required: true })}>
            {departments.map((dept) => (
              <option key={dept.id} value={dept.id}>
                {dept.name}
              </option>
            ))}
          </select>
          <input className="rounded-lg border border-slate-300 px-3 py-2 text-sm" placeholder="Designation" {...register("designation", { required: true })} />
          <input className="rounded-lg border border-slate-300 px-3 py-2 text-sm" type="number" step="0.01" placeholder="Salary" {...register("salary", { required: true, min: 1 })} />
          <select className="rounded-lg border border-slate-300 px-3 py-2 text-sm" {...register("status", { required: true })}>
            <option value="Active">Active</option>
            <option value="On-Leave">On-Leave</option>
            <option value="Terminated">Terminated</option>
          </select>
          <input className="rounded-lg border border-slate-300 px-3 py-2 text-sm" type="date" {...register("joiningDate", { required: true })} />
          <div className="md:col-span-2">
            {(errors.firstName || errors.lastName || errors.email) && (
              <p className="text-sm text-rose-600">Please complete required fields.</p>
            )}
            {!departments.length && (
              <p className="text-sm text-rose-600">Create a department first before adding employees.</p>
            )}
            {errorMessage && <p className="text-sm text-rose-600">{errorMessage}</p>}
          </div>
          <div className="flex justify-end gap-3 md:col-span-2">
            <button type="button" className="rounded-lg border border-slate-300 px-4 py-2 text-sm" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" disabled={saving || !departments.length} className="rounded-lg bg-actionBlue px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">
              {saving
                ? "Saving..."
                : mode === "create"
                  ? "Add Employee"
                  : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
