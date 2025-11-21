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
 * @param {string} email - FAŁSZYWY E-mail (TO JEST IMIĘ/NAZWA, z powodu błędnego wywołania na froncie).
 * @param {string} name - FAŁSZYWE Imię/Nazwisko (TO JEST E-MAIL, z powodu błędnego wywołania na froncie).
 * @returns {Promise<{success: boolean, message: string}>}
 */
export async function registerParticipant(email, name) {
    try {
        const participantsCollection = await getParticipantsCollection();
        
        // KLUCZOWE: Odwracamy argumenty, aby pasowały do poprawnego formatu w bazie.
        const actualEmail = name.toLowerCase().trim();
        const actualName = email.trim();
        
        // 1. Sprawdzenie, czy uczestnik już istnieje
        const existingParticipant = await participantsCollection.findOne({ email: actualEmail });

        if (existingParticipant) {
            // Używamy nazwy z bazy, która powinna być teraz poprawnym imieniem.
            return { success: true, message: `E-mail ${existingParticipant.name} jest już zarejestrowany. Witaj z powrotem!` };
        }

        // 2. Zapisanie nowego uczestnika
        const newParticipant = {
            name: actualName, 
            email: actualEmail,
            createdAt: new Date(),
        };

        await participantsCollection.insertOne(newParticipant);

        return { success: true, message: `Pomyślnie zarejestrowano ${actualName}! Dołączono do puli losowania.` };

    } catch (error) {
        console.error('Błąd podczas rejestracji uczestnika:', error);
        return { success: false, message: 'Wystąpił błąd serwera podczas rejestracji.' };
    }
}


/**
 * Główna akcja serwerowa do obsługi losowania Secret Santa.
 * * @param {FormData | Object} data - Dane z formularza lub obiekt zawierający 'email'.
 * @returns {Promise<{success: boolean, message: string, receiver?: {name: string, email: string}}>}
 */
export async function performDraw(data) {
    let email;
    
    // --- DIAGNOSTYKA START ---
    console.log('--- START DIAGNOSTYKA performDraw ---');
    console.log('Typ otrzymanego argumentu:', typeof data);
    
    if (data && typeof data.get === 'function') {
        console.log('Wykryto format FormData. Próbuję odczytać email z klucza "email".');
        email = data.get('email')?.toLowerCase().trim();
        console.log('Wartość email po FormData.get("email"):', email);
        
        // Dodatkowa diagnostyka dla FormData:
        // Pętla po wszystkich kluczach w FormData
        if (data instanceof FormData) {
             for (let pair of data.entries()) {
                console.log(`Klucz FormData: ${pair[0]}, Wartość: ${pair[1]}`);
             }
        }
    } 
    else if (data && typeof data === 'object') {
        console.log('Wykryto format Obiektu JS. Sprawdzam klucze.');
        console.log('Cały obiekt data:', data);

        // Fallback: Jeśli front-end przekazał e-mail jako jedyny argument bez klucza, użyjemy go.
        if (typeof data.email === 'string') {
            email = data.email.toLowerCase().trim();
        } else if (typeof data === 'string' && data.includes('@')) {
            email = data.toLowerCase().trim();
        }
        
    } else if (typeof data === 'string' && data.includes('@')) {
        // Fallback: Gdyby ktoś wywołał akcję bezpośrednio jako performDraw("email@example.com")
        email = data.toLowerCase().trim();
    }
    
    console.log('Końcowa wartość email przed walidacją:', email);
    console.log('--- KONIEC DIAGNOSTYKA performDraw ---');
    // --- DIAGNOSTYKA KONIEC ---
    
    // 1. Walidacja poprawności e-maila (np. czy zawiera @)
    if (!email || !email.includes('@')) {
        // Skoro email jest pusty, wyświetlamy ten błąd.
        return { success: false, message: 'Wprowadź poprawny adres e-mail.' };
    }
    
    // 2. Dynamiczne pobranie listy uczestników z bazy!
    const participants = await getAllParticipants(); 

    // 3. Sprawdzenie, czy losujący jest na liście (szukamy po polu 'email')
    const drawer = participants.find(p => p.email.toLowerCase() === email);
    if (!drawer) {
        // Poprawiony komunikat
        return { success: false, message: `Brak Twojego e-maila (${email}) na liście uczestników. Zarejestruj się w sekcji obok!` };
    }
    
    // ... Dalsza logika losowania pozostaje bez zmian.
    
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