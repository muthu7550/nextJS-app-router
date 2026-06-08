import mongoose from "mongoose";

const MONGODB_URI = "MONGODB_URI=mongodb+srv://mecmarimuthuit:marimuthu@cluster0.sfbeg.mongodb.net/jobportal?retryWrites=true&w=majority";

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = {
    conn: null,
    promise: null,
  };
}

async function dbConnect() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI);
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    console.error("MongoDB Error:", error);
    throw error;
  }

  return cached.conn;
}

export default dbConnect;