"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const gameSchema = new mongoose_1.default.Schema({
    id: { type: String, required: true },
    title: { type: String, required: true },
    rating: { type: Number, required: true },
    usersrated: { type: Number, required: true },
    minPlayers: { type: Number, required: true },
    maxPlayers: { type: Number, required: true },
    minPlayTime: { type: Number, required: true },
    maxPlayTime: { type: Number, required: true },
    weight: { type: Number, required: true },
    gameImageUrl: { type: String, required: true },
    age: { type: Number, required: true },
    description: { type: String, required: true },
});
exports.default = mongoose_1.default.model("Game", gameSchema);
