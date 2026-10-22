export async function sendSignInEmail(mailer: SendEmail, to: string, link: string): Promise<void> {
  await mailer.send({
    from: "sign-in@ledgerly.app",
    to,
    subject: "Your Ledgerly sign-in link",
    text: `Open this link to sign in. It works once, for 15 minutes.\n\n${link}`,
  });
}
