import { NavLink } from "react-router-dom";

const navItems = [
  { label: "Dashboard", to: "/dashboard" },
  { label: "Employees", to: "/employees" }
];

export default function Sidebar() {
  return (
    <aside className="sticky top-0 h-screen w-full border-r border-slate-200 bg-white/90 p-5 backdrop-blur">
      <div className="mb-10">
        <p className="font-display text-xl font-bold text-navy">EMS</p>
        <p className="text-xs text-slate-500">Employee Management</p>
      </div>

      <nav className="space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `block rounded-lg px-3 py-2 text-sm font-medium transition ${
                isActive
                  ? "bg-actionBlue text-white shadow"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
