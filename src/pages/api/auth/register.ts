import { auth } from "../../../util/firebase/server";
import type { APIRoute } from "astro";

export const post: APIRoute = async ({ request, redirect }) => {
  const { email, password } = await request.json();

  try {
    await auth.createUser({
      email,
      password,
    });
  } catch (error: any) {
    return new Response(
      JSON.stringify({
        error: error.code,
      }),
      { status: 400 }
    );
  }
  return redirect("/backoffice/login", 302);
};
