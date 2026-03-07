export default function EmptyState({ title, description }) {
  return (
    <div className="rounded-xl border border-dashed border-slate-300 bg-white/80 p-10 text-center shadow-panel">
      <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-xl bg-slate-100">
        <svg viewBox="0 0 24 24" className="h-8 w-8 text-slate-500" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M4 7h16M6 11h12M8 15h8M9 19h6" />
        </svg>
      </div>
      <h3 className="font-display text-lg font-semibold text-navy">{title}</h3>
      <p className="mt-2 text-sm text-slate-500">{description}</p>
    </div>
  );
}
