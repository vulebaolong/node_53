import express from "express";
import { articleController } from "../controllers/article.controller.js";

const articleRouter = express.Router();

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

articleRouter.post("/", articleController.create);
articleRouter.put("/:id", articleController.update);
articleRouter.delete("/:id", articleController.delete);
articleRouter.get("/:id", articleController.findOne);

export default articleRouter;
