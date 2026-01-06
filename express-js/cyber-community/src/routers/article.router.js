import express from "express";
import { articleController } from "../controllers/article.controller.js";

const articleRouter = express.Router();

/**
 * @swagger
 * /article:
 *   get:
 *     summary: Lấy danh sách tất cả bài viết
 *     tags: [Article]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Số trang
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Số lượng bài viết mỗi trang
 *     responses:
 *       200:
 *         description: Lấy danh sách bài viết thành công
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Article'
 */
// http://localhost:3069/api/article/get-list-article
articleRouter.get(
    "/",
    (req, res, next) => {
        // console.log(`mid 1`);

        const payload = {
            email: "@gmail.com",
            pass: "123",
        };

        req.payload = payload;
        res.payload = payload;

        // trạng thái thành công: next()
        // trạng thái thất bại: truyền tham số vào hàm next(err) | throw new Error()

        // Lỗi kiểm soát được
        // throw new BadRequestException("Mật khẩu không chính xác")

        // Lỗi không kiểm soát được
        // const abc = undefineda
        // console.log(abc.email);


        // route
        // router
        next();
    },
    (req, res, next) => {
        // console.log(`mid 2`);

        // console.log("payload req", req.payload);
        // console.log("payload res", res.payload);

        next();
    },
    (req, res, next) => {
        // console.log(`mid 3`);

        next();
    },
    articleController.findAll
);

/**
 * @swagger
 * /article:
 *   post:
 *     summary: Tạo bài viết mới
 *     tags: [Article]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *             properties:
 *               title:
 *                 type: string
 *                 example: Tiêu đề bài viết
 *               content:
 *                 type: string
 *                 example: Nội dung bài viết
 *     responses:
 *       200:
 *         description: Tạo bài viết thành công
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Article'
 *       400:
 *         description: Lỗi validation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
articleRouter.post("/", articleController.create);

/**
 * @swagger
 * /article/{id}:
 *   put:
 *     summary: Cập nhật bài viết
 *     tags: [Article]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của bài viết
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Tiêu đề mới
 *               content:
 *                 type: string
 *                 example: Nội dung mới
 *     responses:
 *       200:
 *         description: Cập nhật bài viết thành công
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Article'
 *       404:
 *         description: Không tìm thấy bài viết
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
articleRouter.put("/:id", articleController.update);

/**
 * @swagger
 * /article/{id}:
 *   delete:
 *     summary: Xóa bài viết
 *     tags: [Article]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của bài viết
 *     responses:
 *       200:
 *         description: Xóa bài viết thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       404:
 *         description: Không tìm thấy bài viết
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
articleRouter.delete("/:id", articleController.delete);

/**
 * @swagger
 * /article/{id}:
 *   get:
 *     summary: Lấy thông tin một bài viết
 *     tags: [Article]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của bài viết
 *     responses:
 *       200:
 *         description: Lấy thông tin bài viết thành công
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Article'
 *       404:
 *         description: Không tìm thấy bài viết
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
articleRouter.get("/:id", articleController.findOne);

export default articleRouter;
