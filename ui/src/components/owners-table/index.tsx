import * as React from "react";
import SimpleTable from "../simple-table";
import type { IOwnerData, ExtendedColumnDef } from "../../types";

interface OwnersTableProps {
  data: IOwnerData[];
  isLoading?: boolean;
  error?: string | null;
  className?: string;
  onOwnerClick?: (owner: IOwnerData) => void;
  onEmailClick?: (email: string, owner: IOwnerData) => void;
}

export default function OwnersTable({ 
  data, 
  isLoading = false, 
  error = null, 
  className = "",
  onOwnerClick,
  onEmailClick,
}: OwnersTableProps) {
  const columns = React.useMemo<ExtendedColumnDef<IOwnerData>[]>(
    () => [
      { 
        accessorKey: "id", 
        header: "ID",
        cell: ({ getValue }) => (
          <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
            #{getValue<number>()}
          </span>
        ),
      },
      { 
        accessorKey: "name", 
        header: "Name",
        cell: ({ getValue }) => (
          <span className="font-semibold text-gray-900">{getValue<string>()}</span>
        ),
        onClick: onOwnerClick ? (row: IOwnerData) => onOwnerClick(row) : undefined,
      },
      { 
        accessorKey: "email", 
        header: "Email",
        cell: ({ getValue }) => (
          <span className="text-blue-600 hover:text-blue-800 transition-colors">
            {getValue<string>()}
          </span>
        ),
        onClick: onEmailClick ? (row: IOwnerData, cellValue: unknown) => {
          onEmailClick(cellValue as string, row);
        } : undefined,
      },
    ],
    [onOwnerClick, onEmailClick]
  );

  return (
    <SimpleTable<IOwnerData>
      title="Owners"
      data={data}
      columns={columns}
      initialSorting={[{ id: "name", desc: false }]}
      isLoading={isLoading}
      error={error}
      className={className}
    />
  );
}