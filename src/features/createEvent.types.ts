import { Types } from "mongoose";

export interface ICreateEvent {
  id: string;
  host: Types.ObjectId;
  number_persons: number;
  date_time: Date;
  boardgame_name: string;
  description: string;
  price: number;
  boardgame_img_url: string;
  accepted_persons_ids: [];
  isCanceled: boolean;
}
