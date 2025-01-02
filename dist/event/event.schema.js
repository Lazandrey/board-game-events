"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const eventSchema = new mongoose_1.default.Schema({
    id: { type: String, required: true },
    host: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    number_persons: { type: Number, required: true },
    date_time: { type: Date, required: true },
    game: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Game",
        required: true,
    },
    description: {
        type: String,
        required: [true, "need description"],
        default: "",
    },
    price: { type: Number, required: true },
    accepted_persons_ids: [
        {
            user: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "User" },
            addedAt: { type: Date, default: Date.now },
        },
    ],
    isCanceled: { type: Boolean, default: false },
    address: {
        street: { type: String },
        city: { type: String },
        country: { type: String },
    },
    rawAddress: { type: String },
    geolocation: {
        type: { type: String },
        coordinates: [Number],
    },
});
exports.default = mongoose_1.default.model("Event", eventSchema);
