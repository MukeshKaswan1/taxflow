export default function Input({ className = '', ...props }) {
  return (
    <input
      {...props}
      className={`bg-white border border-slate-200 rounded-lg p-2.5 text-slate-800 text-sm focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors ${className}`}
    />
  );
}
