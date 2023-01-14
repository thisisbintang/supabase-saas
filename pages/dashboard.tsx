import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { Session, useUser } from '@supabase/auth-helpers-react'
import axios from 'axios'
import { GetServerSideProps, GetServerSidePropsContext, InferGetServerSidePropsType } from 'next'
import { useRouter } from 'next/router'
import { QRCodeSVG } from 'qrcode.react'

import React from 'react'
import { useAuth } from '../context/auth'

import { Database } from '../types/supabase'

const Dashboard = ({ }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
    const router = useRouter()
    const { student } = useAuth()
    const user = useUser()

    const loadPortal = async () => {
        const { data } = await axios.get('/api/portal')
        router.push(data.url)
    }

    return (
        <div className='container mx-auto px-8'>
            <div className='gap-y-4'>
                <h2 className='text-xl font-semibold'>Hai {student?.nama}</h2>
                {
                    user && (
                        <QRCodeSVG
                            value={user.id}
                        />
                    )
                }

            </div>
        </div>
    )
}

export const getServerSideProps: GetServerSideProps<{ intiliasSession: Session | null }> = async (ctx) => {
    const supabase = createServerSupabaseClient<Database>(ctx);

    const { data: { session } } = await supabase.auth.getSession()

    // const { data } = await supabase.from('profiles').select('*').single();

    return {
        props: {
            intiliasSession: session,
        }
    }
}

export default Dashboard
