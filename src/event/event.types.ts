import { IUser } from "../user/user.types";
import { Types } from "mongoose";
export type IEvent = {
  _id: Types.ObjectId;
  id: string;
  host: IUser;
  number_persons: number;
  date_time: Date;
  boardgame_name: string;
  description: string;
  price: number;
  boardgame_img_url: string;
  accepted_persons_ids: { user: Types.ObjectId; addedAt: Date }[];
  isCanceled: boolean;
  address: { street: string; city: string; country: string };
};
export type ICreateEvent = {
  id: string;
  host: string | Types.ObjectId;
  number_persons: number;
  date_time: Date;
  boardgame_name: string;
  description: string;
  price: number;
  boardgame_img_url: string;
  accepted_persons_ids: {
    user: string;
    addedAt: Date;
  }[];
  isCanceled: boolean;
  address: { street: string; city: string; country: string };
};
