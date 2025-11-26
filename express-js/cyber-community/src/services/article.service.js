import Article from "../models/article.model.js";

// DATABSSE FIRST: tạo db đầu tiền =>  code

export const articleService = {
    async findAll() {
        const result = await Article.findAll();
        return result;
    },
};
