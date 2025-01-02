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
exports.GED_GAMES_COUNT = exports.GET_GAME_BY_ID = exports.GET_GAMES = void 0;
const game_schema_1 = __importDefault(require("./game.schema"));
const GET_GAMES = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const start = typeof req.query.start === "string" ? parseInt(req.query.start, 10) : 0;
        const gamesOnPage = typeof req.query.gamesOnPage === "string"
            ? parseInt(req.query.gamesOnPage, 10)
            : 1000;
        const games = yield game_schema_1.default
            .find({ title: new RegExp(req.query.title, "i") })
            .sort({ [req.query.sortField]: -1 })
            .skip(start)
            .limit(gamesOnPage);
        const count = yield game_schema_1.default.countDocuments({
            title: new RegExp(req.query.title, "i"),
        });
        return res.status(200).json({ message: "games found", games, count });
    }
    catch (error) {
        return res.status(500).json({ message: "something went wrong", error });
    }
});
exports.GET_GAMES = GET_GAMES;
const GET_GAME_BY_ID = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const game = yield game_schema_1.default.findOne({ id: req.params.id });
        if (!game) {
            return res.status(404).json({ message: "game not found" });
        }
        return res.status(200).json({ message: "game found", game });
    }
    catch (error) {
        return res.status(500).json({ message: "something went wrong", error });
    }
});
exports.GET_GAME_BY_ID = GET_GAME_BY_ID;
const GED_GAMES_COUNT = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const count = yield game_schema_1.default.countDocuments({
            title: new RegExp(req.query.title, "i"),
        });
        return res.status(200).json({ message: "games count found", count });
    }
    catch (error) {
        return res.status(500).json({ message: "something went wrong", error });
    }
});
exports.GED_GAMES_COUNT = GED_GAMES_COUNT;
