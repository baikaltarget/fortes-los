/** Рендер простой markdown-таблицы из строки (используется в текстах услуг из site.json) */
export default function MdTable({ md }: { md: string }) {
  const rows = md.trim().split("\n").map((r) => r.replace(/^\||\|$/g, "").split("|").map((c) => c.trim()));
  const [head, , ...body] = rows;
  return (
    <div className="card overflow-x-auto my-6 not-prose">
      <table className="w-full text-[15px] min-w-[520px]">
        <thead className="text-left text-muted"><tr>{head.map((h) => <th key={h} className="px-4 py-3 font-medium">{h}</th>)}</tr></thead>
        <tbody>{body.map((r, i) => <tr key={i} className="border-t border-line">{r.map((c, j) => <td key={j} className={`px-4 py-2.5 ${j === r.length - 1 ? "font-bold whitespace-nowrap" : ""}`}>{c}</td>)}</tr>)}</tbody>
      </table>
    </div>
  );
}
