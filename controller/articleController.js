import constants from "../config/constants.js";
import {
  syncTagsForArticle,
  attachTagsToArticle
} from "../service/articleTagService.js";

import {
  getArticles,
  getArticleBySlug,
  createArticle,
  updateArticleById,
  deleteArticleById,
  getArticleById,
} from "../service/articleService.js";
import { z } from "zod";

const ArticleSchema = z.object({
  date: z.string().refine((s) => {
    const d = new Date(s);
    return !Number.isNaN(d.valueOf());
  }, { message: 'Invalid ISO datetime' }),
  slug: z.string().min(1),
  title: z.string().min(1),
  content: z.string().min(1)
});

export async function fetchArticles(req, res) {
  const tagName = req.query.tag;
  try {
    const articles = await getArticles(tagName);
    return res.status(200).json(articles);
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Failed to fetch articles' });
  }
}

export async function fetchArticleBySlug(req, res) {
  const { slug } = req.params;
  try {
    const article = await getArticleBySlug(slug);
    if (article.length == 0) {
      return res.status(404).json({ error: "Article not found" });
    }
    return res.status(200).json(article);
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Failed to fetch article' });
  }
}

export async function addArticle(req, res) {
  const providedPassword = req.headers['x-admin-password'];

  if (!providedPassword || providedPassword !== process.env.CREATE_PSW) {
    return res.status(401).json({ error: 'Invalid or missing password' });
  }

  const parse = ArticleSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ error: parse.error.issues });
  }

  let { tags } = req.body;

  if (tags) {
    if (!Array.isArray(tags)) {
      return res.status(400).json({
        error: 'tags must be an array'
      });
    }

    if (tags.length > constants.MAX_TAGS) {
      return res.status(400).json({
        error: `maximum ${constants.MAX_TAGS} tags allowed`
      });
    }

    tags = Array.from(new Set(tags.map(t => t.trim())));

    for (const tag of tags) {
      if (typeof tag !== 'string') {
        return res.status(400).json({
          error: 'all tags must be strings'
        });
      }

      if (tag.length > constants.MAX_TAG_LENGTH) {
        return res.status(400).json({
          error: `tag "${tag}" is too long`
        });
      }
    }
  }

  try {
    const articleData = parse.data;
    const create_result = await createArticle(articleData);
    if (!create_result.success) {
      return res.status(create_result.status).json({ error: create_result.message });
    }
    if (tags && tags.length) {
      const result = await attachTagsToArticle(create_result.data[0].id, tags);
      if(!result.success) {
        return res.status(500).json({ error: result.message || 'Failed to attach tags' });
      }
    }
    return res.status(201).json(create_result.data[0]);
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Failed to create article' });
  }
}

export async function modifyArticleById(req, res) {
  const parse = ArticleSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ error: parse.error.issues });
  }

  const articleData = parse.data;

  const { tags } = req.body;

  if (tags) {
    if (!Array.isArray(tags)) {
      return res.status(400).json({
        error: 'tags must be an array'
      });
    }

    if (tags.length > constants.MAX_TAGS) {
      return res.status(400).json({
        error: `maximum ${constants.MAX_TAGS} tags allowed`
      });
    }

    for (const tag of tags) {
      if (typeof tag !== 'string') {
        return res.status(400).json({
          error: 'all tags must be strings'
        });
      }

      if (tag.length > constants.MAX_TAG_LENGTH) {
        return res.status(400).json({
          error: `tag "${tag}" is too long`
        });
      }
    }
  }

  const id = Number(req.params.id);

  try {
    const article = await getArticleById(id);
    if(article.length == 0) {
      return res.status(404).json({ error: 'Article not found' });
    }

    const result = await syncTagsForArticle(id, tags);
    if(!result.success) {
      return res.status(500).json({ error: result.message || 'Failed to attach tags' });
    }

    const { error } = await updateArticleById(id, articleData);
    if (error) {
      if (error.code === '23505') {
        return res.status(409).json({ error: 'Slug already exists' });
      }
      return res.status(500).json({ error: error.message || error });
    }

    // 404 already verified
    /*
    if (!data || data.length === 0) {
      return res.status(404).json({ error: "Article not found" });
    }
    */
    return res.status(200).json({ success: true, message: "Article modified successfully" });
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Failed to modify article' });
  }
}

export async function removeArticleById(req, res) {
  const { id } = req.params;
  
  const result = await syncTagsForArticle(id, []);
  if(!result.success) {
    return res.status(500).json({ error: result.message || 'Failed to attach tags' });
  }

  try {
    const { success, message } = await deleteArticleById(id);
    return res.status(200).json({success, message: message || "Article deleted successfully"});
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Failed to delete article' });
  }
}
