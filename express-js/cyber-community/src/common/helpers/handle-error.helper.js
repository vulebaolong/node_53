import { responseError } from "./function.helper.js";

/**
 * Để ở cuối để gom tất cả các lỗi có trong dự án
 */
export const appErorr = (err, req, res, next) => {
    console.log(`Middleware đặc biệt, bắt lỗi`, err);

    // undefinde: không tồn tại
    // null: có tồn tại nhưng bị rỗng
    const response = responseError(err?.message, err.code, err?.stack)

    res.status(response.statusCode).json(response);
};
