"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const appoitmentsExtendedSchema = new mongoose_1.Schema({
    clientId: Number,
    tattooArtistId: Number,
    date: Date,
    role: { type: String, enum: ['tattoo', 'piercing'] },
    price: Number,
    phoneCliente: Number,
    comments: String,
});
//# sourceMappingURL=appoitmentsModel.js.map