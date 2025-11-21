'use server'; // Wymagane dla Server Actions w Next.js

import { getDrawsCollection, getParticipantsCollection } from '@/lib/db';
import { sendDrawResultEmail } from '@/lib/emailService';

/**
 * Pobiera aktualną listę wszystkich uczestników z bazy danych.
 * @returns {Promise<Array<{name: string, email: string}>>}
 */
export async function getAllParticipants() {
    try {
        const participantsCollection = await getParticipantsCollection();
        
        // Pobieramy całą listę, filtrując tylko potrzebne pola
        const participants = await participantsCollection.find({}, { 
            projection: { name: 1, email: 1, _id: 0 } 
        }).toArray();

        return participants;
    } catch (error) {
        console.error('Błąd podczas pobierania listy uczestników:', error);
        return [];
    }
}


/**
 * Rejestruje nowego uczestnika w bazie danych.
 * @param {string} email - E-mail nowego uczestnika.
 * @param {string} name - Imię i nazwisko nowego uczestnika.
 * @returns {Promise<{success: boolean, message: string}>}
 */
export async function registerParticipant(email, name) {
    try {
        const participantsCollection = await getParticipantsCollection();
        
        const lowerCaseEmail = email.toLowerCase().trim();
        
        // 1. Sprawdzenie, czy uczestnik już istnieje
        const existingParticipant = await participantsCollection.findOne({ email: lowerCaseEmail });

        if (existingParticipant) {
            return { success: true, message: `E-mail ${name} jest już zarejestrowany. Witaj z powrotem!` };
        }

        // 2. Zapisanie nowego uczestnika
        const newParticipant = {
            name: name.trim(),
            email: lowerCaseEmail,
            createdAt: new Date(),
        };

        await participantsCollection.insertOne(newParticipant);

        return { success: true, message: `Pomyślnie zarejestrowano ${name.trim()}! Dołączono do puli losowania.` };

    } catch (error) {
        console.error('Błąd podczas rejestracji uczestnika:', error);
        return { success: false, message: 'Wystąpił błąd serwera podczas rejestracji.' };
    }
}


/**
 * Główna akcja serwerowa do obsługi losowania Secret Santa.
 * @param {FormData} formData - Dane z formularza, zawierające 'email' losującego.
 * @returns {Promise<{success: boolean, message: string, receiver?: {name: string, email: string}}>}
 */
export async function performDraw(formData) {
    const email = formData.get('email')?.toLowerCase().trim();
    
    // 1. Walidacja
    if (!email || !email.includes('@')) {
        return { success: false, message: 'Wprowadź poprawny adres e-mail.' };
    }
    
    // 2. Dynamiczne pobranie listy uczestników z bazy!
    const participants = await getAllParticipants(); 

    const drawer = participants.find(p => p.email.toLowerCase() === email);
    if (!drawer) {
        return { success: false, message: 'Brak Twojego e-maila na liście uczestników. Zarejestruj się w sekcji obok!' };
    }
    
    // 3. Pobranie kolekcji 'draws'
    const drawsCollection = await getDrawsCollection();
    
    // 4. Sprawdzenie, czy Losujący już losował
    const existingDraw = await drawsCollection.findOne({ drawerEmail: email });
    if (existingDraw) {
        // Zwrócenie poprzedniego wyniku
        return { 
            success: true, 
            message: 'Już losowałeś/aś. Oto Twój poprzedni wynik:', 
            receiver: { name: existingDraw.receiverName, email: existingDraw.receiverEmail } 
        };
    }

    // 5. Pobranie wszystkich już wylosowanych odbiorców
    const drawnReceivers = await drawsCollection.find({}, { projection: { receiverEmail: 1 } }).toArray();
    const drawnReceiverEmails = drawnReceivers.map(d => d.receiverEmail.toLowerCase());

    // 6. Filtracja Dostępnych Osób
    const availableReceivers = participants.filter(p => 
        // a) Nie może wylosować samego siebie
        p.email.toLowerCase() !== email && 
        // b) Nie może wylosować osoby, która już została wylosowana
        !drawnReceiverEmails.includes(p.email.toLowerCase())
    );

    if (availableReceivers.length === 0) {
        const allDrawn = participants.length > 0 && drawnReceivers.length === participants.length;
        if (allDrawn) {
             return { success: false, message: 'Losowanie Secret Santa zostało zakończone. Wszyscy wylosowali!' };
        }
        return { success: false, message: 'Brak wolnych osób do wylosowania. Spróbuj później, gdy dołączą nowi uczestnicy.' };
    }

    // 7. Losowanie
    const randomIndex = Math.floor(Math.random() * availableReceivers.length);
    const receiver = availableReceivers[randomIndex];

    // 8. Utworzenie i Zapisanie dokumentu
    const newDraw = {
        drawerEmail: drawer.email,
        drawerName: drawer.name,
        receiverEmail: receiver.email,
        receiverName: receiver.name,
        createdAt: new Date(),
    };

    try {
        await drawsCollection.insertOne(newDraw);
        
        // 9. Wysyłka e-maila
        await sendDrawResultEmail(drawer.email, drawer.name, receiver);

        // 10. Zwrócenie pomyślnego wyniku na frontend
        return { 
            success: true, 
            message: 'Pomyślnie wylosowano! Sprawdź swoją skrzynkę e-mail.', 
            receiver 
        };

    } catch (error) {
        console.error('Krytyczny błąd podczas zapisu/wysyłki:', error);
        return { success: false, message: `Błąd serwera. Spróbuj ponownie lub skontaktuj się z administratorem.` };
    }
}