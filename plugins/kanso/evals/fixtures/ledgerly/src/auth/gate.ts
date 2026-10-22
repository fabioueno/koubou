const WAIT_MS = 30 * 1000;

async function keyFor(email: string): Promise<string> {
  const bytes = new TextEncoder().encode(email.trim().toLowerCase());
  const digest = new Uint8Array(await crypto.subtle.digest("SHA-256", bytes));
  const hex = Array.from(digest, (b) => b.toString(16).padStart(2, "0"));
  return `link-gate:${hex.join("")}`;
}

/**
 * Allows one sign-in email per address every 30 seconds. A refused send
 * writes nothing, so the window runs from the last email that went out.
 */
export async function allowSend(kv: KVNamespace, email: string): Promise<boolean> {
  const key = await keyFor(email);
  const last = await kv.get(key);

  if (last && Date.now() - Number(last) < WAIT_MS) {
    return false;
  }

  await kv.put(key, String(Date.now()), { expirationTtl: 60 });
  return true;
}
