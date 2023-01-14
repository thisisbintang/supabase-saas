import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import React, { PropsWithChildren, useCallback, useContext, useEffect, useState } from "react";
import { LoginBody } from "../pages/login";
import { RegisterBody } from "../pages/register";
import { Database } from "../types/supabase";

const Context = React.createContext<{
    login: () => void;
    logout: () => void;
    loginWithEmail: (data: LoginBody) => void;
    register: (data: RegisterBody) => void;
    student: Students | null;
}>({
    login: () => { },
    logout: () => { },
    register: () => { },
    loginWithEmail: () => { },
    student: null
});

type Students = Database['public']['Tables']['students']['Row']

export default function AuthProvider({ children }: PropsWithChildren) {
    const supabaseClient = useSupabaseClient<Database>()
    const user = useUser()
    const router = useRouter()
    const [student, setStudent] = useState<Students | null>(null)

    useEffect(() => {
        if (user) {
            const fetchStudent = async () => {
                const { data } = await supabaseClient.from('students').select('*').eq('id', user.id).single()
                setStudent(data);
            }

            fetchStudent()
        }
    }, [user])

    const login = useCallback(() => {
        supabaseClient.auth.signInWithOAuth({
            provider: 'github'
        })
    }, [])

    const loginWithEmail = useCallback(async (data: LoginBody) => {
        const { data: { user }, error } = await supabaseClient.auth.signInWithPassword({
            email: data.email,
            password: data.password,
        })

        if (error) return alert(error.message)

        // ceklokasi apakah di sekitran kampus

        // kala iya
        await supabaseClient.from('students').update({ status_login: true }).eq('id', user?.id);
        router.push('/dashboard')

    }, [])

    const logout = useCallback(async () => {
        const { data: { user } } = await supabaseClient.auth.getUser();

        await supabaseClient.from('students').update({ status_login: false }).match({ id: user?.id });

        await supabaseClient.auth.signOut();
        router.push('/login')
    }, [])

    const register = useCallback(async (data: RegisterBody) => {

        const { data: result, error } = await supabaseClient.auth.signUp({
            email: data.email,
            password: data.password,
            options: {
                data: {
                    angkatan: data.angkatan,
                    prodi: data.prodi,
                    nim: data.nim,
                    no_hp: data.no_hp,
                    nama: data.nama,
                }
            }
        })

        if (!error) router.push('confirm-email')
    }, [])

    return (
        <Context.Provider value={{
            login,
            logout,
            student,
            register,
            loginWithEmail,
        }}>
            {children}
        </Context.Provider>
    )
}

export const useAuth = () => useContext(Context)
