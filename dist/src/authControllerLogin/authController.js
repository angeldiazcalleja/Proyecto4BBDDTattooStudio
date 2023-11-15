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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const model_1 = require("../entities/users/model");
const config_1 = __importDefault(require("../core/config"));
const router = express_1.default.Router();
router.post("/login", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield model_1.userExtendedModel.findOne({ email }).select("+password");
        if (user) {
            if (yield bcrypt_1.default.compare(password, user.password)) {
                const token = jsonwebtoken_1.default.sign({ _id: user._id, email, role: user.role }, config_1.default.SECRET, {
                    expiresIn: "24h",
                });
                res.json({ token });
            }
            else {
                res.status(401).json({ error: "Credenciales inválidas" });
            }
        }
        else {
            res.status(404).json({ error: "Usuario no encontrado" });
        }
    }
    catch (error) {
        console.error("Error en el servidorr:", error);
        res.status(500).json({ error: "Error en el servidorr" });
    }
}));
exports.default = router;
//# sourceMappingURL=authController.js.map