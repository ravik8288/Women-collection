const tagColors = {
  Recruitment: "border-forest text-forest",
  Result: "border-saffron-dark text-saffron-dark",
  "Admit Card": "border-ink text-ink",
  "Answer Key": "border-rust text-rust",
};

export default function StampBadge({ tag, date, size = "md" }) {
  const dims = size === "sm" ? "h-14 w-14 text-[9px]" : "h-20 w-20 text-[10px]";
  const colorClass = tagColors[tag] || "border-ink text-ink";

  return (
    <div
      className={`shrink-0 ${dims} rotate-[-6deg] rounded-full border-2 border-dashed ${colorClass} flex flex-col items-center justify-center text-center font-mono uppercase leading-tight bg-paper/70`}
      aria-hidden="true"
    >
      <span className="font-semibold tracking-wide">{tag}</span>
      {date && <span className="opacity-70">{formatShort(date)}</span>}
    </div>
  );
}

function formatShort(iso) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
}
