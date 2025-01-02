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
const user_controller_1 = require("../user/user.controller");
const authUser_1 = __importDefault(require("../middleware/authUser"));
const router = express_1.default.Router();
router.post("/user/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, user_controller_1.SIGNIN)(req, res);
}));
router.post("/user/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, user_controller_1.LOGIN)(req, res);
}));
router.put("/user/update", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, authUser_1.default)(req, res, next);
}), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, user_controller_1.UPDATE_USER)(req, res);
}));
exports.default = router;
