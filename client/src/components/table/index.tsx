import * as React from "react";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useVirtualizer } from "@tanstack/react-virtual";
import type { ExtendedColumnDef } from "../../types";

// Generic types
export interface TableProps<TData> {
  title: string;
  columns: ExtendedColumnDef<TData>[];
  queryKey: string[];
  fetchFunction: (params: { pageParam?: string }) => Promise<{
    items: TData[];
    nextCursor?: string;
  }>;
  estimateRowSize?: number;
  tableHeight?: number;
  className?: string;
  initialSorting?: SortingState;
}

export interface VirtualizedTableProps<TData> extends TableProps<TData> {
  enableVirtualization?: boolean;
  overscan?: number;
}

export default function VirtualizedTable<TData>({
  title,
  columns,
  queryKey,
  fetchFunction,
  estimateRowSize = 44,
  tableHeight = 420,
  className = "",
  initialSorting = [],
  enableVirtualization = true,
  overscan = 8,
}: VirtualizedTableProps<TData>) {
  const [sorting, setSorting] = React.useState<SortingState>(initialSorting);

  const { data, fetchNextPage, hasNextPage, isFetching, status } = useInfiniteQuery({
    queryKey,
    queryFn: fetchFunction,
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  });

  const rowsData = React.useMemo(
    () => (data?.pages.flatMap((p) => p.items) ?? []),
    [data]
  );

  const table = useReactTable({
    data: rowsData,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  // Virtualization setup
  const parentRef = React.useRef<HTMLDivElement>(null);
  const rowVirtualizer = useVirtualizer({
    count: table.getRowModel().rows.length + (hasNextPage ? 1 : 0),
    getScrollElement: () => parentRef.current,
    estimateSize: () => estimateRowSize,
    overscan,
    enabled: enableVirtualization,
  });

  // Infinite scroll sentinel
  const virtualItems = rowVirtualizer.getVirtualItems();
  React.useEffect(() => {
    if (!enableVirtualization) return;
    const last = virtualItems.at(-1);
    if (!last) return;
    const isLoaderRow = hasNextPage && last.index === table.getRowModel().rows.length;
    if (isLoaderRow) fetchNextPage();
  }, [virtualItems, hasNextPage, fetchNextPage, table, enableVirtualization]);

  // Calculate grid columns class based on column count
  const gridColsClass = React.useMemo(() => {
    const colCount = columns.length;
    const gridClasses: Record<number, string> = {
      1: "grid-cols-1",
      2: "grid-cols-2", 
      3: "grid-cols-3",
      4: "grid-cols-4",
      5: "grid-cols-5",
      6: "grid-cols-6",
    };
    return gridClasses[colCount] || `grid-cols-${colCount}`;
  }, [columns.length]);

  if (status === 'pending') return <div>Loading...</div>;
  if (status === 'error') return <div>Error loading data</div>;

  return (
    <div className={`w-full ${className}`}>
      <div className="flex items-center gap-2 mb-2">
        <h2 className="text-lg font-semibold">{title}</h2>
        {isFetching && <span className="text-sm opacity-60">Loading…</span>}
      </div>

      <div className="border rounded-lg">
        {/* Header */}
        <div className={`grid ${gridColsClass} px-3 py-2 text-sm font-medium bg-neutral-900 sticky top-0`}>
          {table.getFlatHeaders().map((header) => (
            <button
              key={header.id}
              className="text-left"
              onClick={header.column.getToggleSortingHandler()}
            >
              {flexRender(header.column.columnDef.header, header.getContext())}
              {{
                asc: " ▲",
                desc: " ▼",
              }[header.column.getIsSorted() as string] ?? null}
            </button>
          ))}
        </div>

        {/* Body */}
        {enableVirtualization ? (
          <div ref={parentRef} style={{ height: tableHeight, overflow: "auto" }}>
            <div
              style={{
                height: rowVirtualizer.getTotalSize(),
                position: "relative",
              }}
            >
              {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                const row = table.getRowModel().rows[virtualRow.index];
                const isLoader = hasNextPage && virtualRow.index === table.getRowModel().rows.length;
                return (
                  <div
                    key={virtualRow.key}
                    className={`grid ${gridColsClass} px-3 items-center border-t`}
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: estimateRowSize,
                      transform: `translateY(${virtualRow.start}px)`,
                    }}
                  >
                    {isLoader ? (
                      <div className={`col-span-${columns.length} text-sm opacity-70`}>
                        Loading more…
                      </div>
                    ) : (
                      row.getVisibleCells().map((cell) => {
                        const column = cell.column.columnDef as ExtendedColumnDef<TData>;
                        const hasOnClick = Boolean(column.onClick);
                        
                        return (
                          <div 
                            key={cell.id} 
                            className={`truncate text-sm ${
                              hasOnClick ? 'cursor-pointer hover:bg-gray-100 rounded p-1 transition-colors' : ''
                            }`}
                            onClick={hasOnClick ? () => column.onClick?.(row.original, cell.getValue()) : undefined}
                          >
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </div>
                        );
                      })
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div style={{ maxHeight: tableHeight, overflow: "auto" }}>
            {table.getRowModel().rows.map((row) => (
              <div
                key={row.id}
                className={`grid ${gridColsClass} px-3 py-2 items-center border-t`}
              >
                {row.getVisibleCells().map((cell) => {
                  const column = cell.column.columnDef as ExtendedColumnDef<TData>;
                  const hasOnClick = Boolean(column.onClick);
                  
                  return (
                    <div 
                      key={cell.id} 
                      className={`truncate text-sm ${
                        hasOnClick ? 'cursor-pointer hover:bg-gray-100 rounded p-1 transition-colors' : ''
                      }`}
                      onClick={hasOnClick ? () => column.onClick?.(row.original, cell.getValue()) : undefined}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </div>
                  );
                })}
              </div>
            ))}
            {hasNextPage && (
              <div className="px-3 py-2 text-sm opacity-70 text-center">
                <button onClick={() => fetchNextPage()}>Load more…</button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
