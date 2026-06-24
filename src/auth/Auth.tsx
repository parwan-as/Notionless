import { useState, type FormEvent } from "react"
import { useAuthSession } from "./useAuthSession"
import { Navigate } from "react-router-dom"
import { supabase } from "../supabaseClient"
import styles from "./Auth.module.css"

export const Auth = () => {
    const [loading, setLoading] = useState(false)
    const [email, setEmail] = useState("")
    const [sent, setSent] = useState(false)
    const [error, setError] = useState("")
    const { session } = useAuthSession()

    const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setError("")
        try {
            setLoading(true)
            const { error } = await supabase.auth.signInWithOtp({
                email,
                options: { emailRedirectTo: window.location.origin },
            })
            if (error) throw error
            setSent(true)
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong")
        } finally {
            setLoading(false)
        }
    }

    if (session) {
        return <Navigate to="/" />
    }

    return (
        <div className={styles.wrapper}>
            <div className={styles.card}>
                <div className={styles.logo}>📝</div>
                <h1 className={styles.title}>Notionless</h1>
                <p className={styles.subtitle}>
                    Sign in with a magic link — no password required.
                </p>

                {sent ? (
                    <div className={styles.sent}>
                        Check <strong>{email}</strong> for your login link ✨
                    </div>
                ) : (
                    <form className={styles.form} onSubmit={handleLogin}>
                        <label className={styles.label} htmlFor="email">
                            Email address
                        </label>
                        <input
                            className={styles.input}
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            required
                        />
                        {error && <p className={styles.error}>{error}</p>}
                        <button className={styles.button} disabled={loading}>
                            {loading ? "Sending magic link…" : "Send magic link"}
                        </button>
                    </form>
                )}
            </div>
        </div>
    )
}
