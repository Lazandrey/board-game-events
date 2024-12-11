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
  boardgame_name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  boardgame_img_url: { type: String, required: true },
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
});

export default mongoose.model("Event", eventSchema);
