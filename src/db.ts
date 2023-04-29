import { PrismaClient, ServiceType } from "@prisma/client";
import { z } from "zod";

const prisma = new PrismaClient();

// Reservation Methods

const getByIdReservation = async (id: string) => {
  const reservation = await prisma.reservation.findUnique({
    where: {
      id,
    },
    include: {
      lessons: true,
      slopeAccesses: true,
      client: true,
      courses: true,
    },
  });

  if (!reservation) {
    return new Response(null, {
      status: 404,
      statusText: "Not found",
    });
  }

  return {
    body: JSON.stringify(reservation),
  };
};

const getAllReservation = async () => {
  const reservations = await prisma.reservation.findMany({
    include: {
      lessons: true,
      slopeAccesses: true,
      client: true,
      courses: true,
    },
  });

  if (!reservations || !reservations.length) {
    return {
      status: 404,
      body: JSON.stringify({
        message: "No reservations found",
      }),
    };
  }

  return {
    body: JSON.stringify(reservations),
  };
};

const postReservationSchema = z.object({
  clientId: z.string().uuid(),
  serviceType: z.enum(["SKI_LESSON", "SLOPE_ACCESS", "COURSE"]),
  slopeLevel: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]).optional(),
  serviceDays: z
    .array(
      z.object({
        day: z.date().min(new Date()),
        timeOfDay: z
          .enum(["MORNING", "AFTERNOON", "ALL_DAY"])
          .default("MORNING"),
      })
    )
    .min(1)
    .max(7),
  numStudents: z.number().min(1).max(6).optional(),
});

const postReservation = async (request: Request) => {
  const { serviceDays, serviceType, clientId, slopeLevel, numStudents } =
    postReservationSchema.parse(request.body);

  let lessonId: string | undefined;

  if (serviceType === ServiceType.SKI_LESSON) {
    const lesson = await prisma.lesson.create({
      data: {
        numStudents: numStudents || 1,
        slopeLevel: slopeLevel || "BEGINNER",
        serviceDays: {
          create: serviceDays.map((serviceDay) => ({
            day: serviceDay.day,
            timeOfDay: serviceDay.timeOfDay,
          })),
        },
        teacher: {
          connect: {
            id: "1",
          },
        },
      },
    });

    lessonId = lesson.id;
  }

  let slopeAccessId: string | undefined;

  if (serviceType === ServiceType.SLOPE_ACCESS) {
    const slopeAccess = await prisma.slopeAccess.create({
      data: {
        slopeLevel: slopeLevel || "BEGINNER",
        serviceDays: {
          create: serviceDays.map((serviceDay) => ({
            day: serviceDay.day,
            timeOfDay: serviceDay.timeOfDay,
          })),
        },
      },
    });

    slopeAccessId = slopeAccess.id;
  }

  const reservation = await prisma.reservation.create({
    data: {
      serviceType,
      lessons: {
        connect: {
          id: lessonId,
        },
      },
      slopeAccesses: {
        connect: {
          id: slopeAccessId,
        },
      },
      client: {
        connect: {
          id: clientId,
        },
      },
      totalPrice: 0,
    },
  });

  return {
    status: 201,
    body: JSON.stringify(reservation),
  };
};

// Course Methods

const getByIdCourse = async (id: string) => {
  const course = await prisma.course.findUnique({
    where: {
      id,
    },
    include: {
      reservation: true,
    },
  });

  if (!course) {
    return {
      status: 404,
      body: JSON.stringify({
        message: "Course not found",
      }),
    };
  }

  return {
    body: JSON.stringify(course),
  };
};

const getAllCourse = async () => {
  const courses = await prisma.course.findMany({
    include: { reservation: true },
  });

  if (!courses || !courses.length) {
    return {
      status: 404,
      body: JSON.stringify({
        message: "No courses found",
      }),
    };
  }

  return {
    body: JSON.stringify(courses),
  };
};

// Client Methods

const getByIdClient = async (id: string) => {
  const client = await prisma.client.findUnique({
    where: {
      id,
    },
    include: {
      reservations: true,
    },
  });

  if (!client) {
    return {
      status: 404,
      body: JSON.stringify({
        message: "Client not found",
      }),
    };
  }

  return {
    body: JSON.stringify(client),
  };
};

const getByTaxIdClient = async (taxId: number) => {
  const client = await prisma.client.findUnique({
    where: {
      taxId,
    },
    include: {
      reservations: true,
    },
  });

  if (!client) {
    return {
      status: 404,
      body: JSON.stringify({
        message: "Client not found",
      }),
    };
  }

  return {
    body: JSON.stringify(client),
  };
};

const getAllClient = async () => {
  const clients = await prisma.client.findMany({
    include: { reservations: true },
  });

  if (!clients || !clients.length) {
    return {
      status: 404,
      body: JSON.stringify({
        message: "No clients found",
      }),
    };
  }

  return {
    body: JSON.stringify(clients),
  };
};

export default {
  reservation: {
    getById: getByIdReservation,
    getAll: getAllReservation,
    post: postReservation,
  },
  course: {
    getById: getByIdCourse,
    getAll: getAllCourse,
  },
  client: {
    getById: getByIdClient,
    getByTaxId: getByTaxIdClient,
    getAll: getAllClient,
  },
};
