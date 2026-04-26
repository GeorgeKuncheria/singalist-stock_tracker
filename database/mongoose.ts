import mongoose from 'mongoose';

// Pull the MongoDB connection string from environment variables
// Falls back to empty string — will throw a helpful error later if missing
const MONGODB_URI = process.env.MONGODB_URI || '';

// Extend the Node.js global type to include our custom cache
// This prevents TypeScript from complaining about global.mongooseCache
declare global {
    var mongooseCache: {
        conn: typeof mongoose | null;   // Holds the active connection once established
        promise: Promise<typeof mongoose> | null; // Holds the in-progress connection promise
    }
}

// Use the global cache to persist the connection across hot reloads in development
// Without this, Next.js dev mode would create a new connection on every file change
let cached = global.mongooseCache;

// Initialize the cache on first load if it doesn't exist yet
if (!cached) {
    cached = global.mongooseCache = { conn: null, promise: null };
}

export const connectToDatabase = async () => {
    // Guard: fail fast if no connection string is provided
    if (!MONGODB_URI) throw new Error('MONGODB_URI must be set');

    // If we already have an active connection, reuse it (connection pooling)
    if (cached.conn) return cached.conn;

    // If no connection is in progress, start one
    // bufferCommands: false means mongoose won't queue operations if disconnected
    if (!cached.promise) {
        cached.promise = mongoose.connect(MONGODB_URI, { bufferCommands: false });
    }

    try {
        // Wait for the connection promise to resolve and store the result
        cached.conn = await cached.promise;
    } catch (error) {
        // Reset the promise on failure so the next call can try again
        cached.promise = null; // Note: you have a typo here — 'cache' should be 'cached'
        throw error;
    }

    // Log which environment we connected in — useful for debugging staging vs production
    console.log(`Connected to database ${process.env.NODE_ENV} - ${process.env.MONGODB_URI}`);
}