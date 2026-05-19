import supabaseClient from "../lib/supabaseClient.js";
import { createTag, getTagByName } from "./tagService.js";

export async function attachTagsToArticle(articleId, tagNames) {
  if (!Array.isArray(tagNames) || tagNames.length === 0) {
    return { success: true };
  }

  for (const name of tagNames) {
    let tagId;

    let tags;
    try {
      tags = await getTagByName(name);
    } catch (err) {
      return { success: false, message: `Failed fetching tag "${name}": ${err.message}` };
    }

    if (!tags || tags.length === 0) {
      const result = await createTag({ name });
      if (!result.success) {
        return { success: false, message: `Failed creating tag "${name}": ${result.message}` };
      }
      tagId = result.data[0].id;
    } else {
      tagId = tags[0].id;
    }

    const { error } = await supabaseClient
      .from("article_tag")
      .insert({ article_id: articleId, tag_id: tagId });

    if (error) {
      return { success: false, message: error.message, name };
    }
  }

  return { success: true };
}

export async function syncTagsForArticle(articleId, tagNames) {
  try {
    const { error: deleteError } = await supabaseClient
      .from("article_tag")
      .delete()
      .eq("article_id", articleId);

    if (deleteError) {
      return { success: false, message: `Failed detaching old tags: ${deleteError.message}` };
    }

    if (tagNames && tagNames.length > 0) {
      const attachResult = await attachTagsToArticle(articleId, tagNames);
      if (!attachResult.success) {
        return attachResult;
      }
    }

    return { success: true };
  } catch (err) {
    return { success: false, message: `Failed to synchronize tags: ${err.message}` };
  }
}
