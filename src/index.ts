import express from "express";
import cors from "cors";
import mongoose from "mongoose";

import "dotenv/config";

import userRouter from "./route/user";
import eventRouter from "./route/event";

const port = process.env.PORT || 3000;

const app = express();
app.use(cors());
app.use(express.json());

app.use(userRouter);
app.use(eventRouter);

app.use((req, res) => {
  res.status(404).json({ response: "your endpoint does not exit" });
});

const main = async () => {
  try {
    await mongoose.connect(process.env.MONGO_CONNECTION as string, {
      dbName: "boardgameevents",
    });
    console.log("Connected!");
    app.listen(port, () => {
      console.log(`App listening on http://localhost:${port}`);
    });
  } catch (error) {
    console.log("bad connection");
    console.log(error);
  }
};
main();
