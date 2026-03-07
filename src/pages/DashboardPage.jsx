import { useEffect, useState } from "react";
import { dashboardService } from "../services/dashboardService";

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const response = await dashboardService.getStats();
        setStats(response.data);
      } catch (err) {
        setError(err.message);
      }
    };
    load();
  }, []);

  if (error) {
    return <p className="rounded-lg bg-rose-100 p-4 text-sm text-rose-700">{error}</p>;
  }

  if (!stats) {
    return (
      <div className="grid gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, idx) => (
          <div key={idx} className="skeleton h-28 animate-shimmer rounded-xl border border-slate-200" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-panel">
          <p className="text-sm text-slate-500">Total Headcount</p>
          <p className="mt-1 font-display text-3xl font-bold text-navy">{stats.totalHeadcount}</p>
        </article>
        <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-panel md:col-span-2">
          <p className="text-sm text-slate-500">Department Distribution</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {stats.deptDistribution.map((item) => (
              <span key={item.departmentId} className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">
                {item.departmentName}: {item.count}
              </span>
            ))}
          </div>
        </article>
      </div>

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-panel">
        <h3 className="font-display text-lg font-semibold text-navy">Recent Hires</h3>
        <div className="mt-4 space-y-3">
          {stats.recentHires.map((hire) => (
            <div key={hire.id} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-sm">
              <div>
                <p className="font-medium text-slate-800">
                  {hire.firstName} {hire.lastName}
                </p>
                <p className="text-slate-500">{hire.designation}</p>
              </div>
              <p className="text-slate-500">{hire.department?.name || "No Dept"}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
