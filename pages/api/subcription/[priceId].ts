import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";

import { Database } from "../../../types/supabase";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const supabase = createServerSupabaseClient<Database>({ req, res });

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return res.status(401).json({
            message: 'Not authenticated',
        })
    }


    const { data } = await supabase.from('profiles').select('stripe_customer').eq('id', user.id).single()

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
        apiVersion: '2022-11-15'
    });

    const { priceId } = req.query;

    const session = await stripe.checkout.sessions.create({
        customer: data?.stripe_customer ?? undefined,
        mode: 'subscription',
        payment_method_types: ['card'],
        line_items: [{
            quantity: 1,
            price: priceId as string,
        }],
        success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payments/success`,
        cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payments/cancelled`,
    })

    res.json({
        id: session.id,
    })
}

export default handler
