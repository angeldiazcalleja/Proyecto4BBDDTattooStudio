import mongoose, { Schema, Document } from "mongoose";
import {ulid} from 'ulid'


export interface tattooArtistsExtendedDocument extends Document {
  name: string;
  surname: string;
  id: number;
}

const TattooArtistsExtendedSchema = new Schema({
  _id: { type: String , default: ulid},
  name: String,
  surname: String,
  id: Number,
});

export const TattooArtistsExtendedModel = mongoose.model<tattooArtistsExtendedDocument>(
  "TattoArtists",
  TattooArtistsExtendedSchema
);

