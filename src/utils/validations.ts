import userModel from "../user/user.schema";
import { ICreateUser } from "../user/user.types";
import { ICreateEvent } from "../event/event.types";

const isClientEmailExists = async (email: string) => {
  const response = await userModel.findOne({ email: email });
  return response === null ? false : true;
};
const isValidCreateUser = async (user: ICreateUser) => {
  const resposnse: string[] = [];
  if (!user.name) {
    resposnse.push("Name is required");
  }
  if (!user.email) {
    resposnse.push("Email is required");
  }
  if (!user.password) {
    resposnse.push("Password is required");
  }

  if (await isClientEmailExists(user.email)) {
    resposnse.push("Email already exists");
  }

  return resposnse;
};

const isValidCreateEvent = async (event: ICreateEvent) => {
  const resposnse: string[] = [];

  if (!event.number_persons) {
    resposnse.push("Number of persons is required");
  }
  if (!event.date_time) {
    resposnse.push("Date and time is required");
  }
  if (!event.boardgame_name) {
    resposnse.push("Boardgame name is required");
  }
  if (!event.description) {
    resposnse.push("Description is required");
  }
  if (!event.price) {
    resposnse.push("Price is required");
  }
  if (!event.boardgame_img_url) {
    resposnse.push("Boardgame image url is required");
  }

  return resposnse;
};

export { isValidCreateUser, isValidCreateEvent };
