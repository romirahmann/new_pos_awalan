export function ChartBox({ title, children }) {
  return (
    <div
      className={`bg-[#161b22] border border-gray-700 p-4 rounded-xl "
      }`}
    >
      <p className="text-gray-400 mb-2">{title}</p>
      {children}
    </div>
  );
}
