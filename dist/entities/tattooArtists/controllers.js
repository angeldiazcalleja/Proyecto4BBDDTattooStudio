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
exports.deleteArtist = exports.modifyArtist = exports.findArtists = exports.findArtist = exports.saveArtists = void 0;
const model_1 = require("./model");
const saveArtists = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, surname } = req.body;
        if (!name || !surname) {
            return res
                .status(400)
                .json({ error: "Nombre y apellido son campos obligatorios" });
        }
        const newArtist = new model_1.TattooArtistsExtendedModel({
            name,
            surname,
            id: Date.now(),
        });
        const result = yield newArtist.save();
        return res.status(418).json(result);
    }
    catch (error) {
        return res
            .status(500)
            .json({ error: "Error al guardar el Jedi en la base de datos" });
    }
});
exports.saveArtists = saveArtists;
const findArtist = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { sort, search } = req.query;
    const sortOption = sort === "ASC" ? 1 : sort === "DSC" ? -1 : undefined;
    const searchRegex = typeof search === "string" ? new RegExp(search, "i") : undefined;
    const query = model_1.TattooArtistsExtendedModel.find();
    if (sortOption) {
        query.sort({ name: sortOption });
    }
    if (searchRegex) {
        query.where("name").regex(searchRegex);
    }
    try {
        const artists = yield query.exec();
        return res.json(artists);
    }
    catch (error) {
        return res
            .status(500)
            .json({ error: "Error al buscar Jedi en la base de datos" });
    }
});
exports.findArtist = findArtist;
const findArtists = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const artistFound = yield model_1.TattooArtistsExtendedModel.findOne({
            id: parseInt(id),
        });
        if (artistFound) {
            return res.json(artistFound);
        }
        else {
            return res.status(404).json({ error: "Jedi no encontrado" });
        }
    }
    catch (error) {
        return res
            .status(500)
            .json({ error: "Error al buscar Jedi en la base de datos" });
    }
});
exports.findArtists = findArtists;
const modifyArtist = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { name, surname } = req.body;
    try {
        const artist = yield model_1.TattooArtistsExtendedModel.findOne({
            id: parseInt(id),
        });
        if (artist) {
            artist.name = name;
            artist.surname = surname;
            const result = yield artist.save();
            return res.json(result);
        }
        else {
            return res.status(404).json({ error: "Jedi no encontrado" });
        }
    }
    catch (error) {
        return res
            .status(500)
            .json({ error: "Error al modificar Jedi en la base de datos" });
    }
});
exports.modifyArtist = modifyArtist;
const deleteArtist = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const result = yield model_1.TattooArtistsExtendedModel.deleteOne({
            id: parseInt(id),
        });
        if (result.deletedCount === 1) {
            return res.json({ message: "Jedi eliminado correctamente" });
        }
        else {
            return res.status(404).json({ error: "Jedi no encontrado" });
        }
    }
    catch (error) {
        return res
            .status(500)
            .json({ error: "Error al eliminar Jedi en la base de datos" });
    }
});
exports.deleteArtist = deleteArtist;
//# sourceMappingURL=controllers.js.map