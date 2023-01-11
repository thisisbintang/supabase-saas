import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { Session } from '@supabase/auth-helpers-react'
import axios from 'axios'
import { GetServerSideProps, GetServerSidePropsContext, InferGetServerSidePropsType } from 'next'
import { useRouter } from 'next/router'

import React from 'react'
import { useAuth } from '../context/auth'

import { Database } from '../types/supabase'

const dashboard = ({  }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
    const router = useRouter()
    const { profile } = useAuth()

    const loadPortal = async () => {
        const { data } = await axios.get('/api/portal')
        router.push(data.url)
    }

    return (
        <div className='container mx-auto px-8'>
            <div className='gap-y-4'>
                <h2 className='text-xl font-semibold'>Hai {profile?.email}</h2>
                {
                    profile?.is_subscribed ? (
                        <>
                            <div>Subscribed: {profile.interval}</div>
                            <button onClick={loadPortal}>Manage subcription</button>
                        </>
                    ) : <button onClick={() => router.push('/pricing')}>Subscribe</button>
                }

            </div>
        </div>
    )
}

export const getServerSideProps: GetServerSideProps<{ intiliasSession: Session}> = async (ctx) => {
    const supabase = createServerSupabaseClient<Database>(ctx);

    const { data: { session } } = await supabase.auth.getSession()

    // const { data } = await supabase.from('profiles').select('*').single();

    return {
        props: {
            intiliasSession: session!,
        }
    }
}

export default dashboard
