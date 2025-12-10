export function Card({ title, value, subtitle }) {
  return (
    <div className="bg-[#161b22] p-4 border border-gray-700 rounded-xl">
      <p className="text-gray-400 text-sm">{title}</p>
      <h2 className="lg:text-2xl font-bold mt-1">{value}</h2>
      {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
    </div>
  );
}
