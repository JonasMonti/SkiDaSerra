import type { APIRoute } from "astro";
import db from "../../db";

export const get: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const params = Object.fromEntries(url.searchParams);

  if (params.id) return await db.course.getById(params.id);

  return await db.course.getAll();
};
