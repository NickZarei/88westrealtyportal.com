import mongoose from "mongoose";

const MONGO_URI = process.env.MONGODB_URI as string; // ✅ fixed

if (!MONGO_URI) {
  throw new Error("❌ MONGODB_URI not defined in environment variables.");
}

export default async function connectDB() {
  if (mongoose.connections[0].readyState) return;
  await mongoose.connect(MONGO_URI);
}
