"use strict";
// import mongoose, { Schema } from "mongoose";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.appointmentsExtendedModel = void 0;
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
const mongoose_1 = __importStar(require("mongoose"));
const appointmentsExtendedSchema = new mongoose_1.Schema({
    customerId: { type: mongoose_1.Types.ObjectId, ref: 'Users', maxlength: 24 },
    tattooArtistId: { type: mongoose_1.Types.ObjectId, ref: 'Users', maxlength: 24 },
    date: Date,
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    role: { type: String, enum: ['tattoo', 'piercing', 'laserTattoo'] },
    price: { type: Number, maxlength: 6 },
    comments: { type: String, maxlength: 150 }
});
exports.appointmentsExtendedModel = mongoose_1.default.model("Appointments", appointmentsExtendedSchema);
exports.default = appointmentsExtendedSchema;
//# sourceMappingURL=appointmentsModel.js.map