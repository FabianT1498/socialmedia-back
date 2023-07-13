import * as express from 'express';
import * as dotenv from 'dotenv';

// MIDDLEWARES
import { configureGlobalMiddleware } from './middleware/configureGlobalMiddleware';
import { errorHandlerMiddleware } from './middleware/errorHandlerMiddleware';

dotenv.config();

// DATABASE
import connect from './config/database';

// ROUTES
import authRouter from './routes/authRoutes';
import userRouter from './routes/userRoutes';
// import postRouter from './routes/postRoutes';

const app = express();

(async () => {
  try {
    // DATABASE SETUP
    await connect();

    // GLOBAL MIDDLEWARES
    configureGlobalMiddleware(app);

    // 3) ROUTES
    app.use('/auth', authRouter);
    app.use('/api/v1/users', userRouter);
    // app.use('/api/v1/posts', postRouter);

    errorHandlerMiddleware(app);
  } catch (err) {
    console.error('Error connecting to the database:', err);
    process.exit(1);
  }
})();

export { app };
