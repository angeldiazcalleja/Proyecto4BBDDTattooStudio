import { Request, Response } from 'express';
import { appointmentsExtendedModel } from './appointmentsModel';
import { userExtendedModel } from '../users/model'; 
import { handleServerError, handleNotFound } from '../../core/errorHandlers';

export const createAppointment = async (req: Request, res: Response) => {
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

    const appointmentFound = await appointmentsExtendedModel.findOne({ date, startTime });

    if (appointmentFound) {
      return res.status(400).json({
        success: false,
        message: 'Invalid date and time. Appointment already exists.',
      });
    }

    const customerDetails = await userExtendedModel.findById(customerId);
    const tattooArtistDetails = await userExtendedModel.findById(tattooArtistId);

    const newAppointment = new appointmentsExtendedModel({
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

    const savedAppointment = await newAppointment.save();

    return res.status(200).json({
      success: true,
      message: 'Appointment generated successfully',
      newAppointment: savedAppointment.toObject(),
    });
  } catch (error) {
    console.error('Error:', error);
    return handleServerError(res);
  }
};


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


export const getAppointments = async (req: Request, res: Response) => {
  try {
    const { role, _id: userId } = req.token;

    let query;
    if (role === 'customer') {
      query = { customerId: userId };
    } else if (role === 'tattooArtist') {
      query = { tattooArtistId: userId };
    } else {
      query = {};
    }

    const appointments = await appointmentsExtendedModel.find(query);

    return res.status(200).json({
      success: true,
      message: 'Citas obtenidas correctamente.',
      appointments: appointments.map((appointment) => appointment.toObject()),
    });
  } catch (error) {
    console.error('Error:', error);
    return handleServerError(res);
  }
};



export const deleteAppointment = async (req: Request, res: Response) => {
  try {
    const { _id } = req.params; // Obtener el ID de la cita a eliminar
    const { role, _id: userId } = req.token; // Obtener el rol y el ID del usuario desde el token

    const appointment = await appointmentsExtendedModel.findById(_id);
 
    if (!appointment) {
      return handleNotFound(res);
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

    const result = await appointmentsExtendedModel.findByIdAndUpdate(
      _id,
      { $set: { isDeleted: true } },
      { new: true }
    );

    return result
      ? res.status(200).json({
          success: true,
          message: 'Cita eliminada correctamente.',
          deletedAppointment: result.toObject(),
        })
      : handleNotFound(res);
  } catch (error) {
    return handleServerError(res);
  }
};
