"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
        const decoded = jsonwebtoken_1.default.verify(token, key);
        req.body.userId = decoded.id;
        req.body.email = decoded.email;
        console.log(decoded);
        next();
    }
    catch (_a) {
        console.log("Token error");
        return res.status(401).json({ message: "Unauthorized" });
    }
});
exports.default = authUser;
