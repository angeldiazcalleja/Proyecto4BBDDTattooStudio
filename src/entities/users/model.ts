import mongoose, { Schema } from "mongoose";

const UserExtendedSchema = new Schema(
  { 
    name: String,
    surname: String,
    email: {type: String,required: true,unique: true},
    phone: {type: Number,unique: true},
    password: {type: String,select: false,required: true},
    role: {type: String,enum: ['customer', 'tattooArtist', 'admin']},
    isDeleted: {type: Boolean,default: false},
  },
  {
    versionKey: false,
    timestamps: true,
  });

export const userExtendedModel = mongoose.model("Users", UserExtendedSchema);
export default UserExtendedSchema;

