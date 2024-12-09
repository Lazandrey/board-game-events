import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { ICreateEvent } from "../features/createEvent.types";
import { ICreateUser } from "../features/createUser.types";
import userModel from "../model/user";
import eventModel from "../model/event";
import { isValidCreateEvent } from "../utils/validations";

export const CREATE_EVENT = async (req: Request, res: Response) => {
  try {
    const host = await userModel.findOne({ id: req.body.userId });

    if (!host) {
      return res.status(401).json({ message: "You have provided bad data" });
    }

    const errors = await isValidCreateEvent(req.body);

    if (errors.length > 0) {
      return res
        .status(400)
        .json({ message: "we have some problems", errors: errors });
    }

    const newEvent: ICreateEvent = {
      id: uuidv4(),
      host_id: host._id,
      number_persons: req.body.number_persons,
      date_time: req.body.date_time,
      boardgame_name: req.body.boardgame_name,
      description: req.body.description,
      price: req.body.price,
      boardgame_img_url: req.body.boardgame_img_url,
      accepted_persons_ids: [],
    };

    const event = await eventModel.create(newEvent);
    const response = await event.save();

    return res.status(201).json({ message: "event created", event: response });
  } catch (error) {
    return res.status(500).json({ message: "something went wrong", error });
  }
};
