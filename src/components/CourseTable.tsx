import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import type { CourseWithReservations } from "../types";
import { formatCurrency } from "../util/formatCurrency";
export const CourseTable = (props: { data: CourseWithReservations[] }) => {
  const columnHelper = createColumnHelper<CourseWithReservations>();

  const defaultColumns = [
    // Accessor Column
    columnHelper.accessor("title", {
      header: () => "Nivel do Curso",
      footer: (props) => props.column.id,
    }),
    columnHelper.accessor("image", {
      header: () => "Imagem",
      footer: (props) => props.column.id,
    }),
    columnHelper.accessor("description", {
      header: () => "Descrição",
      footer: (props) => props.column.id,
    }),
    columnHelper.accessor("price", {
      header: () => "Preço",
      cell: (props) => formatCurrency(Number(props.getValue())),
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
