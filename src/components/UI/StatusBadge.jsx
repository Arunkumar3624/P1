const badgeMap = {
  Active: "bg-emerald-100 text-emerald-700",
  "On-Leave": "bg-amber-100 text-amber-700",
  Terminated: "bg-rose-100 text-rose-700"
};

export default function StatusBadge({ status }) {
  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${badgeMap[status] || "bg-slate-100 text-slate-700"}`}>
      {status}
    </span>
  );
}
