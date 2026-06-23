import { useContext } from "react"
import { AuthSessionContext } from "./authContext"

export const useAuthSession = () => useContext(AuthSessionContext)
