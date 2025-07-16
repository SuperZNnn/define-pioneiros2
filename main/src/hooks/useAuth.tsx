import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { ApiRequests } from "../services/api"

type AuthContextType = {
    userId: number | undefined
    getUser: () => Promise<number | undefined>
    login: () => Promise<void>
    logout: () => Promise<void>
    loading: boolean
    error: Error | null
};

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error("useAuth precisa estar dentro de AuthProvider")
    }
    return context
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [userId, setUserId] = useState<number | undefined>(undefined)
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<Error | null>(null)
    let fetchPromise: Promise<number | undefined> | null = null

    const getUser = async () => {
        if (userId !== undefined) return userId

        if (!fetchPromise) {
            fetchPromise = ApiRequests.VerifySession()
                .then(res => {
                    const id = res.data.user.userId
                    setUserId(id)
                    return id
                })
                .catch(err => {
                    setError(err)
                    setUserId(undefined)
                    throw err
                })
                .finally(() => {
                    setLoading(false)
                    fetchPromise = null
                })
        }

        return fetchPromise;
    };

    const login = async () => {
        setLoading(true)
        try {
            const res = await ApiRequests.VerifySession()
            const id = res.data.user.userId
            setUserId(id)
            setError(null)
        }
        catch (err) {
            setUserId(undefined)
            setError(err as Error)
        }
        finally {
            setLoading(false)
        }
    };

    const logout = async () => {
        setLoading(true)
        try {
            await ApiRequests.DestroySession()
            setUserId(undefined)
        }
        catch (err) {
            setError(err as Error)
        }
        finally {
            setLoading(false)
        }
    };

    useEffect(() => {
        getUser().catch(() => {})
    }, [])

    return (
        <AuthContext.Provider value={{ userId, getUser, login, logout, loading, error }}>
            {children}
        </AuthContext.Provider>
    );
};
