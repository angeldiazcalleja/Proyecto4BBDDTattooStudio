import express from "express";
import mongoose from "mongoose";
import userRouter from "../entities/users/routers";
import tattoArtistsRouter from "../entities/tattooArtists/routers";
import cors from "cors";

const app = express();
const port = 3000;

app.use(express.json());

mongoose
  .connect("mongodb://127.0.0.1:27017/jedi", {})
  .then(() => {
    console.log("Conexión exitosa a la base de datos");
  })
  .catch((err) => console.log("Error de conexión a la base de datos: " + err));

app.listen(port, () => {
  console.log("Servidor levantado en " + port);
});

app.use(cors());
app.use("/users", userRouter);
app.use("/TattoArtists", tattoArtistsRouter);

