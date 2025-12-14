import express from "express";
import { authController } from "../controllers/auth.controller.js";
import { protect } from "../common/middleware/protect.middleware.js";
import passport from "passport";

const authRouter = express.Router();

// authRouter.use(protect)
authRouter.post("/register", authController.register);
authRouter.post("/login", authController.login);
authRouter.get("/get-info", protect, authController.getInfo);

// người dùng click button google
// kích hoạt logic của passport, để pasport xử lý với google, cùng với yêu cầu tôi muốn lấy email, và profile của người dùng
// sau khi passport làm việc với google xong, passport sẽ tự redirect người dùng tới trang đăng nhập google
authRouter.get("/google", passport.authenticate("google", { scope: ["email", "profile"] }))

authRouter.get("/google-callback", (req, res) => { res.json("hello zui zui") })

// Tạo route CRUD
// authRouter.post("/", authController.create);
// authRouter.get("/", authController.findAll);
// authRouter.get("/:id", authController.findOne);
// authRouter.patch("/:id", authController.update);
// authRouter.delete("/:id", authController.remove);

export default authRouter;
