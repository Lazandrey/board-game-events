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
exports.UPDATE_USER = exports.LOGIN = exports.SIGNIN = void 0;
const uuid_1 = require("uuid");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
require("dotenv/config");
const user_schema_1 = __importDefault(require("./user.schema"));
const validations_1 = require("../utils/validations");
const SIGNIN = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const errors = yield (0, validations_1.isValidCreateUser)(req.body);
        if (Array.isArray(errors)) {
            return res
                .status(400)
                .json({ message: "we have some problems", errors: errors });
        }
        const salt = bcryptjs_1.default.genSaltSync(10);
        const hash = bcryptjs_1.default.hashSync(req.body.password, salt);
        const newUser = {
            id: (0, uuid_1.v4)(),
            name: req.body.name,
            email: req.body.email,
            password: hash,
        };
        const user = yield user_schema_1.default.create(newUser);
        const key = process.env.TOKEN_KEY;
        if (!key) {
            throw new Error("we have some problems");
        }
        const token = jsonwebtoken_1.default.sign({
            id: user.id,
            email: user.email,
        }, key, { expiresIn: "12h" });
        return res.status(201).json({ message: "user created", user, token });
    }
    catch (error) {
        return res.status(500).json({ message: "something went wrong", error });
    }
});
exports.SIGNIN = SIGNIN;
const LOGIN = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_schema_1.default.findOne({ email: req.body.email });
        if (!user) {
            return res.status(401).json({ message: "You have provided bad data" });
        }
        const isValidPassword = bcryptjs_1.default.compareSync(req.body.password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ message: "You have provided bad data" });
        }
        const key = process.env.TOKEN_KEY;
        if (!key) {
            throw new Error("we have some problems");
        }
        const token = jsonwebtoken_1.default.sign({
            id: user.id,
            email: user.email,
        }, key, { expiresIn: "12h" });
        return res.status(200).json({
            message: "Successfull login",
            token: token,
            userName: user.name,
            userId: user.id,
            user_id: user._id,
        });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ message: "we have some problems" });
    }
});
exports.LOGIN = LOGIN;
const UPDATE_USER = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_schema_1.default.findOne({ id: req.body.id });
        if (!user) {
            return res.status(401).json({ message: "You have provided bad data" });
        }
        const isValidPassword = bcryptjs_1.default.compareSync(req.body.password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ message: "You have provided bad data" });
        }
        const key = process.env.TOKEN_KEY;
        if (!key) {
            console.log("key");
            return res.status(500).json({ message: "we have some problems" });
        }
        if (req.body.newPassword !== "") {
            console.log("req.body.newPassword", req.body.newPassword);
            const salt = bcryptjs_1.default.genSaltSync(10);
            const hash = bcryptjs_1.default.hashSync(req.body.newPassword, salt);
            user.password = hash;
        }
        user.name = req.body.name;
        user.email = req.body.email;
        const token = jsonwebtoken_1.default.sign({
            id: user.id,
            email: user.email,
        }, key, { expiresIn: "12h" });
        yield user.save();
        return res.status(200).json({
            message: "Successfull login",
            token: token,
            userName: user.name,
            userId: user.id,
            user_id: user._id,
        });
    }
    catch (err) {
        console.log("err");
        console.log(err);
        return res.status(500).json({ message: "we have some problems" });
    }
});
exports.UPDATE_USER = UPDATE_USER;
