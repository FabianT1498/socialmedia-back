import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

dotenv.config();

import connect from "./config/database";
connect();

const app = express();

app.use(express.json({ limit: "10kb" }));

// const session = require("express-session");

const authRouter = require("./routes/authRoutes");

// 3) ROUTES
app.use("/", authRouter);

// app.use('/api/v1/products', productRouter);
// app.use('/api/v1/publicity', publicityRouter);
// app.use('/api/v1/visor', visorRouter);

export { app };
