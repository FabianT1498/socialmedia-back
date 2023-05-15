import * as express from "express";
import * as dotenv from "dotenv";

import { configureMiddlewares } from "./middleware/global";

dotenv.config();

const app = express();

// DATABASE SETUP
import connect from "./config/database";
connect();

// GLOBAL MIDDLEWARES
configureMiddlewares(app);

// ROUTES
import authRouter from "./routes/authRoutes";
import userRouter from "./routes/userRoutes";
import postRouter from "./routes/postRoutes";

// 3) ROUTES
app.use("/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/posts", postRouter);

// app.use('/api/v1/products', productRouter);
// app.use('/api/v1/publicity', publicityRouter);
// app.use('/api/v1/visor', visorRouter);

export { app };
