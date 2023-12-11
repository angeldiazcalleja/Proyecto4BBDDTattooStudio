import mongoose, { Schema } from "mongoose";

const UserExtendedSchema = new Schema(
  { 
    name: {type:String,minlength:3, maxlength:15},
    surname: {type:String,minlength:3, maxlength:15},
    email: {type: String,required: true,unique: true},
    phone: {type: Number,unique: true, required:false},
    password: {type: String,select: false,required: true},
    role: {type: String,default: 'customer'},
    isDeleted: {type: Boolean,default: false},
  },
  {
    versionKey: false,
    timestamps: true,
  });

export const userExtendedModel = mongoose.model("Users", UserExtendedSchema);
export default UserExtendedSchema;

