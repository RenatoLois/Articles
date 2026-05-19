
import supabaseClient from "../lib/supabaseClient.js";


export async function createTag(tagData) {
  const { data, error } = await supabaseClient
    .from("tag")
    .insert([tagData])
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

export async function getTags() {
  const { data, error } = await supabaseClient
    .from("tag")
    .select();

  if (error) throw new Error(error.message);
  return data;
}

/*
export async function getTagById(id) {
  const { data, error } = await supabaseClient
    .from("tag")
    .select()
    .eq("id", id);

  if (error) throw new Error(error.message);
  return data;
}
*/

export async function getTagByName(name) {
  const { data, error } = await supabaseClient
    .from("tag")
    .select()
    .eq("name", name);

  if (error) throw new Error(error.message);
  return data;
}
