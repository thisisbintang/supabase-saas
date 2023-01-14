import { createServerSupabaseClient, Session } from '@supabase/auth-helpers-nextjs'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { GetServerSideProps } from 'next'
import React, { useCallback, useEffect } from 'react'
import { useForm } from 'react-hook-form'

import { useAuth } from '../context/auth'

export interface LoginBody {
    email: string;
    password: string;
}

const Login = () => {
    const supabase = useSupabaseClient();
    const { loginWithEmail } = useAuth()
    const { login } = useAuth()
    const { register, handleSubmit, formState: { errors } } = useForm();
    const onSubmit = (data: LoginBody) => loginWithEmail(data);

    console.log(errors)

    return (
        <div className='flex flex-col items-center justify-center gap-y-4'>
            <h2 className='mb-4 text-xl font-medium text-center'>Login</h2>
            <form
                className='flex flex-col gap-y-4 items-center'
                onSubmit={handleSubmit(onSubmit as any)}>
                <input
                    className='input input-bordered w-full max-w-xs'
                    type="text" placeholder="Email" {...register("email", {
                        required: {
                            value: true,
                            message: 'Data harus disisi',
                        },
                        pattern: {
                            value: /^\S+@\S+$/i,
                            message: 'Data harus berupa email'
                        }
                    })} />
                {
                    errors.email && <p className='text-red-500'>{errors.email.message}</p>
                }

                <input
                    className='input input-bordered w-full max-w-xs'
                    type="password" placeholder="Password"  {...register("password", {
                        required: {
                            value: true,
                            message: 'Data harus diisi'
                        }
                    })} />
                {
                    errors.password && <p className='text-red-500'>{errors.password.message}</p>
                }

                <input
                    className='btn self-end' type="submit" />
            </form>

            <div>- or -</div>

            <button
                onClick={login}
                className='bg-slate-800 rounded px-6 py-2 text-slate-50'>login with github</button>
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
