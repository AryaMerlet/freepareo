export default function CsvViewer({ rows }) {
  // pas de données
  if (!Array.isArray(rows) || rows.length === 0) return null;

  const headers = Object.keys(rows[0]);

  return (
    <div className="overflow-x-auto">
      {/* table csv */}
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b">
            {headers.map((h) => (
              <th
                key={h}
                className="px-3 py-2 text-left font-semibold text-muted-foreground"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b last:border-b-0 hover:bg-muted/40">
              {headers.map((h) => (
                <td key={h} className="px-3 py-2 align-top">
                  {row[h] ?? ""}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
