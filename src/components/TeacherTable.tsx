import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import type { Teacher } from "@prisma/client";
export const TeacherTable = (props: { data: Teacher[] }) => {
  const columnHelper = createColumnHelper<Teacher>();

  type clientKeyType = keyof (typeof props.data)[0];

  const columns = Object.keys(props.data[0]).map((key) =>
    columnHelper.accessor(key as clientKeyType, {
      header: key,
      footer: (info) => info.column.id,
    })
  );

  const table = useReactTable({
    data: props.data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <table className="w-full border-separate border-spacing-4 rounded-md border border-zinc-400 bg-zinc-50 text-left shadow-lg">
      <thead className="">
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <th className="border-b border-zinc-300 pb-2" key={header.id}>
                {flexRender(
                  header.column.columnDef.header,
                  header.getContext()
                )}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map((row) => (
          <tr key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <td key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};
