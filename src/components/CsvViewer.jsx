export default function CsvViewer({ rows, headers }) {
  // pas de données
  if (!Array.isArray(rows) || rows.length === 0) return null;

  // Use provided headers if available, otherwise fallback to Object.keys
  // This preserves the original CSV column order
  const columnHeaders =
    headers && Array.isArray(headers) && headers.length > 0
      ? headers
      : Object.keys(rows[0]);

  return (
    <div className="overflow-x-auto">
      {/* table csv */}
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b">
            {columnHeaders.map((h) => (
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
              {columnHeaders.map((h) => (
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
