import express from "express";

import { renderArticle, renderArticleIndex, renderArticleCreate } from "../controller/renderController.js";

const router = express.Router();

router.get('/', renderArticleIndex);
router.get('/article', renderArticleIndex);
router.get('/article/:slug', renderArticle);
router.get('/create', renderArticleCreate);

export default router;
