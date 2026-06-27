export default function Field({ label, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs text-slate-500 uppercase tracking-wider font-semibold">{label}</label>
      {children}
    </div>
  );
}
