"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const main_1 = require("./main");
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
router.post("/", (req, res) => {
    res.json(main_1.ordenJedi.guardarAlumnoJedi(req.body.nombre, req.body.apellido));
});
router.get("/", (req, res) => {
    var _a, _b;
    const sort = (_a = req.query.sort) === null || _a === void 0 ? void 0 : _a.toString();
    const search = (_b = req.query.search) === null || _b === void 0 ? void 0 : _b.toString();
    const jedis = main_1.ordenJedi.mostrarAlumnosJedi(sort, search);
    res.json(jedis);
});
router.get("/:id", (req, res) => {
    const jediEncontrado = main_1.ordenJedi.buscarAlumnoJedi(parseInt(req.params.id));
    if (jediEncontrado) {
        res.json(jediEncontrado);
    }
    else {
        res.status(404).json({ error: "Jedi no encontrado" });
    }
});
router.delete("/:id", (req, res) => {
    res.json(main_1.ordenJedi.borrarAlumnoJedi(parseInt(req.params.id)));
});
router.put("/:id", (req, res) => {
    res.json(main_1.ordenJedi.modificarAlumnoJedi(parseInt(req.params.id), req.body.nombre, req.body.apellido));
});
exports.default = router;
//# sourceMappingURL=index.js.map