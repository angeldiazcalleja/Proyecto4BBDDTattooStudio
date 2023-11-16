import { Request, Response} from "express";
import { userExtendedModel } from "./model";
import {
  handleBadRequest,
  handleNotFound,
  handleServerError,
  handleUnauthorized,
} from "../../core/errorHandlers";
import bcrypt from "bcrypt";
import CONF from "../../core/config";
import { Types } from "mongoose";

//REGISTER

export const register = async (req: Request, res: Response) => {

  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,16}$/;

  try {
    const { name, surname, email, phone, password, role } = req.body;
    const requestingUserRole = req.token?.role;

    if (!name || !surname || !email || !phone || !password || !role) {
      return handleBadRequest(res);
    }

    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        success: false,
        message: 'La contraseña no cumple con los requisitos.Debe tener entre 8 y 16 carácteres,una letra mayúscula, un dígito y un carácter especial',
      });
    }    
    const userFound = await userExtendedModel.findOne({ email });

    if (userFound) {
      return res.status(409).json({
        success: false,
        message: "Ya existe un usuario registrado con ese correo electrónico.",
      });3
    }

    // Verificar si el usuario que realiza la solicitud es un administrador
    if (requestingUserRole !== 'admin') {
      // Si no es administrador, solo puede crear usuarios con los roles 'customer' o 'admin'
      if (role !== 'customer' && role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'No tienes permisos para crear un usuario con el rol especificado.',
        });
      }
    }

    const hashedPassword = bcrypt.hashSync(password, CONF.HASH_ROUNDS);

    const newUser = new userExtendedModel({
      name,
      surname,
      email,
      phone,
      password: hashedPassword,
      role,
    });

    const result = await newUser.save();

    return res.status(200).json({
      success: true,
      message: "Usuario registrado con éxito",
      userRegistered: result.toObject(),
    });
  } catch (error) {
    console.error("Error:", error);
    return handleServerError(res);
  }
};

//ENCONTRAR USUARIOS

export const findUsers = async (req: Request, res: Response) => {
  try {
    const requestingUserRole = req.token?.role;

    // Verificar si el usuario que realiza la solicitud es un administrador
    if (requestingUserRole !== "admin") {
      return handleUnauthorized(res);
    }

    let users = await userExtendedModel.find();

    const { sort, search, role } = req.query;
    if (role && typeof role === "string") {
      users = users.filter((user) => user.role === role);
    }
    if (sort === "ASC") {
      users = users.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sort === "DSC") {
      users = users.sort((a, b) => b.name.localeCompare(a.name));
    }
    if (search && typeof search === "string") {
      users = users.filter((user) =>
        user.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    return res.status(200).json(users);
  } catch (error) {
    console.error("Error:", error);
    return handleServerError(res);
  }
};

//ENCONTRAR CUSTOMER

export const findCustomer = async (req: Request, res: Response) => {
  try {
    const { _id } = req.params;
    const requestingUserId = req.token?._id; // Obtener el ID del usuario que realiza la solicitud desde el token
    const requestingUserRole = req.token?.role; // Obtener el rol del usuario que realiza la solicitud desde el token
   
    // Obtener el usuario de la base de datos
    const user = await userExtendedModel.findOne({
      _id: _id,
      isDeleted: false,
    });

    if (user) {
      if (requestingUserRole === "customer" && user._id.toString() !== requestingUserId) {
        return handleUnauthorized(res);
      } else if (requestingUserRole === "admin") {
        return res.status(200).json(user);
      } else {
        return handleNotFound(res);
      }
    } else {
      return handleNotFound(res);
    }
  } catch (error) {
    return handleServerError(res);
  }
};

//MODIFICAR 

export const modifyUser = async (req: Request, res: Response) => {
  try {
    const { _id } = req.params;
    const { name, surname, email, phone, role } = req.body;
    const userIdFromToken = req.token?._id;
    const roleIdFromToken = req.token?.role;

    // Obtener el usuario de la base de datos
    const user = await userExtendedModel.findOne({ _id: new Types.ObjectId(_id) });

    // Verificar permisos para modificar
    const unauthorizedMessage = 'No tienes permisos para modificar esta cuenta.';
    if (!user || (roleIdFromToken === 'customer' && userIdFromToken !== user._id.toString()) || (roleIdFromToken !== 'admin' && userIdFromToken !== user._id.toString())) {
      return res.status(403).json({
        success: false,
        message: unauthorizedMessage,
      });
    }

    // Actualizar los campos del usuario
    if (name) user.name = name;
    if (surname) user.surname = surname;
    if (email) user.email = email;
    if (phone) user.phone = phone;

    // Actualizar el campo 'role' solo si es un administrador
    if (roleIdFromToken === 'admin' && role) {
      user.role = role;
    }

    // Guardar los cambios en la base de datos
    const result = await user.save();

    return res.status(200).json(result);
  } catch (error) {
    return handleServerError(res);
  }
};

//DELETE

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { _id } = req.params;
    const userIdFromToken = req.token?._id?.toString();

    const { ObjectId } = Types;
    const objectId = new ObjectId(_id); // Crear un nuevo ObjectId a partir de _id

    if (
      userIdFromToken &&
      req.token?.role === "customer" &&
      userIdFromToken !== _id
    ) {
      return res.status(403).json({
        success: false,
        message: "No tienes permisos para eliminar esta cuenta.",
      });
    }

    if (req.token?.role === "admin") {
      const result = await userExtendedModel.updateOne(
        { _id: objectId },
        { isDeleted: true }
      );

      return result.modifiedCount === 1
        ? res.status(200).json(result)
        : handleNotFound(res);
    }

    const result = await userExtendedModel.updateOne(
      { _id: objectId },
      { isDeleted: true }
    );

    return result.modifiedCount === 1
      ? res.status(200).json(result)
      : handleNotFound(res);
  } catch (error) {
    return handleServerError(res);
  }
};


