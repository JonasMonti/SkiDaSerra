import type { Course } from "@prisma/client";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";
import type { CourseWithReservations } from "../types";
import { formatCurrency } from "../util/formatCurrency";

type CourseWithoutReservations = Omit<Course, "reservationId" | "reservations">;

export const CourseTable = (props: { data: CourseWithReservations[] }) => {
  const [data, setData] = useState<CourseWithoutReservations[]>(props.data);

  const handleEdit = (newDataInput: CourseWithoutReservations) => {
    const newData = data.map((item) => {
      if (item.id === newDataInput.id) {
        return {
          title: newDataInput.title,
          image: newDataInput.image,
          description: newDataInput.description,
          price: newDataInput.price,
          id: newDataInput.id,
        };
      }
      return item;
    });
    setData(newData);
  };

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
      <thead>
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
        {data.map((item) => (
          <EditableRow key={item.id} data={item} onEdit={handleEdit} />
        ))}
      </tbody>
    </table>
  );
};

const EditableRow = ({ data, onEdit }: { data: any; onEdit: any }) => {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(data.title);
  const [image, setImage] = useState(data.Image);
  const [description, setDescription] = useState(data.description);
  const [price, setPrice] = useState(data.price);

  const handleEdit = () => {
    onEdit(
      data.id,
      title,
      image,
      description,
      price,
      data.reservationId,
      data.reservations
    );

    const reqBody = {
      id: data.id,
      data: {
        title,
        image,
        description,
        price,
        reservationId: data.reservationId,
        reservations: data.reservations,
      },
    };

    fetch("/api/course", {
      method: "UPDATE",
      body: JSON.stringify(reqBody),
    });
    setEditing(false);
  };
  return (
    <tr>
      {editing ? (
        <>
          <td>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </td>
          <td>
            <input
              type="text"
              value={image}
              onChange={(e) => setImage(e.target.value)}
            />
          </td>
          <td>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </td>
          <td>
            <input
              type="text"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </td>
          <td>
            <button onClick={handleEdit}>Save</button>
          </td>
        </>
      ) : (
        <>
          <td>{data.title}</td>
          <td>{data.image}</td>
          <td>{data.description}</td>
          <td>{data.price}</td>
          <td>
            <button onClick={() => setEditing(true)}>Edit</button>
          </td>
        </>
      )}
    </tr>
  );
};
