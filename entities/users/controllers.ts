import { Request, Response } from "express";
import { userExtendedModel } from "./model";
import {
  handleBadRequest,
  handleNotFound,
  handleServerError,
} from "../../core/errorHandlers";
import bcrypt from "bcrypt";

export const saveUsers = async (req: Request, res: Response) => {
  try {
    const { name, surname, email, phone, password } = req.body;

    if (!name || !surname || !email || !phone || !password) {
      return handleBadRequest(res);
    }

    const userFound = await userExtendedModel.findOne({ email });

    if (userFound) {
      return res.status(409).json({
        success: false,
        message: "Ya existe un usuario registrado con ese correo electrónico.",
      });      
    }

    const hashedPassword = bcrypt.hashSync(password, 5);

    const newUser = new userExtendedModel({
      name,
      surname,
      email,
      phone,
      password: hashedPassword,
      id: Date.now(),
    });

    const result = await newUser.save();

    return res.status(200).json({
      success: true,
      message: "Usuario registrado con éxito",
      userRegistered: {
        name: result.name,
        surname: result.surname,
        email: result.email,
        phone: result.phone,
      },
    });
  } catch (error) {
    console.error("Error:", error);
    return handleServerError(res);
  }
};

export const findUsers = async (req: Request, res: Response) => {
  try {
    const users = await userExtendedModel.find();
    return res.status(200).json(users);
  } catch (error) {
    return handleServerError(res);
  }
};

export const findUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await userExtendedModel.findOne({ id: parseInt(id) });

    if (user) {
      return res.status(200).json(user);
    } else {
      return handleNotFound(res);
    }
  } catch (error) {
    return handleServerError(res);
  }
};

export const modifyUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, surname, email, phone } = req.body;
    const user = await userExtendedModel.findOne({ id: parseInt(id) });

    if (user) {
      user.name = name;
      user.surname = surname;
      user.email = email;
      user.phone = phone;
      const result = await user.save();
      return res.status(200).json(result);
    } else {
      return handleNotFound(res);
    }
  } catch (error) {
    return handleServerError(res);
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await userExtendedModel.deleteOne({ id: parseInt(id) });

    if (result.deletedCount === 1) {
      return res.status(200).json(result);
    } else {
      return handleNotFound(res);
    }
  } catch (error) {
    return handleServerError(res);
  }
};
