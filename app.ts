import express from "express";
import mongoose from "mongoose";
import userRouter from "./src/entities/users/routers";
import appointmentRouter from "./src/entities/appoitmentsStudio/appointmentsRouters";

// import tattoArtistsRouter from "./entities/tattooArtists/routers";
import router from "./src/authControllerLogin/authController";
import cors from "cors";
import CONF from "./src/core/config";

const app = express();
const port = 3000;

app.use(express.json());
const { PORT, DB_URL } = CONF;

mongoose
  .connect(DB_URL)
  .then(() => {
    console.log("Conexión exitosa a la base de datos");
  })
  .catch((err) => console.log("Error de conexión a la base de datos: " + err));


  app.use(cors());
  app.use("/users", userRouter);
  // app.use("/TattoArtists", tattoArtistsRouter);
  app.use("/auth", router);
  app.use("/appointments", appointmentRouter)
  

app.listen(PORT, () => {
  console.log("Servidor levantado en " + PORT);
});
