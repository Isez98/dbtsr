import * as React from "react";
import VirtualizedTable from "../table";
import type { IUserData, ExtendedColumnDef } from "../../types";

// Fetch function for users
async function fetchUsers({ pageParam }: { pageParam?: string }) {
  const url = new URL(`${import.meta.env.VITE_BACKEND_API_ENDPOINT || 'http://localhost:4000/v1'}/users`);
  url.searchParams.set("limit", "50");
  if (pageParam) url.searchParams.set("cursor", pageParam);
  
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch users");
  
  const data = await res.json();
  
  // Transform the response to match expected format
  return {
    items: data.users || data.data || [],
    nextCursor: data.nextCursor,
  };
}

interface UsersTableProps {
  onUserClick?: (user: IUserData) => void;
  onEmailClick?: (email: string, user: IUserData) => void;
  onStatusClick?: (status: boolean, user: IUserData) => void;
}

export default function UsersTable({ 
  onUserClick, 
  onEmailClick, 
  onStatusClick 
}: UsersTableProps) {
  const columns = React.useMemo<ExtendedColumnDef<IUserData>[]>(
    () => [
      { 
        accessorKey: "name", 
        header: "Name",
        cell: ({ getValue }) => (
          <span className="font-medium">{getValue<string>()}</span>
        ),
        onClick: onUserClick ? (row: IUserData) => onUserClick(row) : undefined,
      },
      { 
        accessorKey: "email", 
        header: "Email",
        cell: ({ getValue }) => (
          <span className="text-blue-600">{getValue<string>()}</span>
        ),
        onClick: onEmailClick ? (row: IUserData, cellValue: unknown) => {
          onEmailClick(cellValue as string, row);
        } : undefined,
      },
      { 
        accessorKey: "activated", 
        header: "Status",
        cell: ({ getValue }) => {
          const isActivated = getValue<boolean>();
          return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              isActivated 
                ? 'bg-green-100 text-green-800' 
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {isActivated ? 'Active' : 'Pending'}
            </span>
          );
        },
        onClick: onStatusClick ? (row: IUserData, cellValue: unknown) => {
          onStatusClick(cellValue as boolean, row);
        } : undefined,
      },
    ],
    [onUserClick, onEmailClick, onStatusClick]
  );

  return (
    <VirtualizedTable<IUserData>
      title="Users"
      columns={columns}
      queryKey={["users"]}
      fetchFunction={fetchUsers}
      initialSorting={[{ id: "name", desc: false }]}
      estimateRowSize={48}
      tableHeight={400}
    />
  );
}