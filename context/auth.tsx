import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import React, { PropsWithChildren, useCallback, useContext, useEffect, useState } from "react";
import { Database } from "../types/supabase";

const Context = React.createContext<{
    login: () => void;
    logout: () => void;
    profile: Profile | null;
}>({
    login: () => { },
    logout: () => { },
    profile: null
});

type Profile = Database['public']['Tables']['profiles']['Row']

export default function AuthProvider({ children }: PropsWithChildren) {
    const supabaseClient = useSupabaseClient<Database>()
    const user = useUser()
    const router = useRouter()
    const [profile, setProfile] = useState<Profile | null>(null)

    useEffect(() => {
        if (user) {
            const channel = supabaseClient.channel(`public:profiles:id=eq.${user.id}`)
                .on('postgres_changes', {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'profiles',
                    filter: `id=eq.${user.id}`
                }, (payload) => {
                    setProfile(payload.new as any)
                }).subscribe()

            return () => {
                supabaseClient.removeChannel(channel)
            }
        }
    }, [user]);

    useEffect(() => {
        if (user) {
            const fetchProfile = async () => {
                const { data } = await supabaseClient.from('profiles').select('*').eq('id', user.id).single()
                setProfile(data);
            }

            fetchProfile()
        }
    }, [user])

    const login = useCallback(() => {
        supabaseClient.auth.signInWithOAuth({
            provider: 'github'
        })
    }, [])

    const logout = useCallback(async () => {
        await supabaseClient.auth.signOut();
        router.push('/login')
    }, [])

    return (
        <Context.Provider value={{
            login,
            logout,
            profile,
        }}>
            {children}
        </Context.Provider>
    )
}

export const useAuth = () => useContext(Context)
