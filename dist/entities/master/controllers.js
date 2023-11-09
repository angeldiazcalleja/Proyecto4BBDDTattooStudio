"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.borrarAlumnoJedi = exports.modificarAlumnoJedi = exports.buscarAlumnoJedi = exports.mostrarAlumnosJedi = exports.guardarAlumnoJedi = void 0;
const model_1 = require("./model");
const guardarAlumnoJedi = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { nombre, apellido } = req.body;
        if (!nombre || !apellido) {
            return res.status(400).json({ error: "Nombre y apellido son campos obligatorios" });
        }
        const nuevoJedi = new model_1.JediExtendidoModel({
            nombre,
            apellido,
            id: Date.now(),
        });
        const result = yield nuevoJedi.save();
        return res.status(418).json(result);
    }
    catch (error) {
        return res.status(500).json({ error: "Error al guardar el Jedi en la base de datos" });
    }
});
exports.guardarAlumnoJedi = guardarAlumnoJedi;
const mostrarAlumnosJedi = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { sort, search } = req.query;
    const sortOption = sort === "ASC" ? 1 : sort === "DSC" ? -1 : undefined;
    const searchRegex = typeof search === "string" ? new RegExp(search, "i") : undefined;
    const query = model_1.JediExtendidoModel.find();
    if (sortOption) {
        query.sort({ nombre: sortOption });
    }
    if (searchRegex) {
        query.where("nombre").regex(searchRegex);
    }
    try {
        const jedis = yield query.exec();
        return res.json(jedis);
    }
    catch (error) {
        return res.status(500).json({ error: "Error al buscar Jedi en la base de datos" });
    }
});
exports.mostrarAlumnosJedi = mostrarAlumnosJedi;
const buscarAlumnoJedi = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const jediEncontrado = yield model_1.JediExtendidoModel.findOne({ id: parseInt(id) });
        if (jediEncontrado) {
            return res.json(jediEncontrado);
        }
        else {
            return res.status(404).json({ error: "Jedi no encontrado" });
        }
    }
    catch (error) {
        return res.status(500).json({ error: "Error al buscar Jedi en la base de datos" });
    }
});
exports.buscarAlumnoJedi = buscarAlumnoJedi;
const modificarAlumnoJedi = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { nombre, apellido } = req.body;
    try {
        const jedi = yield model_1.JediExtendidoModel.findOne({ id: parseInt(id) });
        if (jedi) {
            jedi.nombre = nombre;
            jedi.apellido = apellido;
            const result = yield jedi.save();
            return res.json(result);
        }
        else {
            return res.status(404).json({ error: "Jedi no encontrado" });
        }
    }
    catch (error) {
        return res.status(500).json({ error: "Error al modificar Jedi en la base de datos" });
    }
});
exports.modificarAlumnoJedi = modificarAlumnoJedi;
const borrarAlumnoJedi = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const result = yield model_1.JediExtendidoModel.deleteOne({ id: parseInt(id) });
        if (result.deletedCount === 1) {
            return res.json({ message: "Jedi eliminado correctamente" });
        }
        else {
            return res.status(404).json({ error: "Jedi no encontrado" });
        }
    }
    catch (error) {
        return res.status(500).json({ error: "Error al eliminar Jedi en la base de datos" });
    }
});
exports.borrarAlumnoJedi = borrarAlumnoJedi;
//# sourceMappingURL=controllers.js.map