import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";

import { Database } from "../../types/supabase";

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

    const session = await stripe.billingPortal.sessions.create({
        customer: data?.stripe_customer ?? '',
        return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard`
    })

    res.json({
        url: session.url,
    })
}

export default handler
