import React from 'react'

interface TableProps {
  data: any
  columns: {
    title: string
    key: string
  }[]
  className?: string
  rowClick?: Function
}

export const Table: React.FC<TableProps> = ({
  data,
  columns,
  className,
  rowClick = () => {},
}) => {
  return (
    <div
      className={`relative overflow-x-auto shadow-md sm:rounded-lg ${className}`}
    >
      <table
        className="w-full table-auto text-left text-sm dark:text-white"
        key={`table-${columns.length}`}
      >
        <thead className="bg-gray-50 text-xs uppercase dark:bg-gray-700 dark:text-gray-400">
          <tr>
            {columns.map((item, key) => {
              return (
                <th scope="col" className="px-6 py-3" key={`th-${key}`}>
                  {item.title}
                </th>
              )
            })}
          </tr>
        </thead>
        <tbody className="border-b bg-white dark:border-gray-700 dark:bg-gray-800">
          {data.map(
            (
              item: {
                [x: string]:
                  | boolean
                  | React.ReactChild
                  | React.ReactFragment
                  | React.ReactPortal
                  | null
                  | undefined
              },
              headerKey: any
            ) => {
              return (
                <tr
                  key={`tr-${headerKey}`}
                  className="cursor-pointer duration-300 ease-in hover:bg-gray-500"
                  onClick={() => rowClick(item.id)}
                >
                  {columns.map((i, k) => {
                    type ObjectKey = keyof typeof item
                    const key = i.key as ObjectKey
                    return (
                      <td className="px-6 py-4" key={`td-${headerKey}-${k}`}>
                        {item[key]}
                      </td>
                    )
                  })}
                </tr>
              )
            }
          )}
        </tbody>
      </table>
    </div>
  )
}

export default Table
