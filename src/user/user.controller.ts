import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import "dotenv/config";

import userModel from "./user.schema";
import { ICreateUser } from "./user.types";
import { isValidCreateUser } from "../utils/validations";

export const SIGNIN = async (
  req: Request<object, object, ICreateUser>,
  res: Response
) => {
  try {
    const errors = await isValidCreateUser(req.body);

    if (Array.isArray(errors)) {
      return res
        .status(400)
        .json({ message: "we have some problems", errors: errors });
    }
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);
    const newUser: ICreateUser = {
      id: uuidv4(),
      name: req.body.name,
      email: req.body.email,
      password: hash,
    };

    const user = await userModel.create(newUser);
    return res.status(201).json({ message: "user created", user });
  } catch (error) {
    return res.status(500).json({ message: "something went wrong", error });
  }
};

export const LOGIN = async (
  req: Request<object, object, ICreateUser>,
  res: Response
) => {
  try {
    const user = await userModel.findOne({ email: req.body.email });
    if (!user) {
      return res.status(401).json({ message: "You have provided bad data" });
    }

    const isValidPassword = bcrypt.compareSync(
      req.body.password,
      user.password
    );

    if (!isValidPassword) {
      return res.status(401).json({ message: "You have provided bad data" });
    }
    const key = process.env.TOKEN_KEY;
    if (!key) {
      throw new Error("we have some problems");
    }
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      key,
      { expiresIn: "12h" }
    );

    return res.status(200).json({
      message: "Successfull login",
      token: token,
      userName: user.name,
      userId: user.id,
      user_id: user._id,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "we have some problems" });
  }
};
