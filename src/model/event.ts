import mongoose from "mongoose";

import { IEvent } from "../features/event.types";

const eventSchema = new mongoose.Schema<IEvent>({
  id: { type: String, required: true },
  host_id: {
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
  accepted_persons_ids: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  isCanceled: { type: Boolean, default: false },
});

export default mongoose.model("Event", eventSchema);
