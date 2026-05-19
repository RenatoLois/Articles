import path from 'path';
import { fileURLToPath } from 'url';

const dirname = path.dirname(fileURLToPath(import.meta.url));

export async function renderArticleIndex(req, res) {
  res.sendFile(path.join(dirname, '../public/html', 'article-index.html'));
}

export async function renderArticle(req, res) {
  res.sendFile(path.join(dirname, '../public/html', 'article.html'));
}

export async function renderArticleCreate(req, res) {
  res.sendFile(path.join(dirname, '../public/html', 'article-create.html'));
}
