import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { ICreateEvent } from "./event.types";
import userModel from "../user/user.schema";
import eventModel from "./event.schema";
import gameModel from "../game/game.schema";
import { isValidCreateEvent } from "../utils/validations";

export const CREATE_EVENT = async (req: Request, res: Response) => {
  try {
    const host = await userModel.findOne({ id: req.body.userId });
    if (!host) {
      return res.status(401).json({ message: "You have provided bad data" });
    }
    const game = await gameModel.findById(req.body.game);

    if (!game) {
      return res
        .status(401)
        .json({ message: "Game not found. You have provided bad data" });
    }
    req.body.host = host._id;
    const errors = await isValidCreateEvent(req.body);

    if (Array.isArray(errors)) {
      return res
        .status(400)
        .json({ message: "we have some problems", errors: errors });
    }

    const newEvent: ICreateEvent = {
      id: uuidv4(),
      host: host._id,
      number_persons: req.body.number_persons,
      date_time: req.body.date_time,
      game: game._id,
      description: req.body.description,
      price: req.body.price,
      accepted_persons_ids: [],
      isCanceled: false,
      address: {
        street: req.body.address.street,
        city: req.body.address.city,
        country: req.body.address.country,
      },
    };
    console.log(newEvent);
    const event = await eventModel.create(newEvent);
    const response = await event.save();

    return res.status(201).json({ message: "event created", event: response });
  } catch (error) {
    return res.status(500).json({ message: "something went wrong", error });
  }
};

export const GET_EVENTS = async (req: Request, res: Response) => {
  try {
    const events = await eventModel
      .find()
      .populate("host", "name")
      .populate("game")
      .populate("accepted_persons_ids.user", "name");
    return res.status(200).json({ message: "events found", events });
  } catch (error) {
    return res.status(500).json({ message: "something went wrong", error });
  }
};

export const GET_EVENT_BY_ID = async (req: Request, res: Response) => {
  try {
    const event = await eventModel
      .findOne({ id: req.params.id })
      .populate("host", "name")
      .populate("game")
      .populate("accepted_persons_ids.user", "name");
    if (!event) {
      return res.status(404).json({ message: "event not found" });
    }
    return res.status(200).json({ message: "event found", event });
  } catch (error) {
    return res.status(500).json({ message: "something went wrong", error });
  }
};
export const CANCEL_EVENT_BY_ID = async (req: Request, res: Response) => {
  try {
    const event = await eventModel.findOne({ id: req.params.id });
    if (!event) {
      return res.status(404).json({ message: "event not found" });
    }
    const host = await userModel.findOne({ id: req.body.userId });
    if (!host) {
      return res.status(401).json({ message: "You have provided bad data" });
    }
    if (!event.host.id === host.id) {
      return res
        .status(401)
        .json({ message: "You are not the host of this event" });
    }
    event.isCanceled = true;
    const response = await event.save();
    return res.status(200).json({ message: "event canceled", event: response });
  } catch (error) {
    return res.status(500).json({ message: "something went wrong", error });
  }
};

export const UPDATE_EVENT_BY_ID = async (req: Request, res: Response) => {
  try {
    const event = await eventModel.findOne({ id: req.params.id });
    if (!event) {
      return res.status(404).json({ message: "event not found" });
    }
    const host = await userModel.findOne({ id: req.body.userId });
    if (!host) {
      return res.status(401).json({ message: "You have provided bad data" });
    }
    if (!event.host.id === host.id) {
      return res
        .status(401)
        .json({ message: "You are not the host of this event" });
    }

    req.body.host = host._id;
    const errors = await isValidCreateEvent(req.body);

    if (Array.isArray(errors)) {
      return res
        .status(400)
        .json({ message: "we have some problems", errors: errors });
    }

    const updatedEvent = await eventModel.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true }
    );

    if (!updatedEvent) {
      return res.status(404).json({ message: "event not found" });
    }

    return res
      .status(200)
      .json({ message: "event updated", event: updatedEvent });
  } catch (error) {
    return res.status(500).json({ message: "something went wrong", error });
  }
};
export const ACCEPT_EVENT_BY_ID = async (req: Request, res: Response) => {
  try {
    const event = await eventModel.findOne({ id: req.params.id });
    if (!event) {
      return res.status(404).json({ message: "event not found" });
    }
    const user = await userModel.findOne({ id: req.body.userId });
    if (!user) {
      return res.status(401).json({ message: "You have provided bad data" });
    }
    const index = event.accepted_persons_ids.findIndex((id) =>
      id.user._id.equals(user._id)
    );
    if (!(index === -1)) {
      return res
        .status(400)
        .json({ message: "You already accepted this event" });
    }
    if (event.accepted_persons_ids.length >= event.number_persons) {
      return res.status(400).json({ message: "event is full" });
    }
    event.accepted_persons_ids.push({ user: user._id, addedAt: new Date() });
    const response = await event.save();
    return res
      .status(200)
      .json({ message: "event accepted", event: response, user });
  } catch (error) {
    return res.status(500).json({ message: "something went wrong", error });
  }
};
export const DECLINE_EVENT_BY_ID = async (req: Request, res: Response) => {
  try {
    const event = await eventModel.findOne({ id: req.params.id });
    if (!event) {
      return res.status(404).json({ message: "event not found" });
    }
    const user = await userModel.findOne({ id: req.body.userId });
    if (!user) {
      return res.status(401).json({ message: "You have provided bad data" });
    }

    const index = event.accepted_persons_ids.findIndex((id) =>
      id.user._id.equals(user._id)
    );

    if (index > -1) {
      event.accepted_persons_ids.splice(index, 1);
      const response = await event.save();
      return res
        .status(200)
        .json({ message: "event declined", event: response });
    } else {
      return res.status(400).json({ message: "You are not in this event" });
    }
  } catch (error) {
    return res.status(500).json({ message: "something went wrong", error });
  }
};

export const GET_EVENTS_BY_USER_ID = async (req: Request, res: Response) => {
  try {
    const events = await eventModel
      .find({ "accepted_persons_ids.user": req.params.userId })
      .populate("host", "name")
      .populate("game")
      .populate("accepted_persons_ids.user", "name");
    return res.status(200).json({ message: "events found", events });
  } catch (error) {
    return res.status(500).json({ message: "something went wrong", error });
  }
};

export const GET_EVENTS_BY_GAME_ID = async (req: Request, res: Response) => {
  try {
    const events = await eventModel
      .find({ game: req.params.gameId })
      .populate("host", "name")
      .populate("game")
      .populate("accepted_persons_ids.user", "name");
    return res.status(200).json({ message: "events found", events });
  } catch (error) {
    return res.status(500).json({ message: "something went wrong", error });
  }
};

export const GET_EVENTS_BY_HOST_ID = async (req: Request, res: Response) => {
  try {
    const events = await eventModel
      .find({ host: req.params.hostId })
      .populate("host", "name")
      .populate("game")
      .populate("accepted_persons_ids.user", "name");
    return res.status(200).json({ message: "events found", events });
  } catch (error) {
    return res.status(500).json({ message: "something went wrong", error });
  }
};
export const GET_EVENTS_BY_IS_CANCELED = async (
  req: Request,
  res: Response
) => {
  try {
    const events = await eventModel
      .find({ isCanceled: req.params.isCanceled })
      .populate("host", "name")
      .populate("game")
      .populate("accepted_persons_ids.user", "name");
    return res.status(200).json({ message: "events found", events });
  } catch (error) {
    return res.status(500).json({ message: "something went wrong", error });
  }
};

export const GET_EVENTS_BY_IS_ACCEPTED = async (
  req: Request,
  res: Response
) => {
  try {
    const events = await eventModel
      .find({ "accepted_persons_ids.user": req.params.isAccepted })
      .populate("host", "name")
      .populate("game")
      .populate("accepted_persons_ids.user", "name");
    return res.status(200).json({ message: "events found", events });
  } catch (error) {
    return res.status(500).json({ message: "something went wrong", error });
  }
};

export const IS_USER_IN_EVENT = async (req: Request, res: Response) => {
  try {
    const event = await eventModel.findOne({ id: req.params.id });
    if (!event) {
      return res.status(404).json({ message: "event not found" });
    }
    const user = await userModel.findOne({ id: req.body.userId });
    if (!user) {
      return res.status(401).json({ message: "You have provided bad data" });
    }
    const index = event.accepted_persons_ids.findIndex((id) =>
      id.user._id.equals(user._id)
    );
    if (index > -1) {
      return res.status(200).json({ message: true, userid: user._id });
    } else {
      return res.status(200).json({ message: false });
    }
  } catch (error) {
    return res.status(500).json({ message: "something went wrong", error });
  }
};
