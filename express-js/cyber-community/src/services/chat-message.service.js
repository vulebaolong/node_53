import { buildQueryPrisma } from "../common/helpers/build-query-prisma.helper.js";
import { prisma } from "../common/prisma/conntect.prisma.js";

export const chatMessageService = {
    async create(req) {
        return `This action create`;
    },

    async findAll(req) {
        const { page, pageSize, where, index } = buildQueryPrisma(req.query);

        // prisma
        const resultPrismaPromise = prisma.chatMessages.findMany({
            where: where,
            skip: index, // skip tới vị trí index nào (OFFSET)
            take: pageSize, // take lấy bao nhiêu phần tử (LIMIT)
            orderBy: {
               createdAt: "desc"
            }
        });

        const totalItemPromise = prisma.chatMessages.count({
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

    async findOne(req) {
        return `This action returns a id: ${req.params.id} chatMessage`;
    },

    async update(req) {
        return `This action updates a id: ${req.params.id} chatMessage`;
    },

    async remove(req) {
        return `This action removes a id: ${req.params.id} chatMessage`;
    },
};
