// lib/emailService.js
import nodemailer from 'nodemailer';

// Konfiguracja transportera SMTP z wykorzystaniem zmiennych środowiskowych
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT, 10),
  secure: false, // Ustaw na true, jeśli port to 465
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

/**
 * Wysyła e-mail z wynikiem losowania do osoby losującej.
 */
export async function sendDrawResultEmail(toEmail, drawerName, receiver) {
  // Opcjonalny warunek na wypadek braku konfiguracji SMTP
  if (!process.env.SMTP_USER || !process.env.EMAIL_FROM) {
    console.warn(`[EMAIL WARNING] Brak konfiguracji SMTP. E-mail do ${toEmail} nie został wysłany. Wylosowano: ${receiver.name}`);
    return { success: true, messageId: 'MOCK_NO_CONFIG' };
  }
  
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: toEmail,
    subject: 'Twoja Wylosowana Osoba Secret Santa! 🎅',
    html: `
      <div style="font-family: sans-serif; padding: 20px; border: 1px solid #d4c82c; border-radius: 8px;">
        <h2 style="color: #B22222;">Witaj ${drawerName},</h2>
        <p>Twoje losowanie Secret Santa zostało zakończone!</p>
        <p style="font-size: 1.2em; font-weight: bold; color: #006400;">
          Masz przygotować prezent dla: ${receiver.name} (${receiver.email})
        </p>
        <p>Pamiętaj o ustalonym budżecie i miłej zabawie! Wesołych Świąt!</p>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: %s', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Błąd wysyłki e-maila:', error);
    // Rzucamy błąd, aby akcja serwerowa mogła go obsłużyć.
    throw new Error(`Nie udało się wysłać e-maila z wynikiem: ${error.message}`);
  }
}