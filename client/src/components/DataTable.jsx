import React from "react";

export default function DataTable({ columns, rows, renderRow, empty = "No data" }) {
  if (!rows?.length) return <p className="card text-sm text-navy/60">{empty}</p>;
  return (
    <div className="card overflow-x-auto">
      <table className="w-full min-w-[720px] text-sm">
        <thead>
          <tr className="text-left text-navy/60">
            {columns.map((col) => <th className="border-b border-navy/10 p-3" key={col}>{col}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={row._id || row.id || row.invoiceNumber || rowIndex}>
              {renderRow(row).map((cell, index) => <td className="border-b border-navy/10 p-3" key={index}>{cell}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
