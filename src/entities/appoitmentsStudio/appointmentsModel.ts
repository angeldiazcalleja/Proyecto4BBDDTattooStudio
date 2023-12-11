import mongoose, { Schema, Types } from "mongoose";

const appointmentsExtendedSchema = new Schema(
{
    customerId: { type: Types.ObjectId, ref: 'Users', maxlength: 24 },
    tattooArtistId: { type: Types.ObjectId, ref: 'Users', maxlength: 24 },
    phoneCustomer: { type: Number, maxlength: 9 },
    phoneTattooArtist: { type: Number, maxlength: 9 },
    nameCustomer: { type: String, maxlength: 10 },
    nameTattooArtist: { type: String, maxlength: 15 },
    date: Date,
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    service: { type: String, enum: ["tattoo", "piercing", 'laserTattoo'] },
    price: { type: Number, maxlength: 6 },
    comments: { type: String, maxlength: 150 },
    isDeleted: {type: Boolean,default: false},

},
{
    versionKey: false,
    timestamps: true,
  });

export const appointmentsExtendedModel = mongoose.model(
    "Appointments",
    appointmentsExtendedSchema
);

export default appointmentsExtendedSchema;
