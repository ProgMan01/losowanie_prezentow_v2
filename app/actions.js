// app/actions.js
'use server'; // Wymagane dla Server Actions w Next.js

import { getDrawsCollection } from '@/lib/db';
import { sendDrawResultEmail } from '@/lib/emailService';
import participants from '@/data.json'; // Załóż, że data.json jest w katalogu głównym

/**
 * Główna akcja serwerowa do obsługi losowania Secret Santa.
 * @param {FormData} formData - Dane z formularza, zawierające 'email' losującego.
 * @returns {Promise<{success: boolean, message: string, receiver?: {name: string, email: string}}>}
 */
export async function performDraw(formData) {
  const email = formData.get('email')?.toLowerCase().trim();
  
  // 1. Walidacja i Weryfikacja Losującego
  if (!email || !email.includes('@')) {
    return { success: false, message: 'Wprowadź poprawny adres e-mail.' };
  }

  const drawer = participants.find(p => p.email.toLowerCase() === email);
  if (!drawer) {
    return { success: false, message: 'Brak Twojego adresu e-mail na liście uczestników.' };
  }
  
  // 2. Pobranie danych z bazy (Osoba 2)
  const { collection } = await getDrawsCollection();
  
  // 3. Sprawdzenie, czy Losujący już losował (Wymaganie)
  const existingDraw = await collection.findOne({ drawerEmail: email });
  if (existingDraw) {
    // Zwrócenie poprzedniego wyniku
    return { 
      success: true, 
      message: 'Już losowałeś/aś. Oto Twój poprzedni wynik:', 
      receiver: { name: existingDraw.receiverName, email: existingDraw.receiverEmail } 
    };
  }

  // 4. Pobranie wszystkich już wylosowanych odbiorców (Wymaganie: nikt nie może być wylosowany dwa razy)
  const drawnReceivers = await collection.find({}, { projection: { receiverEmail: 1 } }).toArray();
  const drawnReceiverEmails = drawnReceivers.map(d => d.receiverEmail.toLowerCase());

  // 5. Filtracja Dostępnych Osób
  const availableReceivers = participants.filter(p => 
    // a) Nie może wylosować samego siebie
    p.email.toLowerCase() !== email && 
    // b) Nie może wylosować osoby, która już została wylosowana
    !drawnReceiverEmails.includes(p.email.toLowerCase())
  );

  if (availableReceivers.length === 0) {
    return { success: false, message: 'Brak wolnych osób do wylosowania. Pula osób wyczerpana.' };
  }

  // 6. Losowanie (Logika)
  const randomIndex = Math.floor(Math.random() * availableReceivers.length);
  const receiver = availableReceivers[randomIndex];

  // 7. Utworzenie dokumentu do zapisu
  const newDraw = {
    drawerEmail: drawer.email,
    drawerName: drawer.name,
    receiverEmail: receiver.email,
    receiverName: receiver.name,
    createdAt: new Date(),
  };

  try {
    // 8. Zapisanie losowania do MongoDB (Osoba 2)
    await collection.insertOne(newDraw);
    
    // 9. Wysyłka e-maila do losującego (Osoba 4)
    // To jest kluczowy punkt integracji
    await sendDrawResultEmail(drawer.email, drawer.name, receiver);

    // 10. Zwrócenie pomyślnego wyniku na frontend
    return { 
      success: true, 
      message: 'Pomyślnie wylosowano! Sprawdź też swoją skrzynkę e-mail.', 
      receiver 
    };

  } catch (error) {
    console.error('Krytyczny błąd podczas zapisu/wysyłki:', error);
    // Błąd może wynikać z DB lub SMTP.
    return { success: false, message: `Błąd serwera. Spróbuj ponownie lub skontaktuj się z administratorem: ${error.message}` };
  }
}