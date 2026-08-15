interface GrammarTableProps {
  headers: [string, string]
  rows: { en: string; fr: string }[]
}

export default function GrammarTable({ headers, rows }: GrammarTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-ink/10">
      <div className="grid grid-cols-2 bg-ink text-cream text-xs font-mono uppercase tracking-wide">
        <div className="px-4 py-2.5">{headers[0]}</div>
        <div className="px-4 py-2.5 border-l border-cream/15">{headers[1]}</div>
      </div>
      {rows.map((row, i) => (
        <div key={i} className={`grid grid-cols-2 ${i % 2 === 0 ? 'bg-card' : 'bg-paper'}`}>
          <div className="px-4 py-2.5 font-medium text-ink">{row.en}</div>
          <div className="px-4 py-2.5 border-l border-ink/10 text-ink-soft">{row.fr}</div>
        </div>
      ))}
    </div>
  )
}
