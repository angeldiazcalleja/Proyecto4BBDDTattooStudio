import express from "express";
import * as tattooArtistsController from "./controllers";

const router = express.Router();

router.post("/", tattooArtistsController.saveArtists);
router.get("/", tattooArtistsController.findArtist);
router.get("/:id", tattooArtistsController.findArtists);
router.put("/:id", tattooArtistsController.modifyArtist);
router.delete("/:id", tattooArtistsController.deleteArtist);

export default router;