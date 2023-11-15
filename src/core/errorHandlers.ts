import { Response } from "express";

const handleBadRequest = (res: Response) =>
  res.status(400).json({ error: "Nombre y apellido son campos obligatorios" });

const handleNotFound = (res: Response) =>
  res.status(404).json({ error: "Usuario no encontrado" });

const handleServerError = (res: Response) =>
  res.status(500).json({ error: "Error al procesar la solicitud" });

const handleUnauthorized = (res: Response) =>
  res.status(403).json({ error: "Unauthorized: Access denied." });

export { handleBadRequest, handleNotFound, handleServerError, handleUnauthorized };
