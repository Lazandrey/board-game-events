import mongoose from "mongoose";

import { Game } from "./game.types";

const gameSchema = new mongoose.Schema<Game>({
  id: { type: String, required: true },
  title: { type: String, required: true },
  rating: { type: Number, required: true },
  usersrated: { type: Number, required: true },
  minPlayers: { type: Number, required: true },
  maxPlayers: { type: Number, required: true },
  minPlayTime: { type: Number, required: true },
  maxPlayTime: { type: Number, required: true },
  weight: { type: Number, required: true },
  gameImageUrl: { type: String, required: true },
  age: { type: Number, required: true },
  description: { type: String, required: true },
});

export default mongoose.model("Game", gameSchema);
