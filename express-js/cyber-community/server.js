import express from "express";
import rootRouter from "./src/routers/root.router.js";
import cors from "cors";

const app = express();

app.use(express.json())
app.use(
    cors({
        origin: ["http://localhost:3000", "https://www.google.com"],
    })
);

app.use("/api", rootRouter);

const port = 3069;
app.listen(port, () => {
    console.log(`🤷 Server online at: ${port}`);
});

// prisma sẽ vô db lấy thông tin cấu trúc của các table và tạo ra schema(model) bên trong code
// npx prisma db pull

// tạo ra object(prisma-client) để chấm ra tất cả table và sử dụng lấy dữ liệu
// npx prisma generate
