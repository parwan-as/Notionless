import { supabase } from "../supabaseClient"
import { useState, useEffect, type ReactNode } from "react"
import { AuthSessionContext, type AuthSessionContextValue } from "./authContext"

type AuthSessionProviderProps = {
    children: ReactNode
}

export const AuthSessionProvider = ({ children }: AuthSessionProviderProps) => {
    const [session, setSession] = useState<AuthSessionContextValue["session"]>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const hasAuthInUrl =
            window.location.hash.includes("access_token") ||
            window.location.search.includes("code=")

        if (!hasAuthInUrl) {
            supabase.auth.getSession().then(({ data, error }) => {
                if (error) console.log(error)
                setSession(data.session)
                setLoading(false)
            })
        }

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session)
            setLoading(false)
        })

        return () => subscription.unsubscribe()
    }, [])

    return (
        <AuthSessionContext.Provider value={{ session, loading }}>
            {children}
        </AuthSessionContext.Provider>
    )
}
