import mongoose, { Types } from "mongoose";
import { ICreateEvent } from "../features/createEvent.types";
import { IUser } from "../features/user.types";
import { IEvent } from "../features/event.types";
import user from "./user";

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
});

export default mongoose.model("Event", eventSchema);
