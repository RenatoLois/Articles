import supabaseClient from "../lib/supabaseClient.js";


export async function createArticle(articleData) {
  const { data, error } = await supabaseClient
    .from("article")
    .insert([articleData])
    .select();

  if (error) {
    if (error.code === "23505") {
      return {
        success: false,
        status: 409, // Conflict
        message: "Article already exists"
      };
    }

    throw new Error(error.message);
  }
  return {success: true, data};
}

export async function getArticles(tagName) {
  if(!tagName) {
    const { data, error } = await supabaseClient
      .from("article")
      .select(`
        id,
        title,
        date,
        slug,
        article_tag (
          tag (id, name)
        )`
      )
      .order('date', { ascending: false });

    if (error) throw new Error(error.message);
    return data;
  } else {
    const { data: tagData, error: tagError } = await supabaseClient
      .from("tag")
      .select()
      .eq("name", tagName);

    if (tagError) throw new Error(tagError.message);
    
    if (tagData.length == 0) return [];

    const tagId = tagData[0].id;

    const { data: articleIds, error: articleIdError } = await supabaseClient
      .from("article_tag")
      .select("article_id")
      .eq("tag_id", tagId);

    if (articleIdError) throw new Error(articleIdError.message);
    if (articleIds.length === 0) return [];

    const articleIdsMap = articleIds.map(at => at.article_id);

    const { data, error } = await supabaseClient
      .from("article")
      .select(`
        id,
        title,
        date,
        slug,
        article_tag (
          tag (id, name)
        )`
      )
      .in("id", articleIdsMap)
      .order('date', { ascending: false });


    if (error) throw new Error(error.message);
    
    return data;
  }
}

export async function getArticleBySlug(slug) {
  const { data, error } = await supabaseClient
    .from("article")
    .select(`
      id,
      title,
      date,
      slug,
      content,
      article_tag (
        tag (id, name)
      )
    `)
    .eq("slug", slug);

  if (error) throw new Error(error.message);
  return data;
}

export async function getArticleById(id) {
  const { data, error } = await supabaseClient
    .from("article")
    .select()
    .eq("id", id);
  
  if (error) throw new Error(error.message);
  return data;
}

export async function updateArticleById(id, newArticleData) {
  const { data, error } = await supabaseClient
    .from("article")
    .update(newArticleData)
    .eq("id", id)
    .select();

  return { data, error };
}

export async function deleteArticleById(id) {
  const { error } = await supabaseClient
    .from("article")
    .delete()
    .eq("id", id);

  if (error) throw new Error(error.message);
  return { success: true, message: "Article deleted if exists successfully" };
}
