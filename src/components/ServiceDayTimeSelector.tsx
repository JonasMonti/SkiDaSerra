import type { ServiceDay, TimeOfDay } from "@prisma/client";
import ReactDatePicker from "react-datepicker";

import "./datepicker/styles.css";
import { useState } from "react";

export type ServiceDayClient = Omit<
  ServiceDay,
  "id" | "serviceId" | "lessonId" | "slopeAccessId"
>;

const getTimeOfDay = (date: Date): TimeOfDay => {
  if (date.getHours() < 12) return "MORNING";
  if (date.getHours() < 18) return "AFTERNOON";
  return "ALL_DAY";
};

export const ServiceDayTimeSelector = (props: {
  serviceDays: ServiceDayClient[];
  setServiceDays: React.Dispatch<React.SetStateAction<ServiceDayClient[]>>;
}) => {
  return (
    <div className="flex flex-wrap gap-2">
      {props.serviceDays.map((serviceDay) => (
        <ServiceDayPill
          handleClick={() =>
            props.setServiceDays([
              ...props.serviceDays.filter(
                (sd) => sd.day.getTime() !== serviceDay.day.getTime()
              ),
            ])
          }
          serviceDay={serviceDay}
        />
      ))}

      <ReactDatePicker
        shouldCloseOnSelect={false}
        className="text-primary"
        withPortal
        customInput={
          <button
            type="button"
            className="h-10 w-10 rounded-full border border-primary px-2 py-2 text-primary"
          >
            +
          </button>
        }
        showTimeSelect
        onChange={(date) => {
          if (!date) return;

          const isDateAfterToday = date.getTime() > Date.now();
          if (!isDateAfterToday) return;

          const isDateAlreadySelected = props.serviceDays.some(
            (sd) => sd.day.getTime() === date.getTime()
          );
          if (isDateAlreadySelected) return;

          props.setServiceDays([
            ...props.serviceDays,
            {
              day: date,
              timeOfDay: getTimeOfDay(date),
            },
          ]);
        }}
      />
    </div>
  );
};

type ServiceDayPillProps = {
  serviceDay: ServiceDayClient;
  handleClick: () => void;
};

const ServiceDayPill = (props: ServiceDayPillProps) => (
  <div
    onClick={props.handleClick}
    className="cursor-pointer rounded-full bg-primary px-5 py-2 font-medium text-white transition-opacity hover:bg-red-800 hover:opacity-80"
  >
    {props.serviceDay.day.toLocaleDateString("pt-PT", {
      weekday: "long",
      day: "numeric",
      month: "long",
    })}
    {props.serviceDay.timeOfDay === "MORNING" && " (Manhã)"}
    {props.serviceDay.timeOfDay === "AFTERNOON" && " (Tarde)"}
    {props.serviceDay.timeOfDay === "ALL_DAY" && " (Dia Inteiro)"}
  </div>
);
