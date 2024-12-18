import express from "express";

import { SIGNIN, LOGIN } from "../user/user.controller";

const router = express.Router();

router.post("/user/signin", async (req, res) => {
  await SIGNIN(req, res);
});
router.post("/user/login", async (req, res) => {
  await LOGIN(req, res);
});

export default router;
