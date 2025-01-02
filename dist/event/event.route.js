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
const express_1 = __importDefault(require("express"));
const authUser_1 = __importDefault(require("../middleware/authUser"));
const event_controller_1 = require("./event.controller");
const router = express_1.default.Router();
router.post("/event", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, authUser_1.default)(req, res, next);
}), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, event_controller_1.CREATE_EVENT)(req, res);
}));
router.get("/event", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, event_controller_1.GET_EVENTS)(req, res);
}));
router.get("/event/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, event_controller_1.GET_EVENT_BY_ID)(req, res);
}));
router.get("/event/:id/checkuser", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, authUser_1.default)(req, res, next);
}), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, event_controller_1.IS_USER_IN_EVENT)(req, res);
}));
router.put("/event/:id/cancel", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, authUser_1.default)(req, res, next);
}), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, event_controller_1.CANCEL_EVENT_BY_ID)(req, res);
}));
router.put("/event/:id", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, authUser_1.default)(req, res, next);
}), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, event_controller_1.UPDATE_EVENT_BY_ID)(req, res);
}));
router.post("/event/:id/accept", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, authUser_1.default)(req, res, next);
}), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, event_controller_1.ACCEPT_EVENT_BY_ID)(req, res);
}));
router.post("/event/:id/decline", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, authUser_1.default)(req, res, next);
}), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, event_controller_1.DECLINE_EVENT_BY_ID)(req, res);
}));
exports.default = router;
