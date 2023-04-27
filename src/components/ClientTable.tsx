import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import type { Client } from "../types";
import { TableLink } from "./TableLink";

export const ClientTable = (props: { data: Client[] }) => {
  const columnHelper = createColumnHelper<Client>();

  const defaultColumns = [
    // Accessor Column
    columnHelper.accessor("name", {
      header: () => "Nome do Cliente",
      cell: (val) => (
        <TableLink
          linkId={val.row.original.id}
          text={val.getValue()}
          type="client"
        />
      ),
      footer: (props) => props.column.id,
    }),
    columnHelper.accessor("address", {
      header: () => "Morada",
      footer: (props) => props.column.id,
    }),
    columnHelper.accessor("taxId", {
      header: () => "NIF",
      footer: (props) => props.column.id,
    }),
  ];

  const table = useReactTable({
    data: props.data,
    columns: defaultColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <table className="w-full border-separate border-spacing-4 rounded-md border border-zinc-400 bg-zinc-50 text-left shadow-lg">
      <thead className="">
        {table.getHeaderGroups().map((headerGroup) => (
          <tr className="" key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <th className="border-b border-zinc-300 pb-2" key={header.id}>
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody className="">
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
