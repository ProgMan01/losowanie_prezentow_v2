// Plik: lib/db.js
import { MongoClient } from 'mongodb';

// Używamy zmiennej środowiskowej MONGODB_URI.
// Jeśli MONGODB_URI nie jest zdefiniowane, używamy fikcyjnej wartości. 
// Dzięki temu Turbopack jest w stanie zakończyć kompilację bez błędu.
// UWAGA: Ta fikcyjna wartość MUSI BYĆ zastąpiona przez poprawną zmienną w Vercel ENV.
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://faux-build-user:faux-build-pass@localhost:27017/build-db';

if (!process.env.MONGODB_URI) {
  // Ostrzeżenie widoczne podczas kompilacji na Vercel
  console.warn("MONGODB_URI jest nieustawione. Używana jest fikcyjna wartość. Po wdrożeniu aplikacja ZAWIESI się bez poprawnej zmiennej w Vercel ENV.");
}

let client;
let clientPromise;

if (process.env.NODE_ENV === 'development') {
  // W trybie deweloperskim, używamy globalnego obiektu do cachowania obietnicy,
  // aby uniknąć problemów z hot-reloading.
  if (!global._mongoClientPromise) {
    client = new MongoClient(MONGODB_URI);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // W trybie produkcyjnym i podczas kompilacji
  client = new MongoClient(MONGODB_URI);
  clientPromise = client.connect();
}

/**
 * Zwraca obietnicę klienta bazy danych.
 * @returns {Promise<MongoClient>} Obietnica klienta MongoDB.
 */
export const getClientPromise = () => clientPromise;

/**
 * Zwraca kolekcję 'draws'.
 * @returns {Promise<import('mongodb').Collection>} Obietnica kolekcji 'draws'.
 */
export async function getDrawsCollection() {
    const client = await clientPromise;
    
    // Nazwa bazy danych powinna być zawarta w MONGODB_URI. 
    // Jeśli nie została podana, używamy domyślnej nazwy 'secret_santa_db'.
    const db = client.db(client.options.dbName || "secret_santa_db"); 

    // WAŻNE: Weryfikacja. Jeśli URI jest fikcyjne, lepiej rzucić błąd tutaj,
    // zanim spróbujemy wykonać operacje na bazie.
    if (!process.env.MONGODB_URI) {
        throw new Error("Krytyczny błąd: Wdrożenie nie ma ustawionej zmiennej środowiskowej MONGODB_URI w Vercel.");
    }

    return db.collection('draws');
}