import type { APIRoute } from "astro";
import db from "../../db";

export const get: APIRoute = async () => {
  return await db.lesson.getAll();
};
