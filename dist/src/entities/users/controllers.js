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
exports.deleteUser = exports.modifyUser = exports.findCustomer = exports.findUsers = exports.register = void 0;
const model_1 = require("./model");
const errorHandlers_1 = require("../../core/errorHandlers");
const bcrypt_1 = __importDefault(require("bcrypt"));
const config_1 = __importDefault(require("../../core/config"));
const mongoose_1 = require("mongoose");
//REGISTER
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,16}$/;
    try {
        const { name, surname, email, phone, password, role } = req.body;
        const requestingUserRole = (_a = req.token) === null || _a === void 0 ? void 0 : _a.role;
        if (!name || !surname || !email || !phone || !password || !role) {
            return (0, errorHandlers_1.handleBadRequest)(res);
        }
        if (!passwordRegex.test(password)) {
            return res.status(400).json({
                success: false,
                message: "The password does not meet the requirements. It must be between 8 and 16 characters, contain at least one uppercase letter, one digit, and one special character.",
            });
        }
        const userFound = yield model_1.userExtendedModel.findOne({ email });
        if (userFound) {
            return res.status(409).json({
                success: false,
                message: "There is already a registered user with that email address.",
            });
            3;
        }
        // Verificar si el usuario que realiza la solicitud es un administrador
        if (requestingUserRole !== 'admin') {
            // Si no es administrador, solo puede crear usuarios con los roles 'customer' o 'admin'
            if (role !== 'customer' && role !== 'admin') {
                return res.status(403).json({
                    success: false,
                    message: "You do not have permission to create a user with the specified role.",
                });
            }
        }
        const hashedPassword = bcrypt_1.default.hashSync(password, config_1.default.HASH_ROUNDS);
        const newUser = new model_1.userExtendedModel({
            name,
            surname,
            email,
            phone,
            password: hashedPassword,
            role,
        });
        const result = yield newUser.save();
        return res.status(200).json({
            success: true,
            message: "User registered successfully.",
            userRegistered: result.toObject(),
        });
    }
    catch (error) {
        console.error("Error:", error);
        return (0, errorHandlers_1.handleServerError)(res);
    }
});
exports.register = register;
//ENCONTRAR USUARIOS
const findUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        const requestingUserRole = (_b = req.token) === null || _b === void 0 ? void 0 : _b.role;
        // Verificar si el usuario que realiza la solicitud es un administrador
        if (requestingUserRole !== "admin") {
            return (0, errorHandlers_1.handleUnauthorized)(res);
        }
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
//ENCONTRAR CUSTOMER
const findCustomer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c, _d;
    try {
        const { _id } = req.params;
        const requestingUserId = (_c = req.token) === null || _c === void 0 ? void 0 : _c._id; // Obtener el ID del usuario que realiza la solicitud desde el token
        const requestingUserRole = (_d = req.token) === null || _d === void 0 ? void 0 : _d.role; // Obtener el rol del usuario que realiza la solicitud desde el token
        // Obtener el usuario de la base de datos
        const user = yield model_1.userExtendedModel.findOne({
            _id: _id,
            isDeleted: false,
        });
        if (user) {
            if (requestingUserRole === "customer" && user._id.toString() !== requestingUserId) {
                return (0, errorHandlers_1.handleUnauthorized)(res);
            }
            else if (requestingUserRole === "admin") {
                return res.status(200).json(user);
            }
            else {
                return (0, errorHandlers_1.handleNotFound)(res);
            }
        }
        else {
            return (0, errorHandlers_1.handleNotFound)(res);
        }
    }
    catch (error) {
        return (0, errorHandlers_1.handleServerError)(res);
    }
});
exports.findCustomer = findCustomer;
//MODIFICAR 
const modifyUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _e, _f;
    try {
        const { _id } = req.params;
        const { name, surname, email, phone, role } = req.body;
        const userIdFromToken = (_e = req.token) === null || _e === void 0 ? void 0 : _e._id;
        const roleIdFromToken = (_f = req.token) === null || _f === void 0 ? void 0 : _f.role;
        // Obtener el usuario de la base de datos
        const user = yield model_1.userExtendedModel.findOne({ _id: new mongoose_1.Types.ObjectId(_id) });
        // Verificar permisos para modificar
        const unauthorizedMessage = "You do not have permission to modify this account.";
        if (!user || (roleIdFromToken === 'customer' && userIdFromToken !== user._id.toString()) || (roleIdFromToken !== 'admin' && userIdFromToken !== user._id.toString())) {
            return res.status(403).json({
                success: false,
                message: unauthorizedMessage,
            });
        }
        // Actualizar los campos del usuario
        if (name)
            user.name = name;
        if (surname)
            user.surname = surname;
        if (email)
            user.email = email;
        if (phone)
            user.phone = phone;
        // Actualizar el campo 'role' solo si es un administrador
        if (roleIdFromToken === 'admin' && role) {
            user.role = role;
        }
        // Guardar los cambios en la base de datos
        const result = yield user.save();
        return res.status(200).json(result);
    }
    catch (error) {
        return (0, errorHandlers_1.handleServerError)(res);
    }
});
exports.modifyUser = modifyUser;
//DELETE
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _g, _h, _j, _k;
    try {
        const { _id } = req.params;
        const userIdFromToken = (_h = (_g = req.token) === null || _g === void 0 ? void 0 : _g._id) === null || _h === void 0 ? void 0 : _h.toString();
        const { ObjectId } = mongoose_1.Types;
        const objectId = new ObjectId(_id); // Crear un nuevo ObjectId a partir de _id
        if (userIdFromToken &&
            ((_j = req.token) === null || _j === void 0 ? void 0 : _j.role) === "customer" &&
            userIdFromToken !== _id) {
            return res.status(403).json({
                success: false,
                message: "You do not have permission to delete this account.",
            });
        }
        if (((_k = req.token) === null || _k === void 0 ? void 0 : _k.role) === "admin") {
            const result = yield model_1.userExtendedModel.updateOne({ _id: objectId }, { isDeleted: true });
            return result.modifiedCount === 1
                ? res.status(200).json(result)
                : (0, errorHandlers_1.handleNotFound)(res);
        }
        const result = yield model_1.userExtendedModel.updateOne({ _id: objectId }, { isDeleted: true });
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