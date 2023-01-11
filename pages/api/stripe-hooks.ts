/// <reference types="stripe-event-types" />

import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import { buffer } from 'micro'

import { getSupabaseServiceRole } from "../../utils/supabase";

export const config = { api: { bodyParser: false } }

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
        apiVersion: '2022-11-15'
    });

    const signature = req.headers['stripe-signature']
    const reqBuffer = await buffer(req);

    try {
        const event = stripe.webhooks.constructEvent(reqBuffer, signature!, process.env.STRIPE_SIGNING_SECRET!) as Stripe.DiscriminatedEvent;
        const supabase = getSupabaseServiceRole();

        switch (event.type) {
            case 'customer.subscription.updated':
                await supabase.from('profiles')
                    .update({
                        is_subscribed: true,
                        interval: event.data.object.items.data[0].plan.interval
                    })
                    .eq('stripe_customer', event.data.object.customer)
                break;
            case 'customer.subscription.deleted':
                await supabase.from('profiles')
                    .update({
                        is_subscribed: false,
                        interval: null
                    })
                    .eq('stripe_customer', event.data.object.customer)
                break;
        }

    } catch (err) {
        if (err instanceof Stripe.errors.StripeSignatureVerificationError) {
            return res.status(400).json({ message: `Webhooks error: ${err.message}` })
        }
        return res.status(500);
    }

    res.json({ received: true })
}

export default handler;
