import type { APIRoute } from "astro";
import db from "../../db";

export const get: APIRoute = async ({ params }) => {
  if (params.id) return await db.teacher.getById(params.id);

  return await db.teacher.getAll();
};
