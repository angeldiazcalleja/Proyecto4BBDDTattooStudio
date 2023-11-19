import express from "express";
import * as UserController from "./controllers";
import { authMiddleware } from "../../middleware/authMiddleware";

const router = express.Router();

router.post("/", authMiddleware, UserController.register);
router.get("/", authMiddleware, UserController.findUsers);
router.get("/:_id", authMiddleware, UserController.findCustomer);
router.put("/:_id", authMiddleware, UserController.modifyUser);
router.delete("/:_id", authMiddleware, UserController.deleteUser);

export default router;
