import express from "express";
import { authController } from "../controllers/auth.controller.js";
import { protect } from "../common/middleware/protect.middleware.js";
import passport from "passport";

const authRouter = express.Router();

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Đăng ký tài khoản mới
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *               name:
 *                 type: string
 *                 example: Nguyễn Văn A
 *     responses:
 *       200:
 *         description: Đăng ký thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Lỗi validation hoặc email đã tồn tại
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
authRouter.post("/register", authController.register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Đăng nhập vào hệ thống
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: Đăng nhập thành công, trả về access token và refresh token
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         accessToken:
 *                           type: string
 *                           example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                         refreshToken:
 *                           type: string
 *                           example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       401:
 *         description: Email hoặc mật khẩu không chính xác
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
authRouter.post("/login", authController.login);

/**
 * @swagger
 * /auth/get-info:
 *   get:
 *     summary: Lấy thông tin người dùng hiện tại
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lấy thông tin thành công
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/User'
 *       401:
 *         description: Chưa đăng nhập hoặc token không hợp lệ
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
authRouter.get("/get-info", protect, authController.getInfo);

/**
 * @swagger
 * /auth/google:
 *   get:
 *     summary: Đăng nhập bằng Google OAuth
 *     tags: [Auth]
 *     description: Redirect người dùng đến trang đăng nhập Google
 *     responses:
 *       302:
 *         description: Redirect đến Google OAuth
 */
// người dùng click button google
// kích hoạt logic của passport, để pasport xử lý với google, cùng với yêu cầu tôi muốn lấy email, và profile của người dùng
// sau khi passport làm việc với google xong, passport sẽ tự redirect người dùng tới trang đăng nhập google
authRouter.get("/google", passport.authenticate("google", { scope: ["email", "profile"] }));

/**
 * @swagger
 * /auth/google-callback:
 *   get:
 *     summary: Callback từ Google OAuth
 *     tags: [Auth]
 *     description: Xử lý callback sau khi người dùng đăng nhập Google thành công
 *     responses:
 *       302:
 *         description: Redirect về frontend với token
 */
// Sau khi người dùng chọn tài khoản gmail và đồng ý với bên google
// Passport sẽ lấy code và xử lý với bên google => lấy thông tin gmail => kích hoạt hàm verify ở trong src/common/passport/login-google.passport.js
authRouter.get("/google-callback", passport.authenticate("google", { failureRedirect: "/login", session: false }), authController.googleCallback);

/**
 * @swagger
 * /auth/refresh-token:
 *   post:
 *     summary: Làm mới access token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *     responses:
 *       200:
 *         description: Làm mới token thành công
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         accessToken:
 *                           type: string
 *       401:
 *         description: Refresh token không hợp lệ hoặc đã hết hạn
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
authRouter.post("/refresh-token", authController.refreshToken)

// Tạo route CRUD
// authRouter.post("/", authController.create);
// authRouter.get("/", authController.findAll);
// authRouter.get("/:id", authController.findOne);
// authRouter.patch("/:id", authController.update);
// authRouter.delete("/:id", authController.remove);

export default authRouter;
