const SESSION_DAYS = 30;

export async function verify(request: Request, env: Env): Promise<Response> {
  const token = new URL(request.url).searchParams.get("token") ?? "";
  const email = await env.KV.get(`sign-in:${token}`);

  if (!email) {
    return Response.redirect(new URL("/sign-in?link=expired", request.url).toString(), 302);
  }

  await env.KV.delete(`sign-in:${token}`);

  const sessionId = crypto.randomUUID();
  const expires = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);
  await env.DB.prepare("INSERT INTO sessions (id, email, expires_at) VALUES (?, ?, ?)")
    .bind(sessionId, email, expires.toISOString())
    .run();

  return new Response(null, {
    status: 302,
    headers: {
      Location: "/",
      "Set-Cookie": `sid=${sessionId}; Path=/; HttpOnly; Secure; SameSite=Lax; Expires=${expires.toUTCString()}`,
    },
  });
}
