"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleUnauthorized = exports.handleServerError = exports.handleNotFound = exports.handleBadRequest = void 0;
const handleBadRequest = (res) => res.status(400).json({ error: "The fields name, surname, email, phone, password, and role are required." });
exports.handleBadRequest = handleBadRequest;
const handleNotFound = (res) => res.status(404).json({ error: "User not found" });
exports.handleNotFound = handleNotFound;
const handleServerError = (res) => res.status(500).json({ error: "Error processing the request." });
exports.handleServerError = handleServerError;
const handleUnauthorized = (res) => res.status(403).json({ error: "Unauthorized: Access denied." });
exports.handleUnauthorized = handleUnauthorized;
//# sourceMappingURL=errorHandlers.js.map