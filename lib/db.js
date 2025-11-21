import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("Brakuje zmiennej środowiskowej MONGODB_URI!");
}

let client;
let clientPromise;

// Użycie globalnej zmiennej, aby uniknąć ponownego łączenia w trybie deweloperskim
if (!global._mongoClientPromise) {
  client = new MongoClient(uri);
  global._mongoClientPromise = client.connect();
}

clientPromise = global._mongoClientPromise;

/**
 * Zwraca instancję bazy danych.
 * @param {string} dbName - Nazwa bazy danych (domyślnie 'secret_santa').
 */
export async function getDb(dbName = "secret_santa") {
  const client = await clientPromise;
  return client.db(dbName);
}

/**
 * Zwraca kolekcję 'draws'.
 */
export async function getDrawsCollection() {
  const db = await getDb();
  // Zwracamy obiekt kolekcji, który ma metody takie jak find(), insertOne() itp.
  return db.collection("draws");
}

/**
 * Zwraca kolekcję 'participants'.
 */
export async function getParticipantsCollection() {
  const db = await getDb();
  // Zwracamy obiekt kolekcji 'participants'
  return db.collection("participants");
}