/**
 * Converts an array of flat objects into a CSV file and triggers a browser download.
 */
export function exportToCSV(rows, filename = "export.csv") {
  if (!rows || rows.length === 0) {
    alert("No data to export yet.");
    return;
  }

  const headers = Object.keys(rows[0]);
  const escape = (value) => {
    const str = String(value ?? "");
    if (str.includes(",") || str.includes("\n") || str.includes('"')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const csvLines = [
    headers.join(","),
    ...rows.map((row) => headers.map((h) => escape(row[h])).join(",")),
  ];

  const blob = new Blob(["\uFEFF" + csvLines.join("\n")], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
