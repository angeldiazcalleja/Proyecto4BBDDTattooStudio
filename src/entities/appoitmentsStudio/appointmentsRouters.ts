import express from "express";
import * as AppointmentController from "./appointmentsController";
import { authMiddleware } from "../../middleware/authMiddleware";

const router = express.Router();

router.post('/', authMiddleware, AppointmentController.createAppointment);
router.get('/', authMiddleware, AppointmentController.getAppointments);
router.put('/:_id', authMiddleware,AppointmentController.updateAppointment);
router.delete("/:_id", authMiddleware, AppointmentController.deleteAppointment);


export default router;

