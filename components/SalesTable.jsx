import { useState } from "react";

export default function SalesTable({ data, setData }) {
  const [editingId, setEditingId] = useState(null);

  const uid = () =>
    `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
  const parseNumber = (v) => {
    const n = Number(String(v).replace(/,/g, ""));
    return Number.isFinite(n) ? n : 0;
  };

  const startEdit = (id) => setEditingId(id);
  const cancelEdit = () => setEditingId(null);

  const handleSaveEdit = (id, updatedFields) => {
    setData((d) =>
      d.map((r) =>
        r.id === id
          ? {
              ...r,
              ...updatedFields,
              revenue: parseNumber(updatedFields.revenue),
              quantity: Number(updatedFields.quantity),
            }
          : r
      )
    );
    setEditingId(null);
  };

  const handleDelete = (id) => {
    if (!confirm("Delete this row?")) return;
    setData((d) => d.filter((r) => r.id !== id));
  };

  const rowColors = [
    "text-red-600",
    "text-green-600",
    "text-blue-600",
    "text-yellow-600",
    "text-purple-600",
    "text-pink-600",
    "text-indigo-600",
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-x-auto mb-6 border border-gray-200">
      <table className="w-full table-auto border-collapse text-center text-sm font-bold">
        <thead className="bg-indigo-600 text-white">
          <tr>
            {["Salesperson","Product","Quantity","Revenue","Region","Date","Actions"].map(
              (h) => (
                <th
                  key={h}
                  className="border-b border-indigo-500 px-4 py-3 font-semibold"
                >
                  {h}
                </th>
              )
            )}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 && (
            <tr>
              <td
                colSpan={7}
                className="p-6 text-gray-400 italic border-b border-gray-200"
              >
                No data yet
              </td>
            </tr>
          )}
          {data.map((row, idx) => {
            const rowTextColor = rowColors[idx % rowColors.length];

            return (
              <tr
                key={row.id}
                className={`odd:bg-gray-50 even:bg-white hover:bg-gray-100 transition`}
              >
                <td className={`border-b border-gray-200 px-3 py-2 ${rowTextColor}`}>
                  {editingId === row.id ? (
                    <input
                      defaultValue={row.salesperson}
                      onChange={(e) => (row.salesperson = e.target.value)}
                      className="w-full border rounded px-2 py-1 text-center font-bold focus:ring-1 focus:ring-indigo-400"
                    />
                  ) : (
                    row.salesperson
                  )}
                </td>
                <td className={`border-b border-gray-200 px-3 py-2 ${rowTextColor}`}>
                  {editingId === row.id ? (
                    <input
                      defaultValue={row.product}
                      onChange={(e) => (row.product = e.target.value)}
                      className="w-full border rounded px-2 py-1 text-center font-bold focus:ring-1 focus:ring-indigo-400"
                    />
                  ) : (
                    row.product
                  )}
                </td>
                <td className={`border-b border-gray-200 px-3 py-2 ${rowTextColor}`}>
                  {editingId === row.id ? (
                    <input
                      defaultValue={row.quantity}
                      type="number"
                      onChange={(e) => (row.quantity = e.target.value)}
                      className="w-full border rounded px-2 py-1 text-center font-bold focus:ring-1 focus:ring-indigo-400"
                    />
                  ) : (
                    Number(row.quantity).toLocaleString()
                  )}
                </td>
                <td className={`border-b border-gray-200 px-3 py-2 ${rowTextColor}`}>
                  {editingId === row.id ? (
                    <input
                      defaultValue={row.revenue}
                      type="number"
                      onChange={(e) => (row.revenue = e.target.value)}
                      className="w-full border rounded px-2 py-1 text-center font-bold focus:ring-1 focus:ring-indigo-400"
                    />
                  ) : (
                    Number(row.revenue).toLocaleString()
                  )}
                </td>
                <td className={`border-b border-gray-200 px-3 py-2 ${rowTextColor}`}>
                  {editingId === row.id ? (
                    <input
                      defaultValue={row.region}
                      onChange={(e) => (row.region = e.target.value)}
                      className="w-full border rounded px-2 py-1 text-center font-bold focus:ring-1 focus:ring-indigo-400"
                    />
                  ) : (
                    row.region
                  )}
                </td>
                <td className={`border-b border-gray-200 px-3 py-2 ${rowTextColor}`}>
                  {editingId === row.id ? (
                    <input
                      defaultValue={row.date}
                      type="date"
                      onChange={(e) => (row.date = e.target.value)}
                      className="w-full border rounded px-2 py-1 text-center font-bold focus:ring-1 focus:ring-indigo-400"
                    />
                  ) : (
                    row.date
                  )}
                </td>
                <td className="border-b border-gray-200 px-3 py-2 flex justify-center gap-2">
                  {editingId === row.id ? (
                    <>
                      <button
                        onClick={() => handleSaveEdit(row.id, row)}
                        className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition font-bold"
                      >
                        Save
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 transition font-bold"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => startEdit(row.id)}
                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition font-bold"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(row.id)}
                        className="px-3 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200 transition font-bold"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
