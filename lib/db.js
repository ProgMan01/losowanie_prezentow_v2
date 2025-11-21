// Plik: lib/db.js
import { MongoClient } from 'mongodb';

// Zmienna środowiskowa MONGODB_URI jest ABSOLUTNIE WYMAGANA dla działania
// w Next.js w trybie Server Component lub Route Handler.
const MONGODB_URI = process.env.MONGODB_URI;

// Weryfikacja, czy URI jest ustawione
if (!MONGODB_URI) {
  // Rzucenie błędu, jeśli brakuje URI. 
  // Ten błąd był widziany na Vercel i jest prawidłowy, bo aplikacja bez bazy nie działa.
  // W Vercel musimy go przekazać w ustawieniach ENV.
  throw new Error('Brakuje zmiennej środowiskowej MONGODB_URI!');
}

let cachedClient = null;
let cachedPromise = null;

/**
 * Inicjuje klienta MongoDB. Używa cachowania w trybie development
 * i nowego klienta w trybie production/build.
 * @returns {Promise<MongoClient>} Obietnica klienta MongoDB.
 */
async function connectToDatabase() {
  // Jeśli jest cachowany klient, zwróć go natychmiast
  if (cachedClient) {
    return cachedClient;
  }

  // Jeśli jest już obietnica połączenia w toku, zwróć ją
  if (cachedPromise) {
    return cachedPromise;
  }

  // Tworzymy nową obietnicę połączenia
  const client = new MongoClient(MONGODB_URI);
  cachedPromise = client.connect().then(connectedClient => {
      // Pomyślne połączenie, cachujemy klienta
      cachedClient = connectedClient;
      // Czyścimy obietnicę, aby umożliwić ponowne połączenie w razie błędu
      cachedPromise = null; 
      return connectedClient;
  }).catch(error => {
      // W przypadku błędu, usuwamy obietnicę i rzucamy błąd dalej
      cachedPromise = null; 
      throw error;
  });

  return cachedPromise;
}

/**
 * Zwraca kolekcję 'draws' z domyślnej bazy danych.
 * @returns {Promise<import('mongodb').Collection>} Obietnica kolekcji 'draws'.
 */
export async function getDrawsCollection() {
    const client = await connectToDatabase();
    
    // Parsowanie nazwy bazy danych z URI jest najbardziej niezawodne, 
    // ale jeśli nie została podana, użyjemy domyślnej z URI.
    // Zazwyczaj nazwa bazy jest częścią URI (np. /nazwa_bazy?retryWrites=true).
    // Jeśli Twoje URI jej nie zawiera, użyjemy domyślnej nazwy 'secret_santa_db'.
    const defaultDbName = client.options.dbName || "secret_santa_db";
    
    // Jeśli URI jest poprawnie sformatowane (np. kończy się na /nazwa_bazy), to zostanie użyta ta nazwa.
    const db = client.db(defaultDbName); 

    return db.collection('draws');
}