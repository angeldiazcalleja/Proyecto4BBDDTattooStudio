import mongoose, { Schema } from "mongoose";

const UserExtendedSchema = new Schema(
  { 
    name: {type:String,minlength:3, maxlength:15, required:true},
    surname: {type:String,minlength:3, maxlength:15, required:true},
    email: {type: String,required: true,unique: true},
    phone: {type: Number,unique: true, required:true},
    password: {type: String,select: false,required: true},
    role: {type: String,enum: ['customer', 'tattooArtist', 'admin'],required:true},
    isDeleted: {type: Boolean,default: false},
  },
  {
    versionKey: false,
    timestamps: true,
  });

export const userExtendedModel = mongoose.model("Users", UserExtendedSchema);
export default UserExtendedSchema;

