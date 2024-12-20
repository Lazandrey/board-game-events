import express from "express";
import authUser from "../middleware/authUser";
import {
  CREATE_EVENT,
  GET_EVENTS,
  GET_EVENT_BY_ID,
  CANCEL_EVENT_BY_ID,
  UPDATE_EVENT_BY_ID,
  ACCEPT_EVENT_BY_ID,
  DECLINE_EVENT_BY_ID,
  IS_USER_IN_EVENT,
} from "./event.controller";

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

router.get("/event", async (req, res) => {
  await GET_EVENTS(req, res);
});

router.get("/event/:id", async (req, res) => {
  await GET_EVENT_BY_ID(req, res);
});

router.get(
  "/event/:id/checkuser",
  async (req, res, next) => {
    await authUser(req, res, next);
  },
  async (req, res) => {
    await IS_USER_IN_EVENT(req, res);
  }
);

router.put(
  "/event/:id/cancel",
  async (req, res, next) => {
    await authUser(req, res, next);
  },
  async (req, res) => {
    await CANCEL_EVENT_BY_ID(req, res);
  }
);

router.put(
  "/event/:id",
  async (req, res, next) => {
    await authUser(req, res, next);
  },
  async (req, res) => {
    await UPDATE_EVENT_BY_ID(req, res);
  }
);

router.post(
  "/event/:id/accept",
  async (req, res, next) => {
    await authUser(req, res, next);
  },
  async (req, res) => {
    await ACCEPT_EVENT_BY_ID(req, res);
  }
);

router.post(
  "/event/:id/decline",
  async (req, res, next) => {
    await authUser(req, res, next);
  },
  async (req, res) => {
    await DECLINE_EVENT_BY_ID(req, res);
  }
);

export default router;
