import { NextApiRequest, NextApiResponse } from "next";
import Stripe from 'stripe';

import { getSupabaseServiceRole } from "../../utils/supabase";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.query.API_ROUTE_SECRET_KEY !== process.env.API_ROUTE_SECRET_KEY!) {
        return res.status(401).json({ message: 'You are not authorized to call this API' })
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
        apiVersion: '2022-11-15'
    });

    const customer = await stripe.customers.create({
        email: req.body.record.email,
    })

    const supabase = getSupabaseServiceRole();

    await supabase.from('profiles').update({
        stripe_customer: customer.id
    }).eq('id', req.body.record.id);

    res.status(201).json({ message: 'New stripe customer has created' })
}

export default handler;
