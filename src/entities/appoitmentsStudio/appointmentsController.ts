import { Request, Response } from "express";
import { appointmentsExtendedModel } from "./appointmentsModel";
import { userExtendedModel } from "../users/model";
import { handleNotFound } from "../../core/errorHandlers";

export const createAppointment = async (req: Request, res: Response) => {
  const { customerId, tattooArtistId, date, startTime, endTime, service } =
    req.body;

  const currentDate = new Date();
  if (new Date(date) < currentDate) {
    return res.status(400).json({
      message: "Invalid date. Please choose a date in the future.",
    });
  }

  const { role: userRole, _id: userId } = req.token;

  if (userRole === "customer" && userId !== customerId) {
    return res.status(403).json({
      message:
        "You don't have permission to create appointments for other customers.",
    });
  }

  if (userRole === "tattooArtist" && userId !== tattooArtistId) {
    return res.status(403).json({
      message:
        "You don't have permission to create appointments for other tattooArtists.",
    });
  }
  const customerAppointmentFound = await appointmentsExtendedModel.findOne({
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
      message:
        "Invalid date and time. Customer already has another appointment.",
    });
  }

  const tattooArtistAppointmentFound = await appointmentsExtendedModel.findOne({
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
      message:
        "Invalid date and time. Tattoo artist already has another appointment.",
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
    service,
    nameCustomer: customerDetails.name,
    nameTattooArtist: tattooArtistDetails.name,
    phoneCustomer: customerDetails.phone,
    phoneTattooArtist: tattooArtistDetails.phone,
  });
  const savedAppointment = await newAppointment.save();



  return res.status(200).json({
    message: "Appointment generated successfully",
    newAppointment: savedAppointment.toObject(),
  });
};

export const getAppointments = async (req: Request, res: Response) => {
  const { role, _id: userId } = req.token;
  const { page = '1', limit = '10' } = req.query;

  const pageNumber = parseInt(page as string, 10);
  const limitNumber = parseInt(limit as string, 10);

  let query;
  if (role === "customer") {
    query = { customerId: userId };
  } else if (role === "tattooArtist") {
    query = { tattooArtistId: userId };
  } else {
    query = {};
  }

  try {
    const totalAppointments = await appointmentsExtendedModel.countDocuments(query);

    const appointments = await appointmentsExtendedModel
      .find(query)
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber);

    return res.status(200).json({
      message: "Appointments retrieved successfully.",
      appointments: appointments.map((appointment) => appointment.toObject()),
      totalAppointments: totalAppointments,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getAppointmentById = async (req: Request, res: Response) => {
  const { role, _id: userId } = req.token;
  const { _id: appointmentId } = req.params;

  let query;
  if (role === "customer") {
    query = { customerId: userId, _id: appointmentId };
  } else if (role === "tattooArtist") {
    query = { tattooArtistId: userId, _id: appointmentId };
  } else {
    query = { _id: appointmentId };
  }

  const appointment = await appointmentsExtendedModel.findOne(query);

  if (!appointment) {
    return handleNotFound(res);
  }

  return res.status(200).json({
    message: "Appointment retrieved successfully.",
    appointment: appointment.toObject(),
  });
};

export const updateAppointment = async (req: Request, res: Response) => {
  const { _id } = req.params;
  const { role, _id: userId } = req.token;
  const { date, startTime, endTime, price, service, comments } = req.body;

  const appointment = await appointmentsExtendedModel.findById(_id);

  if (!appointment) {
    return handleNotFound(res);
  }

  const unauthorizedMessage =
    "You do not have permission to modify this appointment.";
  if (role === "customer" && appointment.customerId.toString() !== userId) {
    return res.status(403).json({
      message: unauthorizedMessage,
    });
  }

  if (
    role === "tattooArtist" &&
    appointment.tattooArtistId.toString() !== userId
  ) {
    return res.status(403).json({
      message: unauthorizedMessage,
    });
  }

  const conflictingAppointment = await appointmentsExtendedModel.findOne({
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
      message:
        "The new date and time coincide with another existing appointment for this customer or tattoo artist.",
    });
  }

  const result = await appointmentsExtendedModel.findByIdAndUpdate(
    _id,
    { $set: { date, startTime, endTime, price, service, comments } },
    { new: true }
  );

  console.log(result)
  return result
    ? res.status(200).json({
        message: "Appointment successfully modified.",
        updatedAppointment: result.toObject(),
      })
    : handleNotFound(res);
   
};

export const deleteAppointment = async (req: Request, res: Response) => {
  const { _id } = req.params;
  const { role, _id: userId } = req.token;
  const appointment = await appointmentsExtendedModel.findById(_id);

  if (!appointment) {
    return handleNotFound(res);
  }

  const unauthorizedMessage =
    "You do not have permission to delete this appointment.";

  if (role === "customer" && appointment.customerId.toString() !== userId) {
    return res.status(403).json({
      message: unauthorizedMessage,
    });
  }

  if (
    role !== "admin" &&
    !(role === "customer" && appointment.customerId.toString() === userId)
  ) {
    return res.status(403).json({
      message: unauthorizedMessage,
    });
  }

  const result = await appointmentsExtendedModel.findByIdAndUpdate(
    _id,
    { $set: { isDeleted: true } },
    { new: true }
  );

  if (result) {
    return res.status(200).json({
      message: "Appointment deleted successfully.",
    });
  } else {
    return handleNotFound(res);
  }
};
