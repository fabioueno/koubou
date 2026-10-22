import { useEffect, useState } from "react";

const WAIT_SECONDS = 30;

export function CheckEmail({ email, again }: { email: string; again: boolean }) {
  const [left, setLeft] = useState(WAIT_SECONDS);

  useEffect(() => {
    if (left === 0) return;
    const timer = setTimeout(() => setLeft(left - 1), 1000);
    return () => clearTimeout(timer);
  }, [left]);

  return (
    <form method="post" action="/auth/send-link">
      <h1>Check your email</h1>
      <p>We sent a sign-in link to {email}.</p>
      <input type="hidden" name="email" value={email} />
      <button type="submit" disabled={left > 0}>
        {left > 0 ? `Send again in ${left}s` : "Send again"}
      </button>
      {again && <p>Sent again just now. Check spam if it is not there in a minute.</p>}
    </form>
  );
}
