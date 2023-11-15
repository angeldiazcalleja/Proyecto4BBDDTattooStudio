"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const CONF = {
    DB_URL: process.env.DB_URL,
    PORT: process.env.PORT,
    SECRET: process.env.SECRET,
    HASH_ROUNDS: Number(process.env.HASH_ROUNDS)
};
exports.default = CONF;
//# sourceMappingURL=config.js.map