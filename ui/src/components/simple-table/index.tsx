import * as React from "react";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table";
import type { ExtendedColumnDef } from "../../types";

export interface SimpleTableProps<TData> {
  title: string;
  data: TData[];
  columns: ExtendedColumnDef<TData>[];
  className?: string;
  initialSorting?: SortingState;
  isLoading?: boolean;
  error?: string | null;
}

export default function SimpleTable<TData>({
  title,
  data,
  columns,
  className = "",
  initialSorting = [],
  isLoading = false,
  error = null,
}: SimpleTableProps<TData>) {
  const [sorting, setSorting] = React.useState<SortingState>(initialSorting);

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  // Calculate grid columns class based on column count with better proportions
  const gridColsClass = React.useMemo(() => {
    const colCount = columns.length;
    // Use standard grid classes that are guaranteed to work
    const gridClasses: Record<number, string> = {
      1: "grid-cols-1",
      2: "grid-cols-2",
      3: "grid-cols-3", // Use standard 3-column grid
      4: "grid-cols-4",
      5: "grid-cols-5",
      6: "grid-cols-6",
    };
    return gridClasses[colCount] || "grid-cols-3";
  }, [columns.length]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className={`w-full max-w-6xl mx-auto ${className}`}>
      <div className="flex items-center gap-3 mb-4">
        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
        <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
          {data.length} {data.length === 1 ? 'item' : 'items'}
        </span>
      </div>

      <div className="border rounded-lg shadow-sm">
        {/* Header */}
        <div className={`grid ${gridColsClass} gap-4 px-6 py-4 text-sm font-semibold bg-gray-900 text-white sticky top-0 w-full`}>
          {table.getFlatHeaders().map((header) => (
            <div
              key={header.id}
              className="text-left hover:bg-gray-800 px-2 py-1 rounded transition-colors duration-200 cursor-pointer"
              onClick={header.column.getToggleSortingHandler()}
            >
              <div className="flex items-center gap-1">
                <span className="truncate">
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </span>
                <span className="text-xs opacity-70">
                  {{
                    asc: "▲",
                    desc: "▼",
                  }[header.column.getIsSorted() as string] ?? ""}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Body */}
        <div className="max-h-[600px] overflow-auto">
          {data.length === 0 ? (
            <div className="px-6 py-12 text-center text-gray-500">
              <div className="text-lg font-medium mb-2">No data available</div>
              <div className="text-sm">There are no {title.toLowerCase()} to display.</div>
            </div>
          ) : (
            table.getRowModel().rows.map((row, index) => (
              <div
                key={row.id}
                className={`grid ${gridColsClass} gap-4 px-6 py-4 items-center border-t border-gray-200 hover:bg-blue-50 transition-colors duration-150 w-full ${
                  index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                }`}
              >
                {row.getVisibleCells().map((cell) => {
                  const column = cell.column.columnDef as ExtendedColumnDef<TData>;
                  const hasOnClick = Boolean(column.onClick);
                  
                  return (
                    <div 
                      key={cell.id} 
                      className={`text-sm text-gray-900 min-w-0 overflow-hidden ${
                        hasOnClick ? 'cursor-pointer hover:bg-gray-100 rounded p-1 transition-colors' : ''
                      }`}
                      onClick={hasOnClick ? () => column.onClick?.(row.original, cell.getValue()) : undefined}
                    >
                      <div className="break-words">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </div>
                    </div>
                  );
                })}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}