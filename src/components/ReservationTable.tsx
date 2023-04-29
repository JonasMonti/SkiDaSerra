import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { TableLink } from "./TableLink";
import { formatCurrency } from "../util/formatCurrency";
import type { ReservationWithClientWithLessonWithSlopeAccess } from "../types";

export const ReservationTable = (props: {
  data: ReservationWithClientWithLessonWithSlopeAccess[];
}) => {
  const columnHelper =
    createColumnHelper<ReservationWithClientWithLessonWithSlopeAccess>();

  const defaultColumns = [
    // Accessor Column
    columnHelper.accessor("client.name", {
      header: () => "Nome do Cliente",
      cell: (val) => (
        <TableLink
          linkId={val.row.original.clientId}
          text={val.cell.getValue()}
          type={"client"}
        />
      ),
      footer: (props) => props.column.id,
    }),
    columnHelper.accessor("serviceType", {
      header: () => "Tipo de Serviço",
      cell: (val) => (
        <TableLink
          linkId={
            String(val.row.original.serviceType) === "SKI_LESSON"
              ? val.row.original.lessons[0].id
              : val.row.original.slopeAccesses[0].id
          }
          text={
            String(val.row.original.serviceType) === "SKI_LESSON"
              ? "Aula de Ski"
              : "Acesso á Pista"
          }
          type={val.row.original.lessons[0] ? "ski-lesson" : "slope-access"}
        />
      ),
      footer: (props) => props.column.id,
    }),
    columnHelper.accessor("totalPrice", {
      header: () => "Total de Pagamento",
      cell: (val) => formatCurrency(Number(val.getValue())),
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
