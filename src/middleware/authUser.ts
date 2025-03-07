import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

const authUser = async (req: Request, res: Response, next: NextFunction) => {
  type MyToken = {
    id: string;
    email: string;
    iat: number;
    exp: number;
  };

  const token = req.headers.authorization;

  if (!token) {
    console.log("No token");
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const key = process.env.TOKEN_KEY;
    if (!key) {
      console.log("No key");
      throw new Error("we have some problems");
    }
    const decoded = jwt.verify(token, key) as MyToken;
    req.body.userId = decoded.id;
    req.body.email = decoded.email;
    console.log(decoded);
    next();
  } catch {
    console.log("Token error");
    return res.status(401).json({ message: "Unauthorized" });
  }
};

export default authUser;
