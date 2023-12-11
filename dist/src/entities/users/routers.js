"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const UserController = __importStar(require("./controllers"));
const authMiddleware_1 = require("../../middleware/authMiddleware");
const router = express_1.default.Router();
router.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield UserController.login(req, res);
    }
    catch (error) {
        res.status(500).json({
            message: "Internal Server Error",
        });
    }
}));
// router.post("/", async (req: Request, res: Response) => {
//   try {
//     await UserController.register(req, res);
//   } catch (error) {
//     res.status(500).json({
//       message: "Internal Server Error",
//     });
//   }
// });
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield UserController.register(req, res);
    }
    catch (error) {
        console.error("Error in UserController.register:", error);
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message, // Devuelve el mensaje de error específico si está disponible
        });
    }
}));
router.get("/", authMiddleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield UserController.findUsers(req, res);
    }
    catch (error) {
        res.status(500).json({
            message: "Internal Server Error",
        });
    }
}));
router.get("/:_id", authMiddleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield UserController.findCustomer(req, res);
    }
    catch (error) {
        res.status(500).json({
            message: "Internal Server Error",
        });
    }
}));
router.put("/:_id", authMiddleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield UserController.modifyUser(req, res);
    }
    catch (error) {
        res.status(500).json({
            message: "Internal Server Error",
        });
    }
}));
router.delete("/:_id", authMiddleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield UserController.deleteUser(req, res);
    }
    catch (error) {
        res.status(500).json({
            message: "Internal Server Error",
        });
    }
}));
exports.default = router;
//# sourceMappingURL=routers.js.map