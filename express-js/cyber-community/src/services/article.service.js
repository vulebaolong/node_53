import { buildQueryPrisma } from "../common/helpers/build-query-prisma.helper.js";
import { prisma } from "../common/prisma/conntect.prisma.js";
import Article from "../models/article.model.js";

// DATABSSE FIRST: tạo db đầu tiền =>  code

export const articleService = {
    /**
     * QUERY (LUÔN LUÔN DỮ LIỆU NHẬN LÀ STRING)
     * api lấy danh sách bài viết
     * FE sẽ gửi lên sữ liệu thông qua Quey
     * Cách nhận biết: bắt đầu từ đấu chấm hỏi "?", phân tách các biến với nhau bằng dấu "&"
     * Thường dùng: phân trang, lọc, tìm kiếm, ...
     *
     */
    async findAll(req) {
        const { page, pageSize, where, index } = buildQueryPrisma(req.query);

        // prisma
        const resultPrismaPromise = prisma.articles.findMany({
            where: where,
            skip: index, // skip tới vị trí index nào (OFFSET)
            take: pageSize, // take lấy bao nhiêu phần tử (LIMIT)
        });

        const totalItemPromise = prisma.articles.count({
            where: where,
        });

        const [resultPrisma, totalItem] = await Promise.all([resultPrismaPromise, totalItemPromise]);

        // sequelize
        // const resultSequelize = await Article.findAll();

        return {
            page: page,
            pageSize: pageSize,
            totalItem: totalItem,
            totalPage: Math.ceil(totalItem / pageSize),
            items: resultPrisma,
        };
    },

    /**
     * PATH PARAM  (LUÔN LUÔN DỮ LIỆU NHẬN LÀ STRING)
     * cách nhận biết: "/:id"
     * Thường dùng: lấy chi tiết (detail), 1 item
     */
    async findOne(req) {
        console.log("params:", req.params);
        const { id } = req.params;

        const article = await prisma.articles.findUnique({
            where: {
                id: +id,
                isDeleted: false,
            },
        });

        return article;
    },

    /**
     * HEADERS
     * Thường dùng: để gửi token (Bearer Token JWT), API-KEY, ....
     */
    async delete(req) {
        console.log("params:", req.params);
        const { id } = req.params;
        console.log("headers", req.headers);

        // Xoá thật trong DB< không nên dùng khi ĐI LÀM
        // await prisma.articles.delete({
        //     where: {
        //         id: +id
        //     }
        // })

        // Xoá mềm: không xoá thực bên trong db
        await prisma.articles.update({
            where: {
                id: +id,
            },
            data: {
                isDeleted: true,
            },
        });

        return true;
    },

    /**
     * Body
     * Thường dùng: FE gửi dữ liệu nhiều, tạo mới, xử lý .....
     */
    async create(req) {
        console.log("body", req.body);
        const { title, content } = req.body;

        const articleNew = await prisma.articles.create({
            data: {
                title: title,
                content: content,
                userId: 1,
            },
        });

        return articleNew;
    },

    async update(req) {
        const { id } = req.params;
        const { title, content, id: id1 } = req.body;

        const articleUpdate = await prisma.articles.update({
            where: {
                id: +id,
            },
            data: {
                content: content,
                title: title,
            },
        });

        return articleUpdate;
    },
};
