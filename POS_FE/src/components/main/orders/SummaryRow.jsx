export function SummaryRow({ label, value, bold }) {
  return (
    <div
      className={`flex justify-between ${
        bold && "text-lg font-bold text-white"
      }`}
    >
      <span>{label}</span>
      <span>Rp {value.toLocaleString()}</span>
    </div>
  );
}
