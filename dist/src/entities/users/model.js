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
const UserExtendedSchema = new mongoose_1.Schema({
    name: { type: String, minlength: 3, maxlength: 15 },
    surname: { type: String, minlength: 3, maxlength: 15 },
    email: { type: String, required: true, unique: true },
    phone: { type: Number, unique: true, required: false },
    password: { type: String, select: false, required: true },
    role: { type: String, default: 'customer' },
    isDeleted: { type: Boolean, default: false },
}, {
    versionKey: false,
    timestamps: true,
});
exports.userExtendedModel = mongoose_1.default.model("Users", UserExtendedSchema);
exports.default = UserExtendedSchema;
//# sourceMappingURL=model.js.map