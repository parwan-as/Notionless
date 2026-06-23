import { supabase } from "../supabaseClient"

export const deleteImage = async (filePath: string) => {
    const { error } = await supabase.storage.from("notionless").remove([filePath]);
    if (error) console.error("Failed to delete image:", error);
}
