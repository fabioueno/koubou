export const ERR_INVALID_EMAIL = "invalid_email";
export const ERR_LINK_EXPIRED = "link_expired";
export const ERR_SESSION_REVOKED = "session_revoked";

export const messages: Record<string, string> = {
  [ERR_INVALID_EMAIL]:
    "It would appear that the email address which has been provided by you is not in a format that is able to be utilized by our system at this point in time.",
  [ERR_LINK_EXPIRED]:
    "Please be advised that the sign-in link that you have attempted to make use of has unfortunately expired, and in order to proceed you will need to request a new one.",
  [ERR_SESSION_REVOKED]:
    "Your session has been terminated, which may possibly be due to the fact that it was revoked from another device, so kindly sign in once again.",
};

export function messageFor(code: string): string {
  return messages[code] ?? "Something went wrong.";
}
