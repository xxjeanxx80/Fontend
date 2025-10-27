import { ReactNode } from 'react';

type Identifier = string | number;

export interface AdminTableColumn<T> {
  key: keyof T | string;
  header: string;
  className?: string;
  render?: (row: T) => ReactNode;
}

interface AdminTableProps<T extends { id?: Identifier }> {
  data?: T[];
  columns: AdminTableColumn<T>[];
  isLoading?: boolean;
  emptyMessage?: string;
}

const AdminTable = <T extends { id?: Identifier }>({
  data = [],
  columns,
  isLoading = false,
  emptyMessage = 'No records found',
}: AdminTableProps<T>) => {
  const renderCell = (row: T, column: AdminTableColumn<T>) => {
    if (column.render) {
      return column.render(row);
    }

    const value = row[column.key as keyof T];
    if (typeof value === 'boolean') {
      return value ? 'Yes' : 'No';
    }
    if (value === null || value === undefined) {
      return '—';
    }
    return String(value);
  };

  const hasData = (data?.length ?? 0) > 0;

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-navy-900">
      <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
        <thead className="bg-slate-50 dark:bg-navy-950/60">
          <tr>
            {columns.map((column) => (
              <th
                key={String(column.key)}
                scope="col"
                className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-300 ${
                  column.className ?? ''
                }`}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 bg-white text-sm dark:divide-slate-800 dark:bg-navy-900">
          {isLoading &&
            Array.from({ length: 4 }).map((_, index) => (
              <tr key={`loading-${index}`} className="animate-pulse">
                {columns.map((column) => (
                  <td key={`loading-${index}-${String(column.key)}`} className="px-4 py-3">
                    <div className="h-3 rounded bg-slate-200 dark:bg-slate-700" />
                  </td>
                ))}
              </tr>
            ))}

          {!isLoading && hasData &&
            data.map((row, rowIndex) => (
              <tr key={row.id ?? rowIndex} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/60">
                {columns.map((column) => (
                  <td key={`${row.id ?? rowIndex}-${String(column.key)}`} className={`px-4 py-3 text-slate-600 dark:text-slate-200 ${column.className ?? ''}`}>
                    {renderCell(row, column)}
                  </td>
                ))}
              </tr>
            ))}

          {!isLoading && !hasData && (
            <tr>
              <td colSpan={columns.length} className="px-4 py-6 text-center text-sm text-slate-500 dark:text-slate-300">
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminTable;
