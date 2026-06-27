export default function Card({ children, className = '', glow = false }) {
  return (
    <div className={`bg-white border border-slate-200/80 rounded-2xl shadow-sm relative overflow-hidden ${className}`}>
      {glow && (
        <div className="absolute -top-24 -right-24 w-56 h-56 bg-blue-500/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      )}
      {children}
    </div>
  );
}
