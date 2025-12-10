import { BadRequestException } from "../common/helpers/exception.helper.js";
import { prisma } from "../common/prisma/conntect.prisma.js";
import bcrypt from "bcrypt";
import jsonwebtoken from "jsonwebtoken";
import { tokenSerivce } from "./token.service.js";

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

        // HASH - băm password
        // password, pin, key bí mật
        // mã hoá 1 chiều: KHÔNG DỊCH NGƯỢC ĐƯỢC, chỉ được so sánh
        // brute force
        // "1234" => băm => so sánh
        // "1235" => băm => so sánh (1 tiếng)
        // "admin123" => (1 ngày)
        // 16 ký tự random có ký tự lạ: vũ trụ sập
        // bcrypt băm passs chỉ sử dụng CPU, không dùng GPU
        const hashPassword = bcrypt.hashSync(password, 10);

        // email này chưa tồn tại => tạo người dùng mới
        const userNew = await prisma.users.create({
            data: {
                email: email,
                password: hashPassword,
                fullName: fulName,
            },
        });

        console.log({ email, password });

        return true;
    },

    async login(req) {
        const { email, password } = req.body;

        // Kiểm tra email người dùng có tồn tại trong db hay không
        // nếu mà tồn tại => đi tiếp
        // nếu mà chưa tồn => trả lỗi (Xin vui lòng đăng ký trước khi đăng nhập)
        const userExits = await prisma.users.findUnique({
            where: {
                email: email,
            },
        });
        if (!userExits) {
            throw new BadRequestException("Xin vui lòng đăng ký trước khi đăng nhập");
            // throw new BadRequestException("Account Invalid")
        }

        // kiểm tra password
        const isPassword = bcrypt.compareSync(password, userExits.password);
        if (!isPassword) {
            throw new BadRequestException("Mật khẩu chưa chính xác");
            // throw new BadRequestException("Account Invalid")
        }

        // Encrypt: MÃ HOÁ
        // mã hoá 2 chiều: CÓ THỂ DỊCH NGƯỢC

        const tokens = tokenSerivce.createTokens(userExits.id);

        console.log({ email, password, userExits });

        return tokens;
    },

    async getInfo(req) {

        delete req.user.password
        
        return req.user;
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
