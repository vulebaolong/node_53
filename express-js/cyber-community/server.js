import express from "express";
import rootRouter from "./src/routers/root.router.js";
import cors from "cors";
import { appErorr } from "./src/common/helpers/handle-error.helper.js";
import { NotFoundException } from "./src/common/helpers/exception.helper.js";
import { initGoogleStrategy } from "./src/common/passport/login-google.passport.js";

const app = express();

// IMPORTANT: né thiết lập root static là dấu chấm
// vì sẽ bị lộ tất cả mọi thứ (srouce code) nếu bot của hacker gọi
app.use(express.static("./public"))

// parser json để body có dữ liệu
app.use(express.json());
app.use(
    cors({
        origin: ["http://localhost:3000", "https://www.google.com"],
    })
);

initGoogleStrategy()

app.use("/api", rootRouter);
app.use((req, res, next) => {
    const method = req.method;
    const url = req.originalUrl;
    const ip = req.ip;
    console.log(`${method} ${url} ${ip}`);

    throw new NotFoundException();
});
app.use(appErorr);

const port = 3069;
app.listen(port, () => {
    console.log(`🤷 Server online at: ${port}`);
});

// prisma sẽ vô db lấy thông tin cấu trúc của các table và tạo ra schema(model) bên trong code
// npx prisma db pull

// tạo ra object(prisma-client) để chấm ra tất cả table và sử dụng lấy dữ liệu
// npx prisma generate
