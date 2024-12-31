import { Types } from "mongoose";

export type IUser = {
  _id: Types.ObjectId;
  id: string;
  name: string;
  email: string;
};
export type ICreateUser = {
  id: string;
  name: string;
  email: string;
  password: string;
};
export type IUpdateUser = {
  id: string;
  name: string;
  email: string;
  password: string;
  newPassword: string;
};
