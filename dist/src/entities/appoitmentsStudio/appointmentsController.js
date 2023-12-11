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
exports.deleteAppointment = exports.updateAppointment = exports.getAppointmentById = exports.getAppointments = exports.createAppointment = void 0;
const appointmentsModel_1 = require("./appointmentsModel");
const model_1 = require("../users/model");
const errorHandlers_1 = require("../../core/errorHandlers");
const createAppointment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { customerId, tattooArtistId, date, startTime, endTime, service } = req.body;
    const currentDate = new Date();
    if (new Date(date) < currentDate) {
        return res.status(400).json({
            message: "Invalid date. Please choose a date in the future.",
        });
    }
    const { role: userRole, _id: userId } = req.token;
    if (userRole === "customer" && userId !== customerId) {
        return res.status(403).json({
            message: "You don't have permission to create appointments for other customers.",
        });
    }
    if (userRole === "tattooArtist" && userId !== tattooArtistId) {
        return res.status(403).json({
            message: "You don't have permission to create appointments for other tattooArtists.",
        });
    }
    const customerAppointmentFound = yield appointmentsModel_1.appointmentsExtendedModel.findOne({
        customerId,
        date,
        $or: [
            {
                $and: [
                    { startTime: { $gte: startTime } },
                    { startTime: { $lt: endTime } },
                ],
            },
            {
                $and: [{ endTime: { $gt: startTime } }, { endTime: { $lte: endTime } }],
            },
        ],
    });
    if (customerAppointmentFound) {
        return res.status(400).json({
            message: "Invalid date and time. Customer already has another appointment.",
        });
    }
    const tattooArtistAppointmentFound = yield appointmentsModel_1.appointmentsExtendedModel.findOne({
        tattooArtistId,
        date,
        $or: [
            {
                $and: [
                    { startTime: { $gte: startTime } },
                    { startTime: { $lt: endTime } },
                ],
            },
            {
                $and: [{ endTime: { $gt: startTime } }, { endTime: { $lte: endTime } }],
            },
        ],
    });
    if (tattooArtistAppointmentFound) {
        return res.status(400).json({
            message: "Invalid date and time. Tattoo artist already has another appointment.",
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
        service,
        nameCustomer: customerDetails.name,
        nameTattooArtist: tattooArtistDetails.name,
        phoneCustomer: customerDetails.phone,
        phoneTattooArtist: tattooArtistDetails.phone,
    });
    const savedAppointment = yield newAppointment.save();
    return res.status(200).json({
        message: "Appointment generated successfully",
        newAppointment: savedAppointment.toObject(),
    });
});
exports.createAppointment = createAppointment;
// export const getAppointments = async (req: Request, res: Response) => {
//   const { role, _id: userId } = req.token;
//   let query;
//   if (role === "customer") {
//     query = { customerId: userId };
//   } else if (role === "tattooArtist") {
//     query = { tattooArtistId: userId };
//   } else {
//     query = {};
//   }
//   const appointments = await appointmentsExtendedModel.find(query);
//   return res.status(200).json({
//     message: "Appointments retrieved successfully.",
//     appointments: appointments.map((appointment) => appointment.toObject()),
//   });
// };
const getAppointments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { role, _id: userId } = req.token;
    const { page = '1', limit = '10' } = req.query;
    // Convertir page y limit a números
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    let query;
    if (role === "customer") {
        query = { customerId: userId };
    }
    else if (role === "tattooArtist") {
        query = { tattooArtistId: userId };
    }
    else {
        query = {};
    }
    try {
        const totalAppointments = yield appointmentsModel_1.appointmentsExtendedModel.countDocuments(query);
        const appointments = yield appointmentsModel_1.appointmentsExtendedModel
            .find(query)
            .skip((pageNumber - 1) * limitNumber)
            .limit(limitNumber);
        return res.status(200).json({
            message: "Appointments retrieved successfully.",
            appointments: appointments.map((appointment) => appointment.toObject()),
            totalAppointments: totalAppointments,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
});
exports.getAppointments = getAppointments;
const getAppointmentById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { role, _id: userId } = req.token;
    const { _id: appointmentId } = req.params;
    let query;
    if (role === "customer") {
        query = { customerId: userId, _id: appointmentId };
    }
    else if (role === "tattooArtist") {
        query = { tattooArtistId: userId, _id: appointmentId };
    }
    else {
        query = { _id: appointmentId };
    }
    const appointment = yield appointmentsModel_1.appointmentsExtendedModel.findOne(query);
    if (!appointment) {
        return (0, errorHandlers_1.handleNotFound)(res);
    }
    return res.status(200).json({
        message: "Appointment retrieved successfully.",
        appointment: appointment.toObject(),
    });
});
exports.getAppointmentById = getAppointmentById;
const updateAppointment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id } = req.params;
    const { role, _id: userId } = req.token;
    const { date, startTime, endTime, price, service, comments } = req.body;
    const appointment = yield appointmentsModel_1.appointmentsExtendedModel.findById(_id);
    if (!appointment) {
        return (0, errorHandlers_1.handleNotFound)(res);
    }
    const unauthorizedMessage = "You do not have permission to modify this appointment.";
    if (role === "customer" && appointment.customerId.toString() !== userId) {
        return res.status(403).json({
            message: unauthorizedMessage,
        });
    }
    if (role === "tattooArtist" &&
        appointment.tattooArtistId.toString() !== userId) {
        return res.status(403).json({
            message: unauthorizedMessage,
        });
    }
    const conflictingAppointment = yield appointmentsModel_1.appointmentsExtendedModel.findOne({
        _id: { $ne: _id },
        date,
        $or: [
            {
                $and: [
                    { startTime: { $lt: endTime } },
                    { endTime: { $gt: startTime } },
                ],
            },
            {
                $and: [
                    { startTime: { $lt: endTime } },
                    { endTime: { $gt: startTime } },
                ],
            },
        ],
    });
    if (conflictingAppointment) {
        return res.status(400).json({
            message: "The new date and time coincide with another existing appointment for this customer or tattoo artist.",
        });
    }
    const result = yield appointmentsModel_1.appointmentsExtendedModel.findByIdAndUpdate(_id, { $set: { date, startTime, endTime, price, service, comments } }, { new: true });
    console.log(result);
    return result
        ? res.status(200).json({
            message: "Appointment successfully modified.",
            updatedAppointment: result.toObject(),
        })
        : (0, errorHandlers_1.handleNotFound)(res);
});
exports.updateAppointment = updateAppointment;
const deleteAppointment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id } = req.params;
    const { role, _id: userId } = req.token;
    const appointment = yield appointmentsModel_1.appointmentsExtendedModel.findById(_id);
    if (!appointment) {
        return (0, errorHandlers_1.handleNotFound)(res);
    }
    const unauthorizedMessage = "You do not have permission to delete this appointment.";
    if (role === "customer" && appointment.customerId.toString() !== userId) {
        return res.status(403).json({
            message: unauthorizedMessage,
        });
    }
    if (role !== "admin" &&
        !(role === "customer" && appointment.customerId.toString() === userId)) {
        return res.status(403).json({
            message: unauthorizedMessage,
        });
    }
    const result = yield appointmentsModel_1.appointmentsExtendedModel.findByIdAndUpdate(_id, { $set: { isDeleted: true } }, { new: true });
    if (result) {
        return res.status(200).json({
            message: "Appointment deleted successfully.",
        });
    }
    else {
        return (0, errorHandlers_1.handleNotFound)(res);
    }
});
exports.deleteAppointment = deleteAppointment;
//# sourceMappingURL=appointmentsController.js.map