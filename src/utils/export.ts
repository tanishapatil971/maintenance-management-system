/**
 * Exports an array of objects to a downloadable CSV file.
 * Uses only the browser's native APIs — no external dependencies.
 */
export function exportToCSV<T extends Record<string, unknown>>(
  data: T[],
  filename: string
): void {
  if (!data.length) return;

  const headers = Object.keys(data[0]);

  const escapeCell = (value: unknown): string => {
    const str = value == null ? '' : String(value);
    // Wrap in quotes if the value contains commas, quotes, or newlines
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const csvRows = [
    headers.join(','),
    ...data.map(row => headers.map(h => escapeCell(row[h])).join(',')),
  ];

  const csvContent = csvRows.join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename.endsWith('.csv') ? filename : `${filename}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
