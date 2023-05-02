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

const updateReservation = async (id: string, data: any) => {
  const reservation = await prisma.reservation.update({
    where: {
      id,
    },
    data: {
      clientId: data.clientId,
      courses: data.courses,
      lessons: data.lessons,
      totalPrice: data.totalPrice,
      serviceType: data.serviceType,
      slopeAccesses: data.slopeAccesses,
    },
  });

  return {
    body: JSON.stringify(reservation),
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

//todo:implementar alterar

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

const updateCourse = async (id: string, data: any) => {
  const course = await prisma.course.update({
    where: {
      id,
    },
    data: {
      description: data.description,
      image: data.image,
      price: data.price,
      title: data.title,
    }
  });

  return {
    body: JSON.stringify(course),
  };
};

const postCourseSchema = z.object({
  image: z.string(),
  title: z.string(),
  description: z.string(),
  price: z.number().positive(),
  reservationId: z.string().uuid(),
});

const postCourse = async (request: Request) => {
  const { description, image, price, reservationId, title } =
    postCourseSchema.parse(request.body);

  const course = await prisma.course.create({
    data: {
      description,
      image,
      price,
      title,
      reservationId,
    },
  });

  return {
    status: 201,
    body: JSON.stringify(course),
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

const updateClient = async (id: string, data: any) => {
  const client = await prisma.client.update({
    where: {
      id,
    },
    data: {
      address: data.address,
      name: data.name,
      taxId: data.taxId
    },
  });

  return {
    body: JSON.stringify(client),
  };
};

const postClientSchema = z.object({
  name: z.string(),
  address: z.string(),
  taxId: z.number().int().positive(),
});

const postClient = async (request: Request) => {
  const { address, name, taxId } = postClientSchema.parse(request.body);

  const client = await prisma.client.create({
    data: {
      name,
      address,
      taxId,
    },
  });

  return {
    status: 201,
    body: JSON.stringify(client),
  };
};

//Lessons Methods

const getAllLessons = async () => {
  const lessons = await prisma.lesson.findMany({
    include: { teacher: true, reservation: true },
  });

  if (!lessons || !lessons.length) {
    return {
      status: 404,
      body: JSON.stringify({
        message: "No lessons found",
      }),
    };
  }

  return {
    body: JSON.stringify(lessons),
  };
};

const getByIdLesson = async (id: string) => {
  const lesson = await prisma.lesson.findUnique({
    where: {
      id,
    },
    include: {
      reservation: true,
      teacher: true,
    },
  });

  if (!lesson) {
    return {
      status: 404,
      body: JSON.stringify({
        message: "Lesson not found",
      }),
    };
  }

  return {
    body: JSON.stringify(lesson),
  };
};

const updateLesson = async (id: string, data: any) => {
  const lesson = await prisma.lesson.update({
    where: {
      id,
    },
    data: {
      numStudents: data.numStudents,
      teacher: data.teacher,
      serviceDays: data.serviceDays,
      slopeLevel: data.slopeLevel,
    },
  });

  return {
    body: JSON.stringify(lesson),
  };
};

//Teachers Methods

const getAllTeachers = async () => {
  const teachers = await prisma.teacher.findMany({});

  if (!teachers || !teachers.length) {
    return {
      status: 404,
      body: JSON.stringify({
        message: "No lessons found",
      }),
    };
  }

  return {
    body: JSON.stringify(teachers),
  };
};

const getByIdTeacher = async (id: string) => {
  const teacher = await prisma.teacher.findUnique({
    where: {
      id,
    },
  });

  if (!teacher) {
    return {
      status: 404,
      body: JSON.stringify({
        message: "Teacher not found",
      }),
    };
  }

  return {
    body: JSON.stringify(teacher),
  };
};

const updateTeacher = async (id: string, data: any) => {
  const teacher = await prisma.teacher.update({
    where: {
      id,
    },
    data: {
      name: data.name,
      address: data.address,
      taxId: data.taxId,
    },
  });

  return {
    body: JSON.stringify(teacher),
  };
};

const postTeacherSchema = z.object({
  name: z.string(),
  address: z.string(),
  taxId: z.number().int().positive(),
});

const postTeacher = async (request: Request) => {
  const { address, name, taxId } = postTeacherSchema.parse(request.body);

  const teacher = await prisma.teacher.create({
    data: {
      name,
      address,
      taxId,
    },
  });

  return {
    status: 201,
    body: JSON.stringify(teacher),
  };
};

export default {
  reservation: {
    getById: getByIdReservation,
    getAll: getAllReservation,
    update: updateReservation,
    post: postReservation,
  },
  course: {
    getById: getByIdCourse,
    getAll: getAllCourse,
    update: updateCourse,
    post: postCourse,
  },
  client: {
    getById: getByIdClient,
    getByTaxId: getByTaxIdClient,
    getAll: getAllClient,
    update: updateClient,
    post: postClient,
  },
  lesson: {
    getAll: getAllLessons,
    getById: getByIdLesson,
    update: updateLesson,
  },
  teacher: {
    getAll: getAllTeachers,
    getById: getByIdTeacher,
    update: updateTeacher,
    post: postTeacher,
  },
};
