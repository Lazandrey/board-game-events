import express from "express";

import {
  SIGNIN,
  LOGIN,
  UPDATE_USER,
  updadtePassword,
} from "../user/user.controller";
import authUser from "../middleware/authUser";

const router = express.Router();

router.post("/user/signin", async (req, res) => {
  await SIGNIN(req, res);
});
router.post("/user/login", async (req, res) => {
  await LOGIN(req, res);
});

router.put(
  "/user/update",
  async (req, res, next) => {
    await authUser(req, res, next);
  },
  async (req, res) => {
    await UPDATE_USER(req, res);
  }
);

router.put("/user/update/password", async (req, res) => {
  await updadtePassword(req, res);
});
export default router;
