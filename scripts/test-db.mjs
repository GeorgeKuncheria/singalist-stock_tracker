import mongoose from 'mongoose';
import * as dotenv from 'dotenv';

// Load environment variables from .env.local (Next.js convention)
// dotenv.config({ path: '.env.local' });
dotenv.config(); // Load from .env by default, which should include MONGODB_URI

const MONGODB_URI = process.env.MONGODB_URI || '';

const testConnection = async () => {
    // Guard: ensure the URI is present before attempting connection
    if (!MONGODB_URI) {
        console.error('MONGODB_URI is not set in your .env.local file');
        process.exit(1);
    }

    console.log('Attempting to connect to MongoDB...');
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);

    try {
        await mongoose.connect(MONGODB_URI, { bufferCommands: false });
        console.log('Successfully connected to MongoDB!');

        // Print some basic connection info
        const { host, port, name } = mongoose.connection;
        console.log(`Database : ${name}`);
        console.log(`Host     : ${host}`);
        console.log(`Port     : ${port}`);

    } catch (error) {
        console.error('Failed to connect to MongoDB:');
        console.error(error.message);
        process.exit(1);

    } finally {
        // Always close the connection after the test
        await mongoose.disconnect();
        console.log('Connection closed.');
    }
};

testConnection();