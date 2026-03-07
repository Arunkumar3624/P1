import { useEffect } from "react";
import { useForm } from "react-hook-form";

export default function EmployeeEditModal({
  employee,
  departments,
  onClose,
  onSave,
  saving
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm();

  useEffect(() => {
    if (employee) {
      reset({
        firstName: employee.firstName,
        lastName: employee.lastName,
        email: employee.email,
        phone: employee.phone,
        departmentId: employee.departmentId,
        designation: employee.designation,
        salary: employee.salary,
        status: employee.status,
        joiningDate: employee.joiningDate
      });
    }
  }, [employee, reset]);

  if (!employee) return null;

  return (
    <div className="fixed inset-0 z-40 grid place-items-center bg-slate-900/40 p-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-panel">
        <h3 className="mb-4 font-display text-xl font-semibold text-navy">Edit Employee</h3>
        <form onSubmit={handleSubmit(onSave)} className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
          </div>
          <div className="flex justify-end gap-3 md:col-span-2">
            <button type="button" className="rounded-lg border border-slate-300 px-4 py-2 text-sm" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" disabled={saving} className="rounded-lg bg-actionBlue px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
