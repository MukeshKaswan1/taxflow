export default function Select({ value, onChange, options, className = '' }) {
  return (
    <select
      value={value}
      onChange={onChange}
      className={`bg-white border border-slate-200 rounded-lg p-2.5 text-slate-800 text-sm focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors ${className}`}
    >
      {options.map((o) => (
        <option key={o} value={o} className="bg-white text-slate-800">{o}</option>
      ))}
    </select>
  );
}
