import express from "express";
import * as UserController from "./controllers";

const router = express.Router();

router.post("/", UserController.saveUsers);
router.get("/", UserController.findUsers);
router.get("/:id", UserController.findUser);
router.put("/:id", UserController.modifyUser);
router.delete("/:id", UserController.deleteUser);

export default router;

