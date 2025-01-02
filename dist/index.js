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
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
require("dotenv/config");
const user_route_1 = __importDefault(require("./user/user.route"));
const event_route_1 = __importDefault(require("./event/event.route"));
const game_route_1 = __importDefault(require("./game/game.route"));
const port = process.env.PORT || 3000;
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(user_route_1.default);
app.use(event_route_1.default);
app.use(game_route_1.default);
app.use((req, res) => {
    res.status(404).json({ response: "your endpoint does not exit" });
});
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield mongoose_1.default.connect(process.env.MONGO_CONNECTION, {
            dbName: "boardgameevents",
        });
        console.log("Connected!");
        app.listen(port, () => {
            console.log(`App listening on http://localhost:${port}`);
        });
    }
    catch (error) {
        console.log("bad connection");
        console.log(error);
    }
});
main();
