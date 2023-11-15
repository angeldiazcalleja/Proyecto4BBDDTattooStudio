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
exports.deleteUser = exports.modifyUser = exports.findUser = exports.findUsers = exports.register = void 0;
const model_1 = require("./model");
const errorHandlers_1 = require("../../src/core/errorHandlers");
const bcrypt_1 = __importDefault(require("bcrypt"));
// import { ulid } from "ulid";
const config_1 = __importDefault(require("../../src/core/config"));
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, surname, email, phone, password, role } = req.body;
        if (!name || !surname || !email || !phone || !password || !role) {
            return (0, errorHandlers_1.handleBadRequest)(res);
        }
        const userFound = yield model_1.userExtendedModel.findOne({ email });
        if (userFound) {
            return res.status(409).json({
                success: false,
                message: "Ya existe un usuario registrado con ese correo electrónico.",
            });
        }
        const hashedPassword = bcrypt_1.default.hashSync(password, config_1.default.HASH_ROUNDS);
        const newUser = new model_1.userExtendedModel({
            name,
            surname,
            email,
            phone,
            password: hashedPassword,
        });
        const result = yield newUser.save();
        return res.status(200).json({
            success: true,
            message: "Usuario registrado con éxito",
            userRegistered: result.toObject(), // Convierte el objeto Mongoose a un objeto plano
        });
    }
    catch (error) {
        console.error("Error:", error);
        return (0, errorHandlers_1.handleServerError)(res);
    }
});
exports.register = register;
const findUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let users = yield model_1.userExtendedModel.find();
        const { sort, search, role } = req.query;
        if (role && typeof role === "string") {
            users = users.filter((user) => user.role === role);
        }
        if (sort === "ASC") {
            users = users.sort((a, b) => a.name.localeCompare(b.name));
        }
        else if (sort === "DSC") {
            users = users.sort((a, b) => b.name.localeCompare(a.name));
        }
        if (search && typeof search === "string") {
            users = users.filter((user) => user.name.toLowerCase().includes(search.toLowerCase()));
        }
        return res.status(200).json(users);
    }
    catch (error) {
        console.error("Error:", error);
        return (0, errorHandlers_1.handleServerError)(res);
    }
});
exports.findUsers = findUsers;
const findUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const user = yield model_1.userExtendedModel.findOne({
            id: parseInt(id),
            isDeleted: false,
        });
        return user ? res.status(200).json(user) : (0, errorHandlers_1.handleNotFound)(res);
    }
    catch (error) {
        return (0, errorHandlers_1.handleServerError)(res);
    }
});
exports.findUser = findUser;
const modifyUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { name, surname, email, phone } = req.body;
        const user = yield model_1.userExtendedModel.findOne({ id: parseInt(id) });
        if (user) {
            user.name = name;
            user.surname = surname;
            user.email = email;
            user.phone = phone;
            const result = yield user.save();
            return res.status(200).json(result);
        }
        else {
            return (0, errorHandlers_1.handleNotFound)(res);
        }
    }
    catch (error) {
        return (0, errorHandlers_1.handleServerError)(res);
    }
});
exports.modifyUser = modifyUser;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { id } = req.params;
        const userIdFromToken = (_a = req.token) === null || _a === void 0 ? void 0 : _a.id;
        const roleIdFromToken = (_b = req.token) === null || _b === void 0 ? void 0 : _b.role;
        // Verifica permisos del cliente
        if (roleIdFromToken === "customer" && (userIdFromToken === null || userIdFromToken === void 0 ? void 0 : userIdFromToken.toString()) !== id) {
            return res.status(403).json({
                success: false,
                message: "No tienes permisos para eliminar esta cuenta.",
            });
        }
        const result = yield model_1.userExtendedModel.updateOne({ id: parseInt(id) }, { isDeleted: true });
        return result.modifiedCount === 1
            ? res.status(200).json(result)
            : (0, errorHandlers_1.handleNotFound)(res);
    }
    catch (error) {
        return (0, errorHandlers_1.handleServerError)(res);
    }
});
exports.deleteUser = deleteUser;
//# sourceMappingURL=controllers.js.map