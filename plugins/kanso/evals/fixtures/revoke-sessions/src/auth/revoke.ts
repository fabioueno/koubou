// Signs the person out on every device, for the "Sign out everywhere" button.
export async function doIt(req: Request, env: Env): Promise<Response> {
  const sid = cookieVal(req, "sid");
  if (!sid) {
    return new Response(null, { status: 401 });
  }

  const acct = await env.DB.prepare("SELECT email FROM sessions WHERE id = ?")
    .bind(sid)
    .first<{ email: string }>();
  if (!acct) {
    return new Response(null, { status: 401 });
  }

  const res = await env.DB.prepare("DELETE FROM sessions WHERE email = ?").bind(acct.email).run();
  const cnt = res.meta.changes;

  return Response.json({ revoked: cnt });
}

function cookieVal(req: Request, k: string): string | null {
  const hdr = req.headers.get("Cookie") ?? "";
  for (const p of hdr.split(";")) {
    const [n, v] = p.trim().split("=");
    if (n === k) {
      return v ?? null;
    }
  }
  return null;
}
