import constants from "../config/constants.js";
import {
  createTag,
  getTags,
//  getTagById,
  getTagByName
} from "../service/tagService.js";

export async function addTag(req, res) {
  const { name } = req.body;

  if (!name || typeof name !== "string") {
    return res.status(400).json({
      error: "Tag name is required and must be a string"
    });
  }

  if (name.length > constants.MAX_TAG_LENGTH) {
    return res.status(400).json({
      error: `Tag name too long (max ${constants.MAX_TAG_LENGTH} chars)`
    });
  }

  try {
    const result = await createTag({ name });
    if (!result.success) {
      return res.status(result.status).json({ error: result.message });
    }
    return res.status(201).json(result.data[0]);
  } catch (err) {
    return res.status(500).json({ error: err.message || "Failed to create tag" });
  }
}

export async function fetchTags(req, res) {
  try {
    const tags = await getTags();
    return res.status(200).json(tags);
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Failed to fetch tags' });
  }
}

/*
export async function fetchTagById(req, res) {
  const { id } = req.params;
  try {
    const tag = await getTagById(id);
    if (tag.length == 0) {
      return res.status(404).json({ error: err.message || "Tag not found" });
    }
    return res.status(200).json(tag);
  } catch (err) {
    return res.status(404).json({
      error: err.message || "Tag not found"
    });
  }
}
*/

export async function fetchTagByName(req, res) {
  const { name } = req.params;
  try {
    const tag = await getTagByName(name);
    if (tag.length == 0) {
      return res.status(404).json({ error: "Tag not found" });
    }
    return res.status(200).json(tag);
  } catch (err) {
    return res.status(500).json({ error: err.message || "Failed to fetch tag" });
  }
}
