import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import cors from "cors";

import indexRouter from "./routes/index.js";
import authRouter, { authenticate } from "./routes/auth.js";

var app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors({ credentials: true, origin: "http://localhost:3000" })); //This origin should be pointing at your frontend's URL
// app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/auth/", authenticate, authRouter);

export default app;
