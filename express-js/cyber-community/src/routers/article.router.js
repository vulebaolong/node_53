import express from 'express'

const articleRouter = express.Router()

// http://localhost:3069/api/article/get-list-article
articleRouter.get("/get-list-article", (req, res, next) => {

    // logic
    const message = "Hello Cyber 123"

    res.status(201).json({
        message: message
    })
});

export default articleRouter