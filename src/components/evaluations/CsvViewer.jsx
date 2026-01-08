export default function CsvViewer({ rows }) {
  if (!Array.isArray(rows) || rows.length === 0) return null;

  const forcedHeaders = [
    "question",
    "option1",
    "option2",
    "option3",
    "correct",
    "points",
  ];

  // Crée l'ordre des colonnes : forcedHeaders d'abord, puis le reste
  const columnOrder = [...forcedHeaders];

  return (
    <div className="overflow-x-auto border rounded p-2">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b">
            {columnOrder.map((col, idx) => {
              // si la colonne forcée, on renomme l'affichage
              const displayName = forcedHeaders.includes(col) ? col : col;
              return (
                <th
                  key={col + idx}
                  className="px-3 py-2 text-left font-semibold text-muted-foreground"
                >
                  {displayName}
                </th>
              );
            })}
          </tr>
        </thead>

        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b last:border-b-0 hover:bg-muted/40">
              {columnOrder.map((col, idx) => {
                // prend la valeur de la colonne si existe, sinon la i-ème valeur
                const value =
                  row[col] !== undefined
                    ? row[col]
                    : Object.values(row)[idx] ?? "";
                return (
                  <td key={col + idx} className="px-3 py-2 align-top">
                    {value}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
