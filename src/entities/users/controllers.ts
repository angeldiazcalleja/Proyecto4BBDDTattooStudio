import { Request, Response } from "express";
import { userExtendedModel } from "./model";
import {
  handleBadRequest,
  handleNotFound,
  handleUnauthorized,
} from "../../core/errorHandlers";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import CONF from "../../core/config";
import { Types } from "mongoose";

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await userExtendedModel.findOne({ email }).select("+password");

    if (user) {
      if (await bcrypt.compare(password, user.password)) {
        const token = jwt.sign({ _id: user._id, email, role: user.role }, CONF.SECRET, {
          expiresIn: "24h",
        });
        res.json({ token });
      } else {
        res.status(401).json({ error: "Invalid credentials" });
      }
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

export const register = async (req: Request, res: Response) => {
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,16}$/;
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

  const { name, surname, email, phone, password, role } = req.body;
  const requestingUserRole = req.token?.role;

  if (!name || !surname || !email || !phone || !password || !role) {
    return handleBadRequest(res);
  }

  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      message: "The password does not meet the requirements. It must be between 8 and 16 characters, contain at least one uppercase letter, one digit, and one special character.",
    });
  }

  if (!emailRegex.test(email)) {
    return res.status(400).json({
      message: "Invalid email address format.",
    });
  }
  const userFound = await userExtendedModel.findOne({ email });

  if (userFound) {
    return res.status(409).json({
      message: "There is already a registered user with that email address.",
    });
  }

  if (role === 'customer') {
   
    const hashedPassword = bcrypt.hashSync(password, CONF.HASH_ROUNDS);

    const newUser = new userExtendedModel({
      name, surname, email, phone, password: hashedPassword, role,
    });

    const result = await newUser.save();

    return res.status(200).json({
      message: "User registered successfully.",
      userRegistered: result.toObject(),
    });
  } else if (requestingUserRole === 'admin') {
  
    const hashedPassword = bcrypt.hashSync(password, CONF.HASH_ROUNDS);

    const newUser = new userExtendedModel({
      name, surname, email, phone, password: hashedPassword, role,
    });

    const result = await newUser.save();

    return res.status(200).json({
      message: "User registered successfully.",
      userRegistered: result.toObject(),
    });
  } else {

    return res.status(403).json({
      message: "You do not have permission to create a user with the specified role.",
    });
  }
};

export const findUsers = async (req: Request, res: Response) => {
  const requestingUserRole = req.token?.role;

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
};

export const findCustomer = async (req: Request, res: Response) => {
  const { _id } = req.params;
  const requestingUserId = req.token?._id;
  const requestingUserRole = req.token?.role; 

  const user = await userExtendedModel.findOne({
    _id: _id,
    isDeleted: false,
  });

  if (user) {
    if (requestingUserRole === "admin" || (requestingUserRole === "customer" && user._id.toString() === requestingUserId)) {
      return res.status(200).json(user);
    } else {
      return handleUnauthorized(res);
    }
  } else {
    return handleNotFound(res);
  }
};

export const modifyUser = async (req: Request, res: Response) => {
  const { _id } = req.params;
  const { name, surname, email, phone, role, password } = req.body;
  const userIdFromToken = req.token?._id;
  const roleIdFromToken = req.token?.role;

  const user = await userExtendedModel.findOne({ _id: new Types.ObjectId(_id) });

  const unauthorizedMessage = "You do not have permission to modify this account.";
  if (!user || (roleIdFromToken === 'customer' && userIdFromToken !== user._id.toString()) || (roleIdFromToken !== 'admin' && userIdFromToken !== user._id.toString())) {
    return res.status(403).json({
      message: unauthorizedMessage,
    });
  }

  if (name) user.name = name;
  if (surname) user.surname = surname;
  if (email) user.email = email;
  if (phone) user.phone = phone;

  if (password) {
    const hashedPassword = bcrypt.hashSync(password, CONF.HASH_ROUNDS);
    user.password = hashedPassword;
  }

  if (roleIdFromToken === 'admin' && role) {
    user.role = role;
  }

  const result = await user.save();

  return res.status(200).json(result);
};

export const deleteUser = async (req: Request, res: Response) => {
  const { _id } = req.params;
  const userIdFromToken = req.token?._id?.toString();

  const { ObjectId } = Types;
  const objectId = new ObjectId(_id); 

  if (
    userIdFromToken &&
    req.token?.role === "customer" &&
    userIdFromToken !== _id
  ) {
    return res.status(403).json({
      message: "You do not have permission to delete this account.",
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
};
