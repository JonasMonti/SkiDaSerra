import type {
  Reservation,
  Lesson,
  SlopeAccess,
  Client,
  Course,
  Teacher,
} from "@prisma/client";

export type ReservationWithClientWithLessonWithSlopeAccess = Reservation & {
  lessons: Lesson[];
  slopeAccesses: SlopeAccess[];
  client: Client;
  courses: Course[];
};

export type LessonWithTeacherWithReservation = Lesson & {
  teacher: Teacher;
  reservation: Reservation | null;
};

export type CourseWithReservations = Course & { reservations: Reservation[] };
