import express, { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { userExtendedModel } from "../entities/users/model";
import CONF from "../core/config";

const router = express.Router();

router.post("/login", async (req: Request,
  res: Response) => {
  
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
        res.status(401).json({ error: "Invalid credentials" });
      }
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Server error"});
  }
});

export default router;
