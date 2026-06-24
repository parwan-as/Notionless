import { supabase } from "../supabaseClient"
import { nanoid } from "nanoid"

export const fetchPageTitle = async (slug: string) => {
    const { data } = await supabase
        .from("pages")
        .select("title")
        .eq("slug", slug)
        .single();
    return data?.title ?? null;
}

export const createLinkedPage = async (title: string) => {
    const slug = nanoid();
    const { data: userData } = await supabase.auth.getUser();
    const { error } = await supabase.from("pages").insert({
        slug,
        title,
        nodes: [],
        created_by: userData.user?.id,
    });
    if (error) {
        console.error("Failed to create page:", error);
        return null;
    }
    return slug;
}

export const deletePage = async (slug: string) => {
    const { error } = await supabase.from("pages").delete().eq("slug", slug);
    if (error) console.error("Failed to delete page:", error);
}
