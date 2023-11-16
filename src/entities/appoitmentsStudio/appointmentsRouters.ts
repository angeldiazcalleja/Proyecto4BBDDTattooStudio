import express from "express";
import * as AppointmentController from "./appointmentsController";
import { authMiddleware } from "../../middleware/authMiddleware";

const router = express.Router();

router.post("/", AppointmentController.createAppointment);
router.delete("/:_id", authMiddleware, AppointmentController.deleteAppointment)


export default router;

