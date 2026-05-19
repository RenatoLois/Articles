import express from "express";
import {
  fetchArticles,
//  fetchArticleById
  fetchArticleBySlug,
  addArticle,
  modifyArticleById,
  removeArticleById
} from "../controller/articleController.js";

const router = express.Router();

/* 
nao descomentar update e delete até:
implementar check de password no delete
implementar check de password no update
*/

router.get('/article', fetchArticles);
router.get('/article/:slug', fetchArticleBySlug);
// router.get('/article/:id', fetchArticleById);
router.post('/article', addArticle);
// router.put('/article/:id', modifyArticleById);
// router.delete('/article/:id', removeArticleById);

export default router;
