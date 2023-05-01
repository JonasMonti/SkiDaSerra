import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import type { SlopeAccess } from "@prisma/client";

export const SlopeAccessTable = (props: { data: SlopeAccess[] }) => {
  const columnHelper = createColumnHelper<SlopeAccess>();

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
    <table>
      <thead className="w-12 bg-zinc-900 text-white   ">
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <th key={header.id}>
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
