"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const config_1 = __importDefault(require("../core/config"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authMiddleware = (req, res, next) => {
    try {
        if (!req.headers.authorization) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: Token missing.",
            });
        }
        const token = req.headers.authorization.split(" ")[1]; // Extraer el token de la cabecera de autorización. Bearer-Token. Se queda con el Token.
        const tokenDecoded = jsonwebtoken_1.default.verify(token, config_1.default.SECRET); // Verificar si el token es válido
        req.token = tokenDecoded; // Almacenar la información del token en req.token para su uso posterior
        next();
    }
    catch (error) {
        console.error('Error in the middleware:', error.message);
        return res.status(401).json({
            success: false,
            message: "Unauthorized: Invalid token.",
            error: error.message,
        });
    }
};
exports.authMiddleware = authMiddleware;
//# sourceMappingURL=authMiddleware.js.map