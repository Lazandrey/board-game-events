import {
  object,
  string,
  number,
  date,
  boolean,
  array,
  ObjectSchema,
} from "yup";

import userModel from "../user/user.schema";
import gameModel from "../game/game.schema";
import { ICreateUser } from "../user/user.types";
import { ICreateEvent, IEvent } from "../event/event.types";

const userSchema: ObjectSchema<ICreateUser> = object({
  id: string().default(""),
  name: string().required("Name is required"),
  email: string()
    .email()
    .required("Email is required")
    .test("is email exists", "Email already exists", async (email) => {
      const isEmailExist = await isClientEmailExists(email);
      return !isEmailExist;
    }),
  password: string().required("Password is required"),
});

const eventSchema: ObjectSchema<ICreateEvent> = object({
  id: string().default(""),
  host: string()
    .required("Host is required")
    .test("user-exists", "Host must be a valid user", async (value) => {
      if (!value) return false;
      const userExists = await userModel.exists({ _id: value });

      return !!userExists;
    }),

  number_persons: number().required("Number of persons is required"),
  date_time: date().required("Date and time is required"),
  game: string()
    .required("Board game name is required")
    .test("board-game-exists", "Board game must exist", async (value) => {
      if (!value) return false;
      const boardGameExists = await gameModel.exists({ _id: value });
      return !!boardGameExists;
    }),
  description: string().required("Description is required"),
  price: number().required("Price is required"),
  address: object({
    street: string().required("Street is required"),
    city: string().required("City is required"),
    country: string().required("Country is required"),
  }),
  accepted_persons_ids: array()
    .of(
      object({
        user: string().required("User is required"),
        addedAt: date().required("Added at is required"),
      })
    )
    .default([]),
  isCanceled: boolean().default(false),
  geolocation: object({
    address: string().required("Address is required"),
    location: object({
      longitude: number().required("Longitude is required"),
      latitude: number().required("Latitude is required"),
    }),
  }),
});

const isClientEmailExists = async (email: string) => {
  const response = await userModel.findOne({ email: email });
  return response === null ? false : true;
};
const isValidCreateUser = async (user: ICreateUser) => {
  const response = await userSchema.validate(user, { abortEarly: false });
  return response;
};

const isValidCreateEvent = async (event: ICreateEvent) => {
  const response = await eventSchema.validate(event, { abortEarly: false });
  return response;
};
const isValidUpdateEvent = async (event: IEvent) => {
  const response = await eventSchema.validate(event, { abortEarly: false });
  return response;
};

export { isValidCreateUser, isValidCreateEvent, isValidUpdateEvent };
