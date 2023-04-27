import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const validationSchema = z.object({
  taxId: z.coerce.number().min(100000000).max(999999999),
  name: z.string().min(1).max(255),
  address: z.string().min(1).max(255),
});

type ValidationSchema = z.infer<typeof validationSchema>;

const getClient = async (taxId: string) => {
  const response = await fetch(`http://localhost:3001/client/tax-id/${taxId}`);
  const data = await response.json();
  return data;
};

export const CheckoutForm = () => {
  const [taxIdExists, setTaxIdExists] = useState(false);
  const [loadingTaxId, setLoadingTaxId] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ValidationSchema>({
    resolver: zodResolver(validationSchema),
  });

  useEffect(() => {
    console.log(errors);
  }, [errors]);

  const onSubmit: SubmitHandler<ValidationSchema> = (data) => {
    console.log(data);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(typeof e.target.value, e.target.value);

    if (e.target.value.length !== 9) return;

    setLoadingTaxId(true);

    getClient(e.target.value)
      .then((data) => {
        if (data.message === "Client not found") {
          setTaxIdExists(false);
          setLoadingTaxId(false);
          return;
        }

        setTaxIdExists(true);
        setLoadingTaxId(false);
      })
      .catch((err) => {
        console.log(err);
        setLoadingTaxId(false);
      });
  };

  return (
    <div>
      <form className="flex" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex w-80 flex-col gap-4 pr-12">
          <h2 className="mb-2 text-3xl font-medium text-primary">
            Dados do Cliente
          </h2>

          <label className="flex flex-col gap-1" htmlFor="taxId">
            <span className="font-medium">NIF</span>
            <div className="relative flex w-full">
              <input
                autoFocus
                disabled={loadingTaxId || taxIdExists}
                id="taxId"
                type="number"
                className="relative flex-1 rounded-md border border-gray-300 p-2"
                {...register("taxId")}
                onChange={handleChange}
              />
              {taxIdExists && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-green-700"
                >
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              )}
            </div>
          </label>
          <label className="flex flex-col gap-1" htmlFor="name">
            <span className="font-medium">Nome Completo</span>
            <input
              disabled={loadingTaxId || taxIdExists}
              id="name"
              type="text"
              className="rounded-md border border-gray-300 p-2"
              {...register("name")}
            />
          </label>
          <label className="flex flex-col gap-1" htmlFor="address">
            <span className="font-medium">Morada</span>
            <input
              disabled={loadingTaxId || taxIdExists}
              id="address"
              type="text"
              className="rounded-md border border-gray-300 p-2"
              {...register("address")}
            />
          </label>
        </div>

        <button type="submit">teste</button>
      </form>
    </div>
  );
};
