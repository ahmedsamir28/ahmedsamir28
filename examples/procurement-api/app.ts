import 'dotenv/config';
import express from 'express';
import path from 'path';
import morgan from 'morgan';
import { connectDatabase } from './config/database';
import userRoutes from './routes/user.routes';
import { globalError, notFound } from './middlewares/error.middleware';

const app = express();

const PORT = process.env.PORT;
const NODE_ENV = process.env.NODE_ENV;

if (!PORT || !NODE_ENV) {
  throw new Error('Missing required environment variables: PORT and NODE_ENV');
}

app.use(express.json());
app.use(express.static(path.join(__dirname, 'uploads')));

if (NODE_ENV === 'development') {
  app.use(morgan('dev'));
  console.log(`Mode: ${NODE_ENV}`);
}

app.use('/api/v1', userRoutes);

app.use(notFound);
app.use(globalError);

const startServer = async (): Promise<void> => {
  await connectDatabase();

  const server = app.listen(Number(PORT), () => {
    console.log(`🚀 App running on port ${PORT}`);
  });

  process.on('unhandledRejection', (err: unknown) => {
    if (err instanceof Error) {
      console.error(`Unhandled Rejection: ${err.name} | ${err.message}`);
    } else {
      console.error('Unhandled Rejection: Unknown error type', err);
    }

    server.close(() => {
      console.error('Shutting down...');
      process.exit(1);
    });
  });
};

void startServer();
