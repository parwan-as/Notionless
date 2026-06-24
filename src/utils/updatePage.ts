import type {Page} from "../utils/types";
import { supabase } from "../supabaseClient";
import { debounce } from "./debounce";

export const updatePage = debounce(
    async (page: Partial<Page> & Pick<Page, "id">) => {
        const { data, error } = await supabase
            .from("pages")
            .update(page)
            .eq("id", page.id)
            .select();
        if (error) console.error("Failed to save page:", error);
        else if (!data?.length) console.warn("Save affected 0 rows — likely a missing UPDATE RLS policy");
    },
    500
);