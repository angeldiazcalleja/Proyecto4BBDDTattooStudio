"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const routers_1 = __importDefault(require("./src/entities/users/routers"));
const appointmentsRouters_1 = __importDefault(require("./src/entities/appoitmentsStudio/appointmentsRouters"));
// import tattoArtistsRouter from "./entities/tattooArtists/routers";
const authController_1 = __importDefault(require("./src/authControllerLogin/authController"));
const cors_1 = __importDefault(require("cors"));
const config_1 = __importDefault(require("./src/core/config"));
const app = (0, express_1.default)();
const port = 3000;
app.use(express_1.default.json());
const { PORT, DB_URL } = config_1.default;
mongoose_1.default
    .connect(DB_URL)
    .then(() => {
    console.log("Conexión exitosa a la base de datos");
})
    .catch((err) => console.log("Error de conexión a la base de datos: " + err));
app.use((0, cors_1.default)());
app.use("/users", routers_1.default);
// app.use("/TattoArtists", tattoArtistsRouter);
app.use("/auth", authController_1.default);
app.use("/appointments", appointmentsRouters_1.default);
app.listen(PORT, () => {
    console.log("Servidor levantado en " + PORT);
});
//# sourceMappingURL=app.js.map