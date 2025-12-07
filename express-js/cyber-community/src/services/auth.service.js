import { BadRequestException } from "../common/helpers/exception.helper.js";
import { prisma } from "../common/prisma/conntect.prisma.js";

export const authService = {
    async register(req) {
        const { email, password, fulName } = req.body;

        // kiểm tra người dùng có hay chưa, nếu đã tồn tại thì không cho đăng ký
        const userExist = await prisma.users.findUnique({
            where: {
                email: email,
            },
        });

        // nếu người dùng đã tồn tại thì trả lỗi 400 => không cho đăng ký
        if (userExist) {
            throw new BadRequestException("Người dùng đã tồn tại, vui lòng đăng nhập");
        }

        // email này chưa tồn tại => tạo người dùng mới
        const userNew = await prisma.users.create({
            data: {
                email: email,
                password: password,
                fullName: fulName
            },
        });

        console.log({ email, password });

        return true;
    },

    async login(req) {
        return `This action login`;
    },

    async create(req) {
        return `This action create`;
    },

    async findAll(req) {
        return `This action returns all auth`;
    },

    async findOne(req) {
        return `This action returns a id: ${req.params.id} auth`;
    },

    async update(req) {
        return `This action updates a id: ${req.params.id} auth`;
    },

    async remove(req) {
        return `This action removes a id: ${req.params.id} auth`;
    },
};
