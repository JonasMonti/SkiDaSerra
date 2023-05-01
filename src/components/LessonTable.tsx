import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { SlopeLevel } from "@prisma/client";
import type { LessonWithTeacherWithReservation } from "../types";
import { formatCurrency } from "../util/formatCurrency";

export const LessonTable = (props: {
  data: LessonWithTeacherWithReservation[];
}) => {
  const columnHelper = createColumnHelper<LessonWithTeacherWithReservation>();

  const defaultColumns = [
    columnHelper.accessor("numStudents", {
      header: "Num. Estudantes",
      footer: (props) => props.column.id,
    }),
    columnHelper.accessor("teacher", {
      header: "Professor",
      cell: (props) => props.getValue().name,
      footer: (props) => props.column.id,
    }),
    columnHelper.accessor("reservation.totalPrice", {
      header: "Valor Total",
      cell: (props) => formatCurrency(Number(props.getValue())),
      footer: (props) => props.column.id,
    }),
    columnHelper.accessor("slopeLevel", {
      header: "Nível",
      cell: (props) => {
        switch (props.getValue()) {
          case SlopeLevel.BEGINNER:
            return "Iniciante";
          case SlopeLevel.INTERMEDIATE:
            return "Intermediário";
          case SlopeLevel.ADVANCED:
            return "Avançado";
          default:
            return "Desconhecido";
        }
      },
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
