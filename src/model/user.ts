import mongoose from "mongoose";
import { ICreateUser } from "../features/createUser.types";

const userSchema = new mongoose.Schema<ICreateUser>({
  id: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
});

export default mongoose.model("User", userSchema);
