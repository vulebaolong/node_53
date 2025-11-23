import express from "express";
import rootRouter from "./src/routers/root.router.js";


const app = express();

app.use("/api", rootRouter)




const port = 3069;
app.listen(port, () => {
    console.log(`🤷 Server online at: ${port}`);
});
