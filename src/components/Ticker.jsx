export default function Ticker({ items }) {
  const doubled = [...items, ...items];

  return (
    <div className="border-y border-line bg-ink text-paper overflow-hidden">
      <div className="flex items-stretch">
        <span className="shrink-0 bg-saffron text-ink font-mono text-xs font-semibold uppercase tracking-wide px-3 py-2 flex items-center">
          Latest
        </span>
        <div className="relative flex-1 overflow-hidden">
          <div className="marquee-track flex whitespace-nowrap py-2">
            {doubled.map((item, i) => (
              <span key={i} className="mx-6 text-sm font-body">
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
