"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAppointment = exports.getAppointments = exports.createAppointment = void 0;
const appointmentsModel_1 = require("./appointmentsModel");
const model_1 = require("../users/model");
const errorHandlers_1 = require("../../core/errorHandlers");
const createAppointment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { customerId, tattooArtistId, date, startTime, endTime, role, price, comments } = req.body;
        const { role: userRole, _id: userId } = req.token;
        if (userRole === 'customer' && userId !== customerId) {
            return res.status(403).json({
                success: false,
                message: 'No tienes permisos para crear citas para otros clientes.',
            });
        }
        if (userRole === 'tattooArtist' && userId !== tattooArtistId) {
            return res.status(403).json({
                success: false,
                message: 'No tienes permisos para crear citas para otros artistas.',
            });
        }
        const appointmentFound = yield appointmentsModel_1.appointmentsExtendedModel.findOne({ date, startTime });
        if (appointmentFound) {
            return res.status(400).json({
                success: false,
                message: 'Invalid date and time. Appointment already exists.',
            });
        }
        const customerDetails = yield model_1.userExtendedModel.findById(customerId);
        const tattooArtistDetails = yield model_1.userExtendedModel.findById(tattooArtistId);
        const newAppointment = new appointmentsModel_1.appointmentsExtendedModel({
            customerId,
            tattooArtistId,
            date,
            startTime,
            endTime,
            role,
            price,
            comments,
            phoneCustomer: customerDetails.phone,
            phoneTattooArtist: tattooArtistDetails.phone,
        });
        const savedAppointment = yield newAppointment.save();
        return res.status(200).json({
            success: true,
            message: 'Appointment generated successfully',
            newAppointment: savedAppointment.toObject(),
        });
    }
    catch (error) {
        console.error('Error:', error);
        return (0, errorHandlers_1.handleServerError)(res);
    }
});
exports.createAppointment = createAppointment;
// // Verificar si ya hay una cita para el cliente en ese período
// const customerAppointmentFound = await appointmentsExtendedModel.findOne({
//   customerId,
//   date,
//   $or: [
//     { $and: [{ startTime: { $gte: startTime } }, { startTime: { $lt: endTime } }] },
//     { $and: [{ endTime: { $gt: startTime } }, { endTime: { $lte: endTime } }] },
//   ],
// });
// if (customerAppointmentFound) {
//   return res.status(200).json({
//     success: false,
//     message: 'Invalid date and time. Customer already has another appointment.',
//   });
// }
// // Verificar si ya hay una cita para el tatuador en ese período
// const tattooArtistAppointmentFound = await appointmentsExtendedModel.findOne({
//   tattooArtistId,
//   date,
//   $or: [
//     { $and: [{ startTime: { $gte: startTime } }, { startTime: { $lt: endTime } }] },
//     { $and: [{ endTime: { $gt: startTime } }, { endTime: { $lte: endTime } }] },
//   ],
// });
// if (tattooArtistAppointmentFound) {
//   return res.status(200).json({
//     success: false,
//     message: 'Invalid date and time. Tattoo artist already has another appointment.',
//   });
// }
const getAppointments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { role, _id: userId } = req.token;
        let query;
        if (role === 'customer') {
            query = { customerId: userId };
        }
        else if (role === 'tattooArtist') {
            query = { tattooArtistId: userId };
        }
        else {
            query = {};
        }
        const appointments = yield appointmentsModel_1.appointmentsExtendedModel.find(query);
        return res.status(200).json({
            success: true,
            message: 'Citas obtenidas correctamente.',
            appointments: appointments.map((appointment) => appointment.toObject()),
        });
    }
    catch (error) {
        console.error('Error:', error);
        return (0, errorHandlers_1.handleServerError)(res);
    }
});
exports.getAppointments = getAppointments;
const deleteAppointment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { _id } = req.params; // Obtener el ID de la cita a eliminar
        const { role, _id: userId } = req.token; // Obtener el rol y el ID del usuario desde el token
        const appointment = yield appointmentsModel_1.appointmentsExtendedModel.findById(_id);
        if (!appointment) {
            return (0, errorHandlers_1.handleNotFound)(res);
        }
        const unauthorizedMessage = 'No tienes permisos para eliminar esta cita.';
        if (role === 'customer' && appointment.customerId.toString() !== userId) {
            return res.status(403).json({
                success: false,
                message: unauthorizedMessage,
            });
        }
        if (role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: unauthorizedMessage,
            });
        }
        const result = yield appointmentsModel_1.appointmentsExtendedModel.findByIdAndUpdate(_id, { $set: { isDeleted: true } }, { new: true });
        return result
            ? res.status(200).json({
                success: true,
                message: 'Cita eliminada correctamente.',
                deletedAppointment: result.toObject(),
            })
            : (0, errorHandlers_1.handleNotFound)(res);
    }
    catch (error) {
        return (0, errorHandlers_1.handleServerError)(res);
    }
});
exports.deleteAppointment = deleteAppointment;
//# sourceMappingURL=appointmentsController.js.map