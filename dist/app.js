"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const routers_1 = __importDefault(require("./src/entities/users/routers"));
const appointmentsRouters_1 = __importDefault(require("./src/entities/appoitmentsStudio/appointmentsRouters"));
const cors_1 = __importDefault(require("cors"));
const config_1 = __importDefault(require("./src/core/config"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
const { PORT, DB_URL } = config_1.default;
mongoose_1.default
    .connect(DB_URL)
    .then(() => {
    console.log("Successful database connection");
})
    .catch((err) => console.log("Database connection error: " + err));
app.use((0, cors_1.default)());
app.use("/users", routers_1.default);
app.use("/auth", routers_1.default);
app.use("/appointments", appointmentsRouters_1.default);
app.listen(PORT, () => {
    console.log("Server is up and running on " + PORT);
});
//# sourceMappingURL=app.js.map