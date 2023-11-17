import { Response } from "express";

const handleBadRequest = (res: Response) =>
  res.status(400).json({ error: "The fields name, surname, email, phone, password, and role are required." });

const handleNotFound = (res: Response) =>
  res.status(404).json({ error: "User not found" });

const handleServerError = (res: Response) =>
  res.status(500).json({ error: "Error processing the request." });

const handleUnauthorized = (res: Response) =>
  res.status(403).json({ error: "Unauthorized: Access denied." });

export { handleBadRequest, handleNotFound, handleServerError, handleUnauthorized };
