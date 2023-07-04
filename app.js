import path from "path";
import * as dotenv from "dotenv";
import cors from "cors"
import express from "express";
import multer from "multer";
import morgan from "morgan";
import mongoose from "mongoose";
import authRouter from "./router/authRouter.js";
import pagesRouter from "./router/pagesRouter.js"
import tasksRouter from "./router/tasksRouter.js"
import cookieParser from "cookie-parser";
import tokenValidation from "./middleware/tokenValidation.js";
import ErrorValidation from "./middleware/ErrorValidation.js";

const app = express();

app.use(cors({
   origin: ["https://09b7-45-136-199-183.ngrok-free.app", "http://localhost:7000"],
   methods: ["GET", "PUT", "POST", "DELETE"],
   credentials: true
}));

app.use(cookieParser());

// app.use(morgan());
dotenv.config();

const __dirname = path.resolve();
const PORT = process.env.PORT;

const upload = multer({
   limits: {
      fileSize: 100000,
   }
});

app.set("view engine", "ejs");
app.set("views", path.resolve(__dirname, "views"));
app.use(express.static(path.resolve(__dirname, "public")));
app.use(express.json());
app.use(upload.none());


// роути
app.use("/", pagesRouter);
app.use("/api", tokenValidation, tasksRouter);
app.use("/account", authRouter);
app.use(ErrorValidation);


const start = async () => {
   try {
      await mongoose.connect(process.env.DB_URL, {
         useNewUrlParser: true,
         useUnifiedTopology: true
      });
      app.listen(PORT, () => "server work");
   } catch (error) {
      console.log(error)
   }
}

start()





