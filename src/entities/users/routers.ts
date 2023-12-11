import express, { Request, Response } from "express";
import * as UserController from "./controllers";
import { authMiddleware } from "../../middleware/authMiddleware";

const router = express.Router();


router.post("/login", async (req: Request, res: Response) => {
    try {
      await UserController.login(req, res);
    } catch (error) {
      res.status(500).json({
        message: "Internal Server Error",
      });
    }
  });

// router.post("/", async (req: Request, res: Response) => {
//   try {
//     await UserController.register(req, res);
//   } catch (error) {
//     res.status(500).json({
//       message: "Internal Server Error",
//     });
//   }
// });
router.post("/", async (req: Request, res: Response) => {
  try {
    await UserController.register(req, res);
  } catch (error) {
    console.error("Error in UserController.register:", error);
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,  // Devuelve el mensaje de error específico si está disponible
    });
  }
});


router.get("/", authMiddleware, async (req: Request, res: Response) => {
  try {
    await UserController.findUsers(req, res);
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

router.get("/:_id", authMiddleware, async (req: Request, res: Response) => {
  try {
    await UserController.findCustomer(req, res);
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

router.put("/:_id", authMiddleware, async (req: Request, res: Response) => {
  try {
    await UserController.modifyUser(req, res);
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

router.delete("/:_id", authMiddleware, async (req: Request, res: Response) => {
  try {
    await UserController.deleteUser(req, res);
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

export default router;
