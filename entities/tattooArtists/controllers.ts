import { Request, Response } from "express";
import { TattooArtistsExtendedModel } from "./model";
import {
  handleBadRequest,
  handleNotFound,
  handleServerError,
} from "../../core/errorHandlers";

export const saveArtists = async (req: Request, res: Response) => {
  try {
    const { name, surname } = req.body;

    if (!name || !surname) {
      return res
        .status(400)
        .json({ error: "Nombre y apellido son campos obligatorios" });
    }

    const newArtist = new TattooArtistsExtendedModel({
      name,
      surname,
      id: Date.now(),
    });

    const result = await newArtist.save();

    return res.status(418).json(result);
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Error al guardar el Jedi en la base de datos" });
  }
};

export const findArtist = async (req: Request, res: Response) => {
  const { sort, search } = req.query;
  const sortOption = sort === "ASC" ? 1 : sort === "DSC" ? -1 : undefined;
  const searchRegex =
    typeof search === "string" ? new RegExp(search, "i") : undefined;

  const query = TattooArtistsExtendedModel.find();

  if (sortOption) {
    query.sort({ name: sortOption });
  }

  if (searchRegex) {
    query.where("name").regex(searchRegex);
  }

  try {
    const artists = await query.exec();
    return res.json(artists);
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Error al buscar Jedi en la base de datos" });
  }
};

export const findArtists = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const artistFound = await TattooArtistsExtendedModel.findOne({
      id: parseInt(id),
    });

    if (artistFound) {
      return res.json(artistFound);
    } else {
      return res.status(404).json({ error: "Jedi no encontrado" });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Error al buscar Jedi en la base de datos" });
  }
};

export const modifyArtist = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, surname } = req.body;

  try {
    const artist = await TattooArtistsExtendedModel.findOne({
      id: parseInt(id),
    });

    if (artist) {
      artist.name = name;
      artist.surname = surname;

      const result = await artist.save();

      return res.json(result);
    } else {
      return res.status(404).json({ error: "Jedi no encontrado" });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Error al modificar Jedi en la base de datos" });
  }
};

export const deleteArtist = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const result = await TattooArtistsExtendedModel.deleteOne({
      id: parseInt(id),
    });

    if (result.deletedCount === 1) {
      return res.json({ message: "Jedi eliminado correctamente" });
    } else {
      return res.status(404).json({ error: "Jedi no encontrado" });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Error al eliminar Jedi en la base de datos" });
  }
};
