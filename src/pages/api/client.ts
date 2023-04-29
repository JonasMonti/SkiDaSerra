import type { APIRoute } from "astro";
import db from "../../db";

export const get: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const params = Object.fromEntries(url.searchParams);

  if (params.id) return await db.client.getById(params.id);

  const taxIdParsed = Number(params.taxId);
  if (params.taxId) return await db.client.getByTaxId(taxIdParsed);

  return await db.client.getAll();
};
