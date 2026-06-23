import { createContext } from "react"
import type { Session } from "@supabase/supabase-js"

export type AuthSessionContextValue = {
    session: Session | null;
    loading: boolean;
}

export const AuthSessionContext = createContext<AuthSessionContextValue>({} as AuthSessionContextValue)
