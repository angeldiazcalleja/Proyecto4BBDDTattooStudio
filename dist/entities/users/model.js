"use strict";
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
exports.userExtendedModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const ulid_1 = require("ulid");
// const isPasswordValid = (value: string) => {
//   const passwordSchema = new passwordValidator();
//   passwordSchema
//     .is()
//     .min(8) 
//     .max(12) 
//     .has()
//     .uppercase() 
//     .digits(1) 
//     .symbols(1); 
//   return passwordSchema.validate(value);
// }
const UserExtendedSchema = new mongoose_1.Schema({ _id: { type: String, default: ulid_1.ulid },
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
    password: {
        type: String,
        select: false,
        required: true
        // validate: {
        //   validator: isPasswordValid,
        //   message: "La contraseña no cumple con los requisitos",
        // }
    },
    role: {
        type: String,
        enum: ['customer', 'tattooArtist', 'admin'],
        default: 'customer',
    },
    // id: String,
    isDeleted: {
        type: Boolean,
        default: false,
    },
    // tattooArtists: [{
    //   type: Schema.Types.ObjectId,
    //   ref: 'tattooArtist', 
    // }]
}, {
    versionKey: false,
    timestamps: true,
});
exports.default = UserExtendedSchema;
exports.userExtendedModel = mongoose_1.default.model("Users", UserExtendedSchema);
//# sourceMappingURL=model.js.map