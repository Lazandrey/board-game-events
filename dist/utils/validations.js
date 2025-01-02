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
exports.isValidUpdateEvent = exports.isValidCreateEvent = exports.isValidCreateUser = void 0;
const yup_1 = require("yup");
const user_schema_1 = __importDefault(require("../user/user.schema"));
const game_schema_1 = __importDefault(require("../game/game.schema"));
const userSchema = (0, yup_1.object)({
    id: (0, yup_1.string)().default(""),
    name: (0, yup_1.string)().required("Name is required"),
    email: (0, yup_1.string)()
        .email()
        .required("Email is required")
        .test("is email exists", "Email already exists", (email) => __awaiter(void 0, void 0, void 0, function* () {
        const isEmailExist = yield isClientEmailExists(email);
        return !isEmailExist;
    })),
    password: (0, yup_1.string)().required("Password is required"),
});
const eventSchema = (0, yup_1.object)({
    id: (0, yup_1.string)().default(""),
    host: (0, yup_1.string)()
        .required("Host is required")
        .test("user-exists", "Host must be a valid user", (value) => __awaiter(void 0, void 0, void 0, function* () {
        if (!value)
            return false;
        const userExists = yield user_schema_1.default.exists({ _id: value });
        return !!userExists;
    })),
    number_persons: (0, yup_1.number)().required("Number of persons is required"),
    date_time: (0, yup_1.date)().required("Date and time is required"),
    game: (0, yup_1.string)()
        .required("Board game name is required")
        .test("board-game-exists", "Board game must exist", (value) => __awaiter(void 0, void 0, void 0, function* () {
        if (!value)
            return false;
        const boardGameExists = yield game_schema_1.default.exists({ _id: value });
        return !!boardGameExists;
    })),
    description: (0, yup_1.string)().required("Description is required"),
    price: (0, yup_1.number)().required("Price is required"),
    address: (0, yup_1.object)({
        street: (0, yup_1.string)().required("Street is required"),
        city: (0, yup_1.string)().required("City is required"),
        country: (0, yup_1.string)().required("Country is required"),
    }),
    rawAddress: (0, yup_1.string)().required("Raw address is required"),
    accepted_persons_ids: (0, yup_1.array)()
        .of((0, yup_1.object)({
        user: (0, yup_1.string)().required("User is required"),
        addedAt: (0, yup_1.date)().required("Added at is required"),
    }))
        .default([]),
    isCanceled: (0, yup_1.boolean)().default(false),
    geolocation: (0, yup_1.object)({
        type: (0, yup_1.string)().required("Type is required"),
        coordinates: (0, yup_1.array)()
            .of((0, yup_1.number)().required())
            .required("Coordinates are required"),
    }),
});
const isClientEmailExists = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield user_schema_1.default.findOne({ email: email });
    return response === null ? false : true;
});
const isValidCreateUser = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield userSchema.validate(user, { abortEarly: false });
    return response;
});
exports.isValidCreateUser = isValidCreateUser;
const isValidCreateEvent = (event) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield eventSchema.validate(event, { abortEarly: false });
    return response;
});
exports.isValidCreateEvent = isValidCreateEvent;
const isValidUpdateEvent = (event) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield eventSchema.validate(event, { abortEarly: false });
    return response;
});
exports.isValidUpdateEvent = isValidUpdateEvent;
