import express from "express";
import mongoose from "mongoose";
import userRouter from "./src/entities/users/routers";
import appointmentRouter from "./src/entities/appoitmentsStudio/appointmentsRouters";
import cors from "cors";
import CONF from "./src/core/config";

const app = express();

app.use(express.json());
const { PORT, DB_URL } = CONF;

mongoose
  .connect(DB_URL)
  .then(() => {
    console.log("Successful database connection");
  })
  .catch((err) => console.log("Database connection error: " + err));

  app.use(cors());
  app.use("/users", userRouter);
  app.use("/auth", userRouter);
  app.use("/appointments", appointmentRouter)
  
app.listen(PORT, () => {
  console.log("Server is up and running on " + PORT);
});