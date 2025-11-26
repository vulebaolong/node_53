import express from 'express'
import { articleController } from '../controllers/article.controller.js';

const articleRouter = express.Router()

// http://localhost:3069/api/article/get-list-article
articleRouter.get("/", articleController.findAll);




export default articleRouter