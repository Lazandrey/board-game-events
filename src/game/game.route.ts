import express from "express";
import authUser from "../middleware/authUser";

import { GET_GAMES, GET_GAME_BY_ID } from "./game.controller";

const router = express.Router();

router.get(
  "/game",
  async (req, res, next) => {
    await authUser(req, res, next);
  },
  async (req, res) => {
    await GET_GAMES(req, res);
  }
);

router.get(
  "/game/:id",
  async (req, res, next) => {
    await authUser(req, res, next);
  },
  async (req, res) => {
    await GET_GAME_BY_ID(req, res);
  }
);

export default router;
