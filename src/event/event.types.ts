import { IUser } from "../user/user.types";
import { Game } from "../game/game.types";
import { Types } from "mongoose";
export type IEvent = {
  _id: Types.ObjectId;
  id: string;
  host: IUser;
  number_persons: number;
  date_time: Date;
  game: Game;
  description: string;
  price: number;
  accepted_persons_ids: { user: Types.ObjectId; addedAt: Date }[];
  isCanceled: boolean;
  address: { street: string; city: string; country: string };
  rawAddress: string;
  geolocation: {
    type: "Point";
    coordinates: [number];
  };
};
export type ICreateEvent = {
  id: string;
  host: string | Types.ObjectId;
  number_persons: number;
  date_time: Date;
  game: string | Types.ObjectId;
  description: string;
  price: number;
  accepted_persons_ids: {
    user: string | Types.ObjectId;
    addedAt: Date;
  }[];
  isCanceled: boolean;
  address: { street: string; city: string; country: string };
  rawAddress: string;
  geolocation: {
    type: "Point" | string;
    coordinates: number[];
  };
};
