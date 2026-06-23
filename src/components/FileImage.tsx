import { useEffect, useState } from "react"
import { supabase } from "../supabaseClient"
import { Loader } from "./Loader"
import styles from "../utils.module.css"

type FileImageProps = {
    filePath: string
} & React.ImgHTMLAttributes<HTMLImageElement>

export const FileImage = ({filePath, ...props}: FileImageProps) => {
    const [image, setImage] = useState("")
    const [ loading, setLoading ] = useState(false)

    useEffect(() => {
        const downloadImage = async (filePath: string) => {
            setLoading(true);
            const {data} = await supabase.storage.from("notionless").download(filePath)
            if(data){
                const url = URL.createObjectURL(data)
                setImage(url)
                setLoading(false)
            }
        }
        if(filePath && filePath.length > 0){
            downloadImage(filePath)
        }
    }, [filePath])

    if (loading) {
        return <div className={styles.centeredFlex}><Loader /></div>
    }

    if (!image) return null;

    return <img src={image} alt={filePath} {...props} />
}
