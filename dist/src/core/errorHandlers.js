"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleUnauthorized = exports.handleServerError = exports.handleNotFound = exports.handleBadRequest = void 0;
const handleBadRequest = (res) => res.status(400).json({ error: "Nombre y apellido son campos obligatorios" });
exports.handleBadRequest = handleBadRequest;
const handleNotFound = (res) => res.status(404).json({ error: "Usuario no encontrado" });
exports.handleNotFound = handleNotFound;
const handleServerError = (res) => res.status(500).json({ error: "Error al procesar la solicitud" });
exports.handleServerError = handleServerError;
const handleUnauthorized = (res) => res.status(403).json({ error: "Unauthorized: Access denied." });
exports.handleUnauthorized = handleUnauthorized;
//# sourceMappingURL=errorHandlers.js.map