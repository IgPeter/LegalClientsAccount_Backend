import express from "express";
import mongoose from "mongoose";
import morgan from "morgan";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import usersRouter from "./routes/user.js";
import walletRouter from "./routes/wallet.js";
import kycRouter from "./routes/kyc.js";
import adminRouter from "./routes/admin.js";
dotenv.config();

const app = express();

//.env attributes
const api = process.env.API_URL;
const DB_CONN_STRING = process.env.DB_CONN_STRING;
const PORT = process.env.PORT;

//configuring dirname
const filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(filename);

app.use(morgan("tiny"));
app.use(bodyParser.json());

//serve static files
app.use(`/upload`, express.static(path.join(__dirname, "public", "upload")));

//configuring routes
app.use(`${api}/users`, usersRouter);
app.use(`${api}/wallet`, walletRouter);
app.use(`${api}/kyc`, kycRouter);
app.use(`${api}/admin`, adminRouter);

//Database connection
mongoose
  .connect(DB_CONN_STRING)
  .then(() => {
    console.log("Database Connected Successfully...");
  })
  .catch((error) => {
    throw new Error("Database Connection Failed...", error);
  });

app.listen(PORT, () => {
  console.log(`app running at port ${PORT}`);
});
