import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI!;
const client = new MongoClient(uri);

let cachedDb: any = null;

export async function connectToDB() {
  if (cachedDb) return cachedDb;

  try {
    if (!client.topology?.isConnected()) {
      await client.connect();
    }
    cachedDb = client.db("portal");
    return cachedDb;
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw new Error("Failed to connect to MongoDB");
  }
}
