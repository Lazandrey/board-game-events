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
exports.IS_USER_IN_EVENT = exports.GET_EVENTS_BY_IS_ACCEPTED = exports.GET_EVENTS_BY_IS_CANCELED = exports.GET_EVENTS_BY_HOST_ID = exports.GET_EVENTS_BY_GAME_ID = exports.GET_EVENTS_BY_USER_ID = exports.DECLINE_EVENT_BY_ID = exports.ACCEPT_EVENT_BY_ID = exports.UPDATE_EVENT_BY_ID = exports.CANCEL_EVENT_BY_ID = exports.GET_EVENT_BY_ID = exports.GET_EVENTS = exports.CREATE_EVENT = void 0;
const uuid_1 = require("uuid");
const user_schema_1 = __importDefault(require("../user/user.schema"));
const event_schema_1 = __importDefault(require("./event.schema"));
const game_schema_1 = __importDefault(require("../game/game.schema"));
const validations_1 = require("../utils/validations");
const arcgis_rest_request_1 = require("@esri/arcgis-rest-request");
const arcgis_rest_geocoding_1 = require("@esri/arcgis-rest-geocoding");
const authentication = arcgis_rest_request_1.ApiKeyManager.fromKey(process.env.ARCGIS_API_KEY);
const getGeocode = (address) => __awaiter(void 0, void 0, void 0, function* () {
    const geocodeAdress = {
        address: address.street + " " + address.city,
        countryCode: address.country,
        authentication,
    };
    const response = yield (0, arcgis_rest_geocoding_1.geocode)(geocodeAdress);
    return response;
});
const CREATE_EVENT = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const host = yield user_schema_1.default.findOne({ id: req.body.userId });
        if (!host) {
            return res.status(401).json({ message: "You have provided bad data" });
        }
        const game = yield game_schema_1.default.findById(req.body.game);
        if (!game) {
            return res
                .status(401)
                .json({ message: "Game not found. You have provided bad data" });
        }
        req.body.host = host._id;
        const geocodeAddress = yield getGeocode(req.body.address);
        console.log(geocodeAddress);
        if (geocodeAddress.candidates.length <= 0) {
            return res
                .status(401)
                .json({ message: "Address not found. You have provided bad data" });
        }
        const newEvent = {
            id: (0, uuid_1.v4)(),
            host: host._id,
            number_persons: req.body.number_persons,
            date_time: req.body.date_time,
            game: game._id,
            description: req.body.description,
            price: req.body.price,
            accepted_persons_ids: [],
            isCanceled: false,
            address: {
                street: req.body.address.street,
                city: req.body.address.city,
                country: req.body.address.country,
            },
            rawAddress: geocodeAddress.candidates[0].address,
            geolocation: {
                type: "Point",
                coordinates: [
                    geocodeAddress.candidates[0].location.x,
                    geocodeAddress.candidates[0].location.y,
                ],
            },
        };
        if (req.body.accepted_persons_ids.length > 0 &&
            req.body.accepted_persons_ids) {
            for (let i = 0; i < req.body.accepted_persons_ids.length; i++) {
                const user = yield user_schema_1.default.findOne({
                    id: req.body.accepted_persons_ids[i].user.id,
                });
                if (user) {
                    newEvent.accepted_persons_ids.push({
                        user: user._id,
                        addedAt: req.body.accepted_persons_ids[i].addedAt,
                    });
                }
            }
        }
        const errors = yield (0, validations_1.isValidCreateEvent)(newEvent);
        if (Array.isArray(errors)) {
            return res
                .status(400)
                .json({ message: "we have some problems", errors: errors });
        }
        const event = yield event_schema_1.default.create(newEvent);
        const response = yield event.save();
        return res.status(201).json({ message: "event created", event: response });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "something went wrong", error });
    }
});
exports.CREATE_EVENT = CREATE_EVENT;
const GET_EVENTS = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(req.query);
        const hostId = req.query.hostId;
        let startDate = null;
        if (!(req.query.startDate === undefined)) {
            startDate = new Date(req.query.startDate);
            console.log(startDate);
        }
        const title = req.query.title;
        const isCanceled = req.query.isCanceled;
        const searchOptions = {};
        if (hostId && hostId !== "undefined") {
            const host = yield user_schema_1.default.findOne({ id: hostId });
            if (!host) {
                return res.status(404).json({ message: "host not found" });
            }
            searchOptions.$or = [
                { host: host === null || host === void 0 ? void 0 : host._id },
                { accepted_persons_ids: { $elemMatch: { user: host === null || host === void 0 ? void 0 : host._id } } },
            ];
        }
        if (startDate) {
            searchOptions.date_time = { $gte: startDate };
        }
        if (title && title !== "undefined") {
            searchOptions.title = title;
        }
        if (isCanceled && isCanceled !== "undefined") {
            searchOptions.isCanceled = isCanceled === "true";
        }
        if (req.query.distance && req.query.distance !== "undefined") {
            if (isNaN(Number(req.query.distance)) ||
                isNaN(Number(req.query.userLongitude)) ||
                isNaN(Number(req.query.userLatitude))) {
                return res.status(500).json({
                    message: "something went wrong",
                    error: "distance, longitude and latitude must be numbers",
                });
            }
            searchOptions.geolocation = {};
            searchOptions.geolocation.$geoWithin = {
                $centerSphere: [
                    [Number(req.query.userLongitude), Number(req.query.userLatitude)],
                    Number(req.query.distance) / 6378.1,
                ],
            };
        }
        const eventsFound = yield event_schema_1.default
            .find(searchOptions)
            .populate("host", { name: 1, id: 1 })
            .populate("game")
            .populate("accepted_persons_ids.user", { name: 1, id: 1 })
            .sort({ date_time: 1 });
        return res
            .status(200)
            .json({ message: "events found", events: eventsFound });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "something went wrong", error });
    }
});
exports.GET_EVENTS = GET_EVENTS;
const GET_EVENT_BY_ID = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const event = yield event_schema_1.default
            .findOne({ id: req.params.id })
            .populate("host", { name: 1, id: 1 })
            .populate("game")
            .populate("accepted_persons_ids.user", { name: 1, id: 1 });
        if (!event) {
            return res.status(404).json({ message: "event not found" });
        }
        return res.status(200).json({ message: "event found", event });
    }
    catch (error) {
        return res.status(500).json({ message: "something went wrong", error });
    }
});
exports.GET_EVENT_BY_ID = GET_EVENT_BY_ID;
const CANCEL_EVENT_BY_ID = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const event = yield event_schema_1.default.findOne({ id: req.params.id });
        if (!event) {
            return res.status(404).json({ message: "event not found" });
        }
        const host = yield user_schema_1.default.findOne({ id: req.body.userId });
        if (!host) {
            return res.status(401).json({ message: "You have provided bad data" });
        }
        if (!event.host.id === host.id) {
            return res
                .status(401)
                .json({ message: "You are not the host of this event" });
        }
        event.isCanceled = true;
        const response = yield event.save();
        return res.status(200).json({ message: "event canceled", event: response });
    }
    catch (error) {
        return res.status(500).json({ message: "something went wrong", error });
    }
});
exports.CANCEL_EVENT_BY_ID = CANCEL_EVENT_BY_ID;
const UPDATE_EVENT_BY_ID = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("req.body", req.body);
        const event = yield event_schema_1.default.findOne({ id: req.params.id });
        if (!event) {
            return res.status(404).json({ message: "event not found" });
        }
        const host = yield user_schema_1.default.findOne({ id: req.body.userId });
        if (!host) {
            return res.status(401).json({ message: "You have provided bad data" });
        }
        if (!event.host.id === host.id) {
            return res
                .status(401)
                .json({ message: "You are not the host of this event" });
        }
        req.body.host = host._id;
        const game = yield game_schema_1.default.findById(req.body.game);
        if (!game) {
            return res
                .status(401)
                .json({ message: "Game not found. You have provided bad data" });
        }
        req.body.game = game._id;
        if (!(event.address === req.body.address)) {
            const geocodeAddress = yield getGeocode(req.body.address);
            console.log(geocodeAddress);
            if (geocodeAddress.candidates.length <= 0) {
                return res
                    .status(401)
                    .json({ message: "Address not found. You have provided bad data" });
            }
            console.log(geocodeAddress.candidates[0]);
            req.body.geolocation = {
                address: geocodeAddress.candidates[0].address,
                location: {
                    longitude: geocodeAddress.candidates[0].location.x,
                    latitude: geocodeAddress.candidates[0].location.y,
                },
            };
        }
        const userArray = req.body.accepted_persons_ids;
        req.body.accepted_persons_ids = [];
        if (userArray.length > 0 && userArray) {
            for (let i = 0; i < userArray.length; i++) {
                const user = yield user_schema_1.default.findOne({
                    id: userArray[i].user,
                });
                if (user) {
                    req.body.accepted_persons_ids.push({
                        user: user._id,
                        addedAt: req.body.accepted_persons_ids[i].addedAt,
                    });
                }
            }
        }
        const errors = yield (0, validations_1.isValidUpdateEvent)(req.body);
        if (Array.isArray(errors)) {
            return res
                .status(400)
                .json({ message: "we have some problems", errors: errors });
        }
        const updatedEvent = yield event_schema_1.default.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
        if (!updatedEvent) {
            return res.status(404).json({ message: "event not found" });
        }
        return res
            .status(200)
            .json({ message: "event updated", event: updatedEvent });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "something went wrong", error });
    }
});
exports.UPDATE_EVENT_BY_ID = UPDATE_EVENT_BY_ID;
const ACCEPT_EVENT_BY_ID = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const event = yield event_schema_1.default.findOne({ id: req.params.id });
        if (!event) {
            return res.status(404).json({ message: "event not found" });
        }
        const user = yield user_schema_1.default.findOne({ id: req.body.userId });
        if (!user) {
            return res.status(401).json({ message: "You have provided bad data" });
        }
        const index = event.accepted_persons_ids.findIndex((id) => id.user._id.equals(user._id));
        if (!(index === -1)) {
            return res
                .status(400)
                .json({ message: "You already accepted this event" });
        }
        if (event.accepted_persons_ids.length >= event.number_persons) {
            return res.status(400).json({ message: "event is full" });
        }
        event.accepted_persons_ids.push({ user: user._id, addedAt: new Date() });
        const response = yield event.save();
        return res
            .status(200)
            .json({ message: "event accepted", event: response, user });
    }
    catch (error) {
        return res.status(500).json({ message: "something went wrong", error });
    }
});
exports.ACCEPT_EVENT_BY_ID = ACCEPT_EVENT_BY_ID;
const DECLINE_EVENT_BY_ID = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const event = yield event_schema_1.default.findOne({ id: req.params.id });
        if (!event) {
            return res.status(404).json({ message: "event not found" });
        }
        const user = yield user_schema_1.default.findOne({ id: req.body.userId });
        if (!user) {
            return res.status(401).json({ message: "You have provided bad data" });
        }
        const index = event.accepted_persons_ids.findIndex((id) => id.user._id.equals(user._id));
        if (index > -1) {
            event.accepted_persons_ids.splice(index, 1);
            const response = yield event.save();
            return res
                .status(200)
                .json({ message: "event declined", event: response });
        }
        else {
            return res.status(400).json({ message: "You are not in this event" });
        }
    }
    catch (error) {
        return res.status(500).json({ message: "something went wrong", error });
    }
});
exports.DECLINE_EVENT_BY_ID = DECLINE_EVENT_BY_ID;
const GET_EVENTS_BY_USER_ID = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const events = yield event_schema_1.default
            .find({ "accepted_persons_ids.user": req.params.userId })
            .populate("host", "name")
            .populate("game")
            .populate("accepted_persons_ids.user", "name");
        return res.status(200).json({ message: "events found", events });
    }
    catch (error) {
        return res.status(500).json({ message: "something went wrong", error });
    }
});
exports.GET_EVENTS_BY_USER_ID = GET_EVENTS_BY_USER_ID;
const GET_EVENTS_BY_GAME_ID = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const events = yield event_schema_1.default
            .find({ game: req.params.gameId })
            .populate("host", "name")
            .populate("game")
            .populate("accepted_persons_ids.user", "name");
        return res.status(200).json({ message: "events found", events });
    }
    catch (error) {
        return res.status(500).json({ message: "something went wrong", error });
    }
});
exports.GET_EVENTS_BY_GAME_ID = GET_EVENTS_BY_GAME_ID;
const GET_EVENTS_BY_HOST_ID = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const events = yield event_schema_1.default
            .find({ host: req.params.hostId })
            .populate("host", "name")
            .populate("game")
            .populate("accepted_persons_ids.user", "name");
        return res.status(200).json({ message: "events found", events });
    }
    catch (error) {
        return res.status(500).json({ message: "something went wrong", error });
    }
});
exports.GET_EVENTS_BY_HOST_ID = GET_EVENTS_BY_HOST_ID;
const GET_EVENTS_BY_IS_CANCELED = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const events = yield event_schema_1.default
            .find({ isCanceled: req.params.isCanceled })
            .populate("host", "name")
            .populate("game")
            .populate("accepted_persons_ids.user", "name");
        return res.status(200).json({ message: "events found", events });
    }
    catch (error) {
        return res.status(500).json({ message: "something went wrong", error });
    }
});
exports.GET_EVENTS_BY_IS_CANCELED = GET_EVENTS_BY_IS_CANCELED;
const GET_EVENTS_BY_IS_ACCEPTED = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const events = yield event_schema_1.default
            .find({ "accepted_persons_ids.user": req.params.isAccepted })
            .populate("host", "name")
            .populate("game")
            .populate("accepted_persons_ids.user", "name");
        return res.status(200).json({ message: "events found", events });
    }
    catch (error) {
        return res.status(500).json({ message: "something went wrong", error });
    }
});
exports.GET_EVENTS_BY_IS_ACCEPTED = GET_EVENTS_BY_IS_ACCEPTED;
const IS_USER_IN_EVENT = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const event = yield event_schema_1.default.findOne({ id: req.params.id });
        if (!event) {
            return res.status(404).json({ message: "event not found" });
        }
        const user = yield user_schema_1.default.findOne({ id: req.body.userId });
        if (!user) {
            return res.status(401).json({ message: "You have provided bad data" });
        }
        const index = event.accepted_persons_ids.findIndex((id) => id.user._id.equals(user._id));
        if (index > -1) {
            return res.status(200).json({ message: true, userid: user._id });
        }
        else {
            return res.status(200).json({ message: false });
        }
    }
    catch (error) {
        return res.status(500).json({ message: "something went wrong", error });
    }
});
exports.IS_USER_IN_EVENT = IS_USER_IN_EVENT;
