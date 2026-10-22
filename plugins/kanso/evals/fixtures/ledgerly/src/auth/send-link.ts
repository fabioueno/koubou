import { allowSend } from "./gate";
import { sendSignInEmail } from "./email";

const TOKEN_TTL_SECONDS = 15 * 60;

export async function sendLink(request: Request, env: Env): Promise<Response> {
  const form = await request.formData();
  const email = String(form.get("email") ?? "").trim();

  if (!email.includes("@")) {
    return Response.json({ error: "invalid_email" }, { status: 400 });
  }

  // The reply is the same when the gate refuses, so the page cannot tell
  // whether an address has an account.
  if (!(await allowSend(env.KV, email))) {
    return Response.json({ status: "sent" });
  }

  const token = crypto.randomUUID();
  await env.KV.put(`sign-in:${token}`, email, { expirationTtl: TOKEN_TTL_SECONDS });

  const link = new URL("/auth/verify", request.url);
  link.searchParams.set("token", token);
  await sendSignInEmail(env.EMAIL, email, link.toString());

  return Response.json({ status: "sent" });
}
