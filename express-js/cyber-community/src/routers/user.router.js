import express from "express";
import { uploadDiskStorage } from "../common/multer/disk-storage.multer.js";
import { userController } from "../controllers/user.controller.js";

const userRouter = express.Router();

userRouter.post("/avatar-local", uploadDiskStorage.single("avatar"), userController.avatarLocal);
userRouter.post("/avatar-cloud", userController.avatarCloud);

// Tạo route CRUD
userRouter.post("/", userController.create);
userRouter.get("/", userController.findAll);
userRouter.get("/:id", userController.findOne);
userRouter.patch("/:id", userController.update);
userRouter.delete("/:id", userController.remove);

export default userRouter;
