import mongoose, { Schema, Document } from "mongoose";
import { ulid } from "ulid";

export interface UserExtendedDocument extends Document {
  name: string;
  surname: string;
  email: string;
  phone: number;
  id: number;
}

const UserExtendedSchema = new Schema(
  {
    _id: { type: String, default: ulid },
    name: String,
    surname: String,
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: Number,
      unique: true,
    },
    id: Number,
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

export const userExtendedModel = mongoose.model<UserExtendedDocument>(
  "Users",
  UserExtendedSchema
);
