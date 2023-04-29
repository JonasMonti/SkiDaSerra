import type { Reservation, Lesson, SlopeAccess, Client, Course } from "@prisma/client";

export type ReservationWithClientWithLessonWithSlopeAccess = Reservation & {
  lessons: Lesson[];
  slopeAccesses: SlopeAccess[];
  client: Client;
  courses: Course[];
};
