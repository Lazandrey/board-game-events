import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import "dotenv/config";

import tenantRouter from "./src/route/tenant.js";
import accomodationRouter from "./src/route/accommodation.js";
import offerRouter from "./src/route/offer.js";
import clientRouter from "./src/route/client.js";
import offerListRouter from "./src/route/offerlist.js";
import bookingRouter from "./src/route/booking.js";

const app = express();

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_CONNECTION, { dbName: "bookings" })
  .then(() => console.log("Connected!"))
  .catch(() => {
    console.log("bad connection");
  });
app.use(tenantRouter);
app.use(accomodationRouter);
app.use(offerRouter);
app.use(clientRouter);
app.use(offerListRouter);
app.use(bookingRouter);

app.use((req, res) => {
  res.status(404).json({ response: "your endpoint does not exit" });
});

app.listen(process.env.PORT, () => {
  console.log(`App listening on http://localhost:${process.env.PORT}`);
});
