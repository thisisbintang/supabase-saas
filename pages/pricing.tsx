import { InferGetStaticPropsType } from 'next'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import Stripe from 'stripe'
import axios from 'axios'
import { loadStripe } from '@stripe/stripe-js'
import Link from 'next/link'
import { useSessionContext, useSupabaseClient } from '@supabase/auth-helpers-react'

import { Database } from '../types/supabase'
import { useAuth } from '../context/auth'

type Tables = Database['public']['Tables']

const Pricing = ({ plans }: InferGetStaticPropsType<typeof getStaticProps>) => {
    const { isLoading, session } = useSessionContext();
    const supabaseClient = useSupabaseClient<Database>()
    const [profile, setpProfile] = useState<Tables['profiles']['Row'] | null>();
    const { login } = useAuth()

    useEffect(() => {
        const fetchProfile = async (userId: string) => {
            const { data } = await supabaseClient.from('profiles').select('*').eq('id', userId).single()

            setpProfile(data)
        }

        if (session) fetchProfile(session.user.id)
    }, [session])

    const processSubcripction = useCallback((planId: string) => async () => {
        const { data } = await axios.get<{ id: string }>(`/api/subcription/${planId}`);
        const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY!);
        await stripe?.redirectToCheckout({ sessionId: data.id });
    }, []);

    const showSubscribeButton = !!session?.user && profile && !profile.is_subscribed;
    const showCreateAccountButton = !session?.user
    const showManageSubcriptionButton = !!session?.user && profile && profile.is_subscribed

    return (
        <div className='max-w-3xl my-16 mx-auto flex gap-x-8'>
            {
                plans.map(plan => (
                    <div key={plan.id} className='h-32 w-full rounded shadow p-4'>
                        <h2 className='text-xl'>{plan.name}</h2>
                        <p className='text-gray-500'>{new Intl.NumberFormat('en-US', {
                            style: 'currency',
                            currency: plan.currency,
                        }).format(plan.price ? plan.price / 100 : 0)} / {plan.interval}</p>
                        {
                            !isLoading && (
                                <>
                                    {showSubscribeButton && <button onClick={processSubcripction(plan.id)}>Subscribe</button>}
                                    {showCreateAccountButton && <button onClick={login}>Create Account</button>}
                                    {showManageSubcriptionButton && (
                                        <Link href={'/dashboard'}>
                                            Manage Subscription
                                        </Link>
                                    )}
                                </>
                            )
                        }
                    </div>
                ))
            }
        </div>
    )
}

export const getStaticProps = async () => {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2022-11-15' });

    const { data: prices } = await stripe.prices.list()

    const plans = await Promise.all(prices.map(async (price) => {
        const product = await stripe.products.retrieve(price.product as string)
        return {
            id: price.id,
            name: product.name,
            price: price.unit_amount,
            interval: price.recurring?.interval,
            currency: price.currency,
        };
    }))

    const sortedPlans = plans.sort((a, b) => Number(a.price) - Number(b.price))

    return {
        props: {
            plans: sortedPlans
        }
    }
}

export default Pricing
