import express from "express";
import authUser from "../middleware/authUser";
import { CREATE_EVENT } from "../controller/event";

const router = express.Router();

router.post(
  "/event",
  async (req, res, next) => {
    await authUser(req, res, next);
  },
  async (req, res) => {
    await CREATE_EVENT(req, res);
  }
);

export default router;
