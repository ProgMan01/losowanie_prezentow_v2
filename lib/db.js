import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("Brakuje zmiennej środowiskowej MONGODB_URI!");
}

let client;
let clientPromise;

if (!global._mongoClientPromise) {
  client = new MongoClient(uri);
  global._mongoClientPromise = client.connect();
}

clientPromise = global._mongoClientPromise;

export async function getDb(dbName = "secret_santa") {
  const client = await clientPromise;
  return client.db(dbName);
}

export async function getDrawsCollection() {
  const db = await getDb();
  return db.collection("draws");
}
