import { createServerSupabaseClient, Session } from '@supabase/auth-helpers-nextjs'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { GetServerSideProps } from 'next'
import React, { useCallback, useEffect } from 'react'

import { useAuth } from '../context/auth'

const Login = () => {
    const supabase = useSupabaseClient();
    const { login } = useAuth()

    return (
        <div className='flex items-center justify-center'>
            <button
                onClick={login}
                className='bg-slate-800 rounded px-6 py-2 text-slate-50'>login</button>
        </div>
    )
}

export const getServerSideProps: GetServerSideProps<{
    intiliasSession?: Session
}> = async (ctx) => {
    const supabase = createServerSupabaseClient(ctx)

    const { data: { session } } = await supabase.auth.getSession()

    if (session) {
        return {
            redirect: {
                destination: '/dashboard',
                permanent: false,
            },
            props: {
                intiliasSession: session
            }
        }
    }

    return {
        props: {

        }
    }
}

export default Login
