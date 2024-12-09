import { Types } from "mongoose";
export interface IUser {
  _id: Types.ObjectId;
  id: string;
  name: string;
  email: string;
}
