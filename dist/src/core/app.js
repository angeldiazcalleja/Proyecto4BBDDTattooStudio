"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const routers_1 = __importDefault(require("../../entities/users/routers"));
const routers_2 = __importDefault(require("../../entities/tattooArtists/routers"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const port = 3000;
app.use(express_1.default.json());
mongoose_1.default
    .connect("mongodb://127.0.0.1:27017/jedi", {})
    .then(() => {
    console.log("Conexión exitosa a la base de datos");
})
    .catch((err) => console.log("Error de conexión a la base de datos: " + err));
app.listen(port, () => {
    console.log("Servidor levantado en " + port);
});
app.use((0, cors_1.default)());
app.use("/users", routers_1.default);
app.use("/TattoArtists", routers_2.default);
//# sourceMappingURL=app.js.map