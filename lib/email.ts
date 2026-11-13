/** Resend emails — wired in D2 */
export async function sendEmail(opts: {
  to: string;
  subject: string;
  body: string;
}) {
  void opts;
  throw new Error("email not configured (D2)");
}
