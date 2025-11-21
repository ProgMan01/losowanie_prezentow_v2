// lib/emailService.js
import nodemailer from "nodemailer";

let transporter = null;

/**
 * Tworzy transporter SMTP — singleton
 */
function getTransporter() {
  if (transporter) return transporter;

  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;

  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
    console.warn("⚠️ SMTP credentials missing — email sending disabled.");
    return null;
  }

  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: Number(SMTP_PORT) === 465, // secure only for 465
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS
    }
  });

  return transporter;
}

/**
 * Wysyła e-maila z wynikiem losowania Secret Santa.
 */
export async function sendDrawEmail(to, drawerName, receiver) {
  const transport = getTransporter();
  if (!transport) {
    console.log("Email skipped (SMTP not configured).");
    return;
  }

  const from = process.env.EMAIL_FROM || "losowania@itmakeovers.com.pl";

  const subject = "🎁 Twój wynik losowania Secret Santa";

  const text = `Cześć ${drawerName}!

Wylosowałeś/łaś:
${receiver.name} <${receiver.email}>

Powodzenia przy wyborze prezentu! 🎄
`;

  const html = `
    <p>Cześć <strong>${drawerName}</strong>!</p>
    <p>Wylosowałeś/łaś osobę:</p>
    <p><strong>${receiver.name}</strong> &lt;${receiver.email}&gt;</p>
    <p>Powodzenia przy wyborze prezentu 🎁</p>
    <p>Pozdrawiamy,<br><strong>Secret Santa Team 🎄</strong></p>
  `;

  await transport.sendMail({
    from,
    to,
    subject,
    text,
    html
  });

  console.log("📧 Email sent to:", to);
}
