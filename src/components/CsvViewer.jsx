export default function CsvViewer({ rows }) {
  if (!rows?.length) return null;

  const headers = Object.keys(rows[0]);

  return (
    <div className="overflow-x-auto border rounded p-2 max-h-64">
      <table className="min-w-full text-sm border-collapse">
        <thead>
          <tr>
            {headers.map((h) => (
              <th key={h} className="border px-2 py-1 bg-muted text-left">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              {headers.map((h) => (
                <td key={h} className="border px-2 py-1 whitespace-nowrap">
                  {row[h]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
