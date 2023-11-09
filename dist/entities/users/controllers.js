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
exports.deleteUser = exports.modifyUser = exports.findUser = exports.findUsers = exports.saveUsers = void 0;
const model_1 = require("./model");
const errorHandlers_1 = require("../../core/errorHandlers");
const bcrypt_1 = __importDefault(require("bcrypt"));
const saveUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, surname, email, phone, password } = req.body;
        if (!name || !surname || !email || !phone || !password) {
            return (0, errorHandlers_1.handleBadRequest)(res);
        }
        const userFound = yield model_1.userExtendedModel.findOne({ email });
        if (userFound) {
            return res.status(409).json({
                success: false,
                message: "Ya existe un usuario registrado con ese correo electrónico.",
            });
        }
        const hashedPassword = bcrypt_1.default.hashSync(password, 5);
        const newUser = new model_1.userExtendedModel({
            name,
            surname,
            email,
            phone,
            password: hashedPassword,
            id: Date.now(),
        });
        const result = yield newUser.save();
        return res.status(200).json({
            success: true,
            message: "Usuario registrado con éxito",
            userRegistered: {
                name: result.name,
                surname: result.surname,
                email: result.email,
                phone: result.phone,
            },
        });
    }
    catch (error) {
        console.error("Error:", error);
        return (0, errorHandlers_1.handleServerError)(res);
    }
});
exports.saveUsers = saveUsers;
const findUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield model_1.userExtendedModel.find();
        return res.status(200).json(users);
    }
    catch (error) {
        return (0, errorHandlers_1.handleServerError)(res);
    }
});
exports.findUsers = findUsers;
const findUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const user = yield model_1.userExtendedModel.findOne({ id: parseInt(id) });
        if (user) {
            return res.status(200).json(user);
        }
        else {
            return (0, errorHandlers_1.handleNotFound)(res);
        }
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
    try {
        const { id } = req.params;
        const result = yield model_1.userExtendedModel.deleteOne({ id: parseInt(id) });
        if (result.deletedCount === 1) {
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
exports.deleteUser = deleteUser;
//# sourceMappingURL=controllers.js.map