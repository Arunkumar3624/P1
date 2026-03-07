import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useAuth } from "../../context/AuthContext";

export default function AppLayout() {
  const { user, logout } = useAuth();

  return (
    <div className="grid min-h-screen grid-cols-1 md:grid-cols-[240px_1fr]">
      <Sidebar />
      <div className="p-4 md:p-8">
        <header className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white/85 px-4 py-3 shadow-panel">
          <div>
            <h1 className="font-display text-lg font-bold text-navy">Workforce Hub</h1>
            <p className="text-sm text-slate-500">Real-time employee insights and control</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
              {user?.role}
            </span>
            <button
              type="button"
              onClick={logout}
              className="rounded-lg bg-navy px-3 py-2 text-sm font-medium text-white transition hover:opacity-90"
            >
              Logout
            </button>
          </div>
        </header>
        <main className="animate-riseIn">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
