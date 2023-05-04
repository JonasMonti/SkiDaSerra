import { zodResolver } from "@hookform/resolvers/zod";
import type { Course, Lesson, ServiceType, SlopeLevel } from "@prisma/client";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { apiURL } from "../config";
import { formatCurrency } from "../util/formatCurrency";
import {
  ServiceDayClient,
  ServiceDayTimeSelector,
} from "./ServiceDayTimeSelector";

const validationSchema = z.object({
  taxId: z.coerce.number().min(100000000).max(999999999),
  name: z.string().min(1).max(255).optional(),
  address: z.string().min(1).max(255).optional(),
  paymentMethod: z.string(),
  slopeLevel: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]),
});

type ValidationSchema = z.infer<typeof validationSchema>;

const getClient = async (taxId: string) => {
  const url = new URL(`${apiURL}/api/client?`);
  const params = { taxId };
  url.search = new URLSearchParams(params).toString();

  const response = await fetch(url);
  return await response.json();
};

const postSlopeAccess = async (
  serviceDays: ServiceDayClient[],
  serviceType: ServiceType,
  clientTaxId: number,
  slopeLevel: SlopeLevel
) => {
  const url = new URL(`${apiURL}/api/reservation`);

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      serviceDays,
      serviceType,
      clientTaxId,
      slopeLevel,
    }),
  });

  return await response.json();
};

const postClient = async (name: string, taxId: number, address: string) => {
  const url = new URL(`${apiURL}/api/client`);

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      taxId,
      address,
    }),
  });

  return await response.json();
};

export const CheckoutForm = (props: {
  type: ServiceType;
  course?: Course;
  lesson?: Lesson;
}) => {
  const [taxIdExists, setTaxIdExists] = useState(false);
  const [loadingTaxId, setLoadingTaxId] = useState(false);
  const [serviceDays, setServiceDays] = useState<ServiceDayClient[]>([]);

  const { register, handleSubmit } = useForm<ValidationSchema>({
    resolver: zodResolver(validationSchema),
  });

  const onSubmit: SubmitHandler<ValidationSchema> = (data) => {
    if (!taxIdExists) {
      postClient(data.name!, data.taxId, data.address!).then((newClient) => {
        postSlopeAccess(
          serviceDays,
          props.type,
          newClient.taxId,
          data.slopeLevel as SlopeLevel
        );
      });
    }

    postSlopeAccess(
      serviceDays,
      props.type,
      data.taxId,
      data.slopeLevel as SlopeLevel
    );
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      <form className="mt-8 flex" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-4 pr-12">
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
          {!taxIdExists ? (
            <>
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
            </>
          ) : (
            <p className="font-medium text-green-700">Cliente encontrado.</p>
          )}
        </div>
        <div className="flex w-full flex-col gap-4 border-l pl-12">
          {props.type === "COURSE" && (
            <>
              <h2 className="text-2xl font-medium">{props.course?.title}</h2>
              <p className="text-lg">
                {formatCurrency(Number(props.course?.price))}
              </p>
            </>
          )}

          {props.type === "SLOPE_ACCESS" && (
            <>
              <h2 className="mb-2 w-32 text-3xl font-medium text-primary">
                Acesso á Pista
              </h2>

              <label className="flex flex-col gap-1" htmlFor="dates">
                <span className="font-medium">Datas</span>

                <ServiceDayTimeSelector
                  serviceDays={serviceDays}
                  setServiceDays={setServiceDays}
                />
              </label>

              <label className="flex flex-col gap-1" htmlFor="slopelevel">
                <span className="font-medium">Nível da Pista</span>

                <select
                  defaultValue={undefined}
                  className="w-full rounded-lg border py-2"
                  id="slopelevel"
                  {...register("slopeLevel")}
                >
                  <option value={undefined} disabled selected>
                    Selecione
                  </option>
                  <option value="BEGINNER">Iniciante</option>
                  <option value="INTERMEDIATE">Intermédio</option>
                  <option value="ADVANCED">Avançado</option>
                </select>
              </label>
            </>
          )}

          <select
            className="w-full rounded-lg border py-2"
            id="paymentMethod"
            {...register("paymentMethod")}
          >
            <option value="MB">MB</option>
            <option value="VISA">VISA</option>
            <option value="MASTERCARD">MASTERCARD</option>
            <option value="PAYPAL">PAYPAL</option>
          </select>

          <button
            type="submit"
            className="mt-auto rounded-full border-2 border-primary bg-primary px-4 py-2 text-white transition-opacity hover:opacity-80"
          >
            Comprar
          </button>
        </div>
      </form>
    </div>
  );
};
