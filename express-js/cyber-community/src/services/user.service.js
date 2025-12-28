import fs from "fs";
import path from "path";
import cloudinary from "../common/cloudinary/init.cloudinary.js";
import { FOLDER_IMAGE } from "../common/constant/app.constant.js";
import { BadRequestException } from "../common/helpers/exception.helper.js";
import { prisma } from "../common/prisma/conntect.prisma.js";
import { buildQueryPrisma } from "../common/helpers/build-query-prisma.helper.js";

export const userService = {
    async avatarLocal(req) {
        // req.file is the `avatar` file
        // req.body will hold the text fields, if there were any
        console.log("file", req.file);
        console.log("body", req.body);
        if (!req.file) {
            throw new BadRequestException("Không có file");
        }

        await prisma.users.update({
            where: {
                id: req.user.id,
            },
            data: {
                avatar: req.file.filename,
            },
        });

        //   đảm bảo 1 user - 1 avatar
        if (req.user.avatar) {
            // cloud
            cloudinary.uploader.destroy(req.user.avatar);

            // XOÁ LOCAL
            // hàm join trong thư viện path sẽ cover mọi hệ điều hành
            // window: \\
            // macOs: //
            const oldPath = path.join(FOLDER_IMAGE, req.user.avatar);
            if (fs.existsSync(oldPath)) {
                fs.unlinkSync(oldPath);
            }
        }

        return true;
    },

    async avatarCloud(req) {
        // NHỚ CHỈNH SỬA FILE .env bên FE, tên CLOUDINARY_NAME của các banj
        // từ: NEXT_PUBLIC_BASE_DOMAIN_CLOUDINARY=https://res.cloudinary.com/vulebaolong/image/upload/
        // sang: NEXT_PUBLIC_BASE_DOMAIN_CLOUDINARY=https://res.cloudinary.com/***********/image/upload/

        // req.file is the `avatar` file
        // req.body will hold the text fields, if there were any
        console.log("file", req.file);
        console.log("body", req.body);
        if (!req.file) {
            throw new BadRequestException("Không có file");
        }

        const uploadResult = await new Promise((resolve, reject) => {
            cloudinary.uploader
                .upload_stream(
                    {
                        folder: FOLDER_IMAGE,
                    },
                    (error, uploadResult) => {
                        if (error) {
                            return reject(error);
                        }
                        return resolve(uploadResult);
                    }
                )
                .end(req.file.buffer);
        });

        console.log(uploadResult);
        await prisma.users.update({
            where: {
                id: req.user.id,
            },
            data: {
                avatar: uploadResult.public_id,
            },
        });

        //   đảm bảo 1 user - 1 avatar
        if (req.user.avatar) {
            // cloud
            cloudinary.uploader.destroy(req.user.avatar);

            // XOÁ LOCAL
            // hàm join trong thư viện path sẽ cover mọi hệ điều hành
            // window: \\
            // macOs: //
            const oldPath = path.join(FOLDER_IMAGE, req.user.avatar);
            if (fs.existsSync(oldPath)) {
                fs.unlinkSync(oldPath);
            }
        }

        return true;
    },

    async create(req) {
        return `This action create`;
    },

    async findAll(req) {
        // console.log("service findAll", req.payload);
        const { page, pageSize, where, index } = buildQueryPrisma(req.query);

        // prisma
        const resultPrismaPromise = prisma.users.findMany({
            where: where,
            skip: index, // skip tới vị trí index nào (OFFSET)
            take: pageSize, // take lấy bao nhiêu phần tử (LIMIT)
        });

        const totalItemPromise = prisma.users.count({
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
      const user = await  prisma.users.findUnique({
            where: {
                id: +req.params.id
            }
        })
        return user
    },

    async update(req) {
        return `This action updates a id: ${req.params.id} user`;
    },

    async remove(req) {
        return `This action removes a id: ${req.params.id} user`;
    },
};
