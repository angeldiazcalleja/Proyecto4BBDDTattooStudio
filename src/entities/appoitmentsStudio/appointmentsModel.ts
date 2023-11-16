// import mongoose, { Schema } from "mongoose";

// const appointmentsExtendedSchema = new Schema(
// {

//     clientId:{Number, maxlength:24},
//     tattooArtistId:{Number, maxlength:24},
//     date: Date,
//     startTime: {type: Date,required: true},
//     endTime: {type: Date,required: true},
//     role: {type: String,enum: ['tattoo', 'piercing', 'laserTattoo']},
//     price: {Number, maxlength:6},
//     phoneClient: {Number, maxlength:9},
//     comments:{String,  maxlength: 150}

// })

// export const appointmentsExtendedModel = mongoose.model(
//     "Appointments",
//     appointmentsExtendedSchema
//   );
  
//   export default appointmentsExtendedSchema;

import mongoose, { Schema, Types } from "mongoose";

const appointmentsExtendedSchema = new Schema(
{
    customerId: { type: Types.ObjectId, ref: 'Users', maxlength: 24 },
    tattooArtistId: { type: Types.ObjectId, ref: 'Users', maxlength: 24 },
    phoneCustomer: { type: Number, maxlength: 9 },
    phoneTattooArtist: { type: Number, maxlength: 9 },
    date: Date,
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    role: { type: String, enum: ['tattoo', 'piercing', 'laserTattoo'] },
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
