import CONF from "../core/config";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.headers.authorization) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Token missing.",
      });
    }

    const token = req.headers.authorization.split(" ")[1]; // Extraer el token de la cabecera de autorización
    const tokenDecoded = jwt.verify(token, CONF.SECRET) as any; // Verificar si el token es válido
    req.token = tokenDecoded; // Almacenar la información del token en req.token para su uso posterior

    // if (req.method === "GET" && req.originalUrl.includes("/users")) {
    //   return res.status(403).json({
    //     success: false,
    //     message: "No tienes permisos para acceder a nuestra database.",
    //   });
    // }

    next();
  } catch (error) {
    console.log("Error en el middleware:", error.message);
    return res.status(401).json({
      success: false,
      message: "Unauthorized: Invalid token.",
      error: error.message,
    });
  }
};

