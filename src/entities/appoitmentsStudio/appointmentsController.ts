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
        message: "You don't have permission to create appointments for other customers.",
      });
    }

    if (userRole === 'tattooArtist' && userId !== tattooArtistId) {
      return res.status(403).json({
        success: false,
        message: "You don't have permission to create appointments for other tattooArtists.",
      });
    }
    // Verificar si ya hay una cita para el cliente en ese período
    const customerAppointmentFound = await appointmentsExtendedModel.findOne({
      customerId,
      date,
      $or: [
        { $and: [{ startTime: { $gte: startTime } }, { startTime: { $lt: endTime } }] },
        { $and: [{ endTime: { $gt: startTime } }, { endTime: { $lte: endTime } }] },
      ],
    });

    if (customerAppointmentFound) {
      return res.status(200).json({
        success: false,
        message: 'Invalid date and time. Customer already has another appointment.',
      });
    }

    // Verificar si ya hay una cita para el tatuador en ese período
    const tattooArtistAppointmentFound = await appointmentsExtendedModel.findOne({
      tattooArtistId,
      date,
      $or: [
        { $and: [{ startTime: { $gte: startTime } }, { startTime: { $lt: endTime } }] },
        { $and: [{ endTime: { $gt: startTime } }, { endTime: { $lte: endTime } }] },
      ],
    });

    if (tattooArtistAppointmentFound) {
      return res.status(200).json({
        success: false,
        message: 'Invalid date and time. Tattoo artist already has another appointment.',
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
    return handleServerError(res);
  }
};

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
      message: "Appointments retrieved successfully.",
      appointments: appointments.map((appointment) => appointment.toObject()),
    });
  } catch (error) {
    return handleServerError(res);
  }
};

export const getAppointmentById = async (req: Request, res: Response) => {
  try {
    const { role, _id: userId } = req.token;
    const { _id: appointmentId } = req.params;

    let query;
    if (role === 'customer') {
      query = { customerId: userId, _id: appointmentId };
    } else if (role === 'tattooArtist') {
      query = { tattooArtistId: userId, _id: appointmentId };
    } else {
      query = { _id: appointmentId };
    }

    const appointment = await appointmentsExtendedModel.findOne(query);

    if (!appointment) {
      return handleNotFound(res);
    }

    return res.status(200).json({
      success: true,
      message: 'Appointment retrieved successfully.',
      appointment: appointment.toObject(),
    });
  } catch (error) {
    return handleServerError(res);
  }
};


export const updateAppointment = async (req: Request, res: Response) => {
  try {
    const { _id } = req.params; // Obtener el ID de la cita a modificar
    const { role, _id: userId } = req.token; // Obtener el rol y el ID del usuario desde el token
    const { date, startTime, endTime, price, comments } = req.body;

    const appointment = await appointmentsExtendedModel.findById(_id);

    if (!appointment) {
      return handleNotFound(res);
    }

    // Verificar permisos para modificar la cita
    const unauthorizedMessage = "You do not have permission to modify this appointment.";
    if (role === 'customer' && appointment.customerId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: unauthorizedMessage,
      });
    }

    if (role === 'tattooArtist' && appointment.tattooArtistId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: unauthorizedMessage,
      });
    }

    // Verificar si la nueva fecha y hora coinciden con otra cita existente
    const conflictingAppointment = await appointmentsExtendedModel.findOne({
      _id: { $ne: _id }, // Excluir la cita actual
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
          ]},
      ],
    });

    if (conflictingAppointment) {
      return res.status(400).json({
        success: false,
        message: "The new date and time coincide with another existing appointment for this customer or tattoo artist.",
      });
    }

    // Modificar la cita
    const result = await appointmentsExtendedModel.findByIdAndUpdate(
      _id,
      { $set: { date, startTime, endTime, price, comments } },
      { new: true }
    );

    return result
      ? res.status(200).json({
          success: true,
          message: "Appointment successfully modified.",
          updatedAppointment: result.toObject(),
        })
      : handleNotFound(res);
  } catch (error) {
    return handleServerError(res);
  }
};

export const deleteAppointment = async (req: Request, res: Response) => {
  try {
    const { _id } = req.params;
    const { role, _id: userId } = req.token;
    const appointment = await appointmentsExtendedModel.findById(_id);

    if (!appointment) {
    return handleNotFound(res);
    }

    const unauthorizedMessage = "You do not have permission to delete this appointment.";

    if (role === 'customer' && appointment.customerId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: unauthorizedMessage,
      });
    }

    if (role !== 'admin' && !(role === 'customer' && appointment.customerId.toString() === userId)) {
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
          message: "Appointment deleted successfully.",
          deletedAppointment: result.toObject(),
        })
      : handleNotFound(res);
  } catch (error) {
    return handleServerError(res);
  }
};
