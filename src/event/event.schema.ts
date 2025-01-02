import mongoose from "mongoose";

import { IEvent } from "./event.types";

const eventSchema = new mongoose.Schema<IEvent>({
  id: { type: String, required: true },
  host: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  number_persons: { type: Number, required: true },
  date_time: { type: Date, required: true },
  game: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Game",
    required: true,
  },
  description: {
    type: String,
    required: [true, "need description"],
    default: "",
  },
  price: { type: Number, required: true },
  accepted_persons_ids: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      addedAt: { type: Date, default: Date.now },
    },
  ],
  isCanceled: { type: Boolean, default: false },
  address: {
    street: { type: String },
    city: { type: String },
    country: { type: String },
  },
  rawAddress: { type: String },
  geolocation: {
    type: { type: String },
    coordinates: [Number],
  },
});

export default mongoose.model("Event", eventSchema);
