import mongoose from 'mongoose';

export const connectDatabase = async (): Promise<void> => {
  const mongoUrl = process.env.MONGODB_URL;

  if (!mongoUrl) {
    throw new Error('Missing required environment variable: MONGODB_URL');
  }

  const conn = await mongoose.connect(mongoUrl);
  console.log(`✅ Database connected: ${conn.connection.host}`);
};
