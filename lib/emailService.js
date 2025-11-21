// lib/emailService.js
import nodemailer from 'nodemailer';

// Sprawdzenie, czy kluczowe zmienne SMTP są dostępne
if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS || !process.env.EMAIL_FROM) {
    console.warn("[EMAIL WARNING] Brak pełnej konfiguracji zmiennych środowiskowych SMTP. Wysyłka e-maili zostanie pominięta.");
    // Możemy zwrócić "pusty" transporter, który nie będzie wysyłał wiadomości
    const mockTransporter = {
        sendMail: (mailOptions) => {
            console.warn(`[MOCK EMAIL] Pominięto wysyłkę do ${mailOptions.to}. Wymagana konfiguracja SMTP.`);
            return Promise.resolve({ success: true, messageId: 'MOCK_NO_CONFIG' });
        }
    };
    
    // Zastępujemy transporter mockiem, aby reszta kodu nie rzuciła błędu
    var transporter = mockTransporter; 
} else {
    const smtpPort = parseInt(process.env.SMTP_PORT || '587', 10);
    
    // Pełna konfiguracja transportera SMTP z timeoutami
    transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: smtpPort, 
        
        // NOWA ZMIANA: Ustaw secure: true jeśli port to 465 (SMTPS), inaczej false (STARTTLS dla 587/25)
        secure: smtpPort === 465, 
        
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
        // Dodatkowe opcje timeout, które pomogą wychwycić problemy z siecią
        connectionTimeout: 15000, // 15 sekund na ustanowienie połączenia
        greetingTimeout: 5000,   // 5 sekund na powitanie
        socketTimeout: 5000      // 5 sekund na przesył danych
    });
}


/**
 * Wysyła e-mail z wynikiem losowania do osoby losującej.
 */
export async function sendDrawResultEmail(toEmail, drawerName, receiver) {
    
    // Jeśli używamy mockTransportera, pomijamy rzeczywistą wysyłkę
    if (transporter.sendMail && transporter.sendMail.toString().includes('MOCK_NO_CONFIG')) {
        return transporter.sendMail({ to: toEmail });
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