
import express from "express";
import rootRouter from "./src/routers/root.router.js";
import cors from "cors";
import { appErorr } from "./src/common/helpers/handle-error.helper.js";
import { NotFoundException } from "./src/common/helpers/exception.helper.js";
import { initGoogleStrategy } from "./src/common/passport/login-google.passport.js";
import { createServer } from "http";
import { initSocket } from "./src/common/socket/init.socket.js";
import { setupSwagger } from "./src/common/swagger/swagger.config.js";
// Import hàm setupGraphQL để setup GraphQL endpoint
// setupGraphQL: Hàm tạo endpoint /graphql và setup GraphiQL UI
import { setupGraphQL } from "./src/graphql/graphql.config.js";

const app = express();

// IMPORTANT: né thiết lập root static là dấu chấm
// vì sẽ bị lộ tất cả mọi thứ (srouce code) nếu bot của hacker gọi
app.use(express.static("./public"));

// parser json để body có dữ liệu
app.use(express.json());
app.use(
    cors({
        origin: ["http://localhost:3000", "https://www.google.com"],
    })
);

initGoogleStrategy();

// Setup Swagger UI - Phải đặt trước các routes khác
setupSwagger(app);

// Setup GraphQL endpoint - Phải đặt trước các routes khác
// setupGraphQL(app): Tạo endpoint /graphql và setup GraphiQL UI
// Phải đặt trước các routes khác để không bị conflict
setupGraphQL(app);

app.use("/api", rootRouter);

// Middleware xử lý các route không tìm thấy (404)
app.use((req, res, next) => {
    const method = req.method;
    const url = req.originalUrl;
    const ip = req.ip;
    
    // Bỏ qua các request không quan trọng (favicon, robots.txt, etc.)
    // Browser tự động request favicon.ico khi truy cập trang web
    // Không cần throw error cho những request này
    if (url === '/favicon.ico' || url === '/robots.txt') {
        return res.status(404).end(); // Trả về 404 một cách im lặng
    }
    
    // Log các request khác để debug
    console.log(`${method} ${url} ${ip}`);
    
    // Throw NotFoundException cho các route không tồn tại
    throw new NotFoundException();
});
app.use(appErorr);

const httpServer = createServer(app);
initSocket(httpServer)

const port = 3069;
httpServer.listen(port, () => {
    console.log(`🤷 Server online at: ${port}`);
});

// prisma sẽ vô db lấy thông tin cấu trúc của các table và tạo ra schema(model) bên trong code
// npx prisma db pull

// tạo ra object(prisma-client) để chấm ra tất cả table và sử dụng lấy dữ liệu
// npx prisma generate
