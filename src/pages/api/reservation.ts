import type { APIRoute } from "astro";
import db from "../../db";

export const get: APIRoute = async ({ params }) => {
  if (params.id) return await db.reservation.getById(params.id);

  return await db.reservation.getAll();
};

export const post: APIRoute = async ({ request }) =>
  await db.reservation.post(request);
