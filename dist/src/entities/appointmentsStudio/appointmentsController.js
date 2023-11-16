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
exports.createAppointment = void 0;
const appointmentsModel_1 = require("./appointmentsModel");
const errorHandlers_1 = require("../../core/errorHandlers");
// export const createAppointment = async (req: Request, res: Response) => {
//   try {
//     const clientId = req.token._id;
//     const { tattooArtistId, date, startTime, endTime, role, price, phoneClient, comments } = req.body;
//     const appointmentFound = await appointmentsExtendedModel.findOne({ date, startTime });
//     if (appointmentFound) {
//       return res.status(200).json({
//         success: false,
//         message: 'Invalid date and time. Appointment already exists.',
//       });
//     }
//     const newAppointment = new appointmentsExtendedModel({
//       clientId,
//       tattooArtistId,
//       date,
//       startTime,
//       endTime,
//       role,
//       price,
//       phoneClient,
//       comments,
//     });
//     const savedAppointment = await newAppointment.save();
//     return res.status(200).json({
//       success: true,
//       message: 'Appointment generated successfully',
//       newAppointment: savedAppointment.toObject(),
//     });
//   } catch (error) {
//     console.error('Error:', error);
//     return handleServerError(res);
//   }
// };
const createAppointment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const customerId = req.token._id;
        const { customerId, tattooArtistId, date, startTime, endTime, role, price, comments } = req.body;
        const appointmentFound = yield appointmentsModel_1.appointmentsExtendedModel.findOne({ date, startTime });
        if (appointmentFound) {
            return res.status(200).json({
                success: false,
                message: 'Invalid date and time. Appointment already exists.',
            });
        }
        const newAppointment = new appointmentsModel_1.appointmentsExtendedModel({
            customerId,
            tattooArtistId,
            date,
            startTime,
            endTime,
            role,
            price,
            comments,
        });
        const savedAppointment = yield newAppointment.save();
        // Populamos los detalles del cliente y del tatuador antes de devolver la respuesta
        const populatedAppointment = yield appointmentsModel_1.appointmentsExtendedModel
            .findById(savedAppointment._id)
            .populate('clientId', 'name surname email phone') // Puedes especificar los campos que deseas devolver
            .populate('tattooArtistId', 'name surname email phone');
        return res.status(200).json({
            success: true,
            message: 'Appointment generated successfully',
            newAppointment: populatedAppointment,
        });
    }
    catch (error) {
        console.error('Error:', error);
        return (0, errorHandlers_1.handleServerError)(res);
    }
});
exports.createAppointment = createAppointment;
//# sourceMappingURL=appointmentsController.js.map