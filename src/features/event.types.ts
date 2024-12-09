import { IUser } from "./user.types";
export interface IEvent {
  id: string;
  host_id: IUser;
  number_persons: number;
  date_time: Date;
  boardgame_name: string;
  description: string;
  price: number;
  boardgame_img_url: string;
  accepted_persons_ids: IUser[];
}
