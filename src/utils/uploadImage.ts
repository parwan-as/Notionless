import { supabase } from "../supabaseClient"
import { nanoid } from "nanoid"

export const uploadImage = async (file?: File) => {
    try {
        if(!file){
            throw new Error("You must select an image to upload");
        }

        const fileExt = file.name.split(".").pop()
        const filePath = `${nanoid()}.${fileExt}`

        const { error } = await supabase.storage.from("notionless").upload(filePath, file);
        if (error) throw error;

        return { filePath }
    } catch (e) {
        alert(e)
    }
}