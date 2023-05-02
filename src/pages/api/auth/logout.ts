import type { APIRoute } from "astro";

export const get: APIRoute = async ({ redirect, cookies }) => {
  cookies.delete("session", {
    path: "/",
  });

  return redirect("/backoffice/login", 302);
};
