import express, { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { userExtendedModel } from "../entities/users/model";
import CONF from "../core/config";

const router = express.Router();

router.post("/login", async (req: Request,
  res: Response,
  next: NextFunction) => {
  

  try {
    const { email, password } = req.body;
    const user = await userExtendedModel.findOne({ email }).select("+password")

    if (user) {
      if (await bcrypt.compare(password, user.password)) {
        const token = jwt.sign({_id: user._id, email, role: user.role }, CONF.SECRET, {
          expiresIn: "24h",
        });
        res.json({ token });
      } else {
        res.status(401).json({ error: "Credenciales inválidas" });
      }
    } else {
      res.status(404).json({ error: "Usuario no encontrado" });
    }
  } catch (error) {
    console.error("Error en el servidorr:", error);
    res.status(500).json({ error: "Error en el servidorr" });
  }
});

export default router;
