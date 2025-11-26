import { responseSuccess } from "../common/helpers/function.helper.js";
import { articleService } from "../services/article.service.js";

export const articleController = {
    async findAll(req, res, next) {
        const result = await articleService.findAll();
        const response = responseSuccess(result, "Get list article success");
        res.status(response.statusCode).json(response);
    },
};
