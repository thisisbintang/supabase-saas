import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { NextApiRequest, NextApiResponse } from "next";
import { Database } from "../../types/supabase";
import { supabase } from "../../utils/supabase";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const supbaseServerClient = createServerSupabaseClient<Database>({
        req,
        res,
    });

    const {
        data: { session }
    } = await supbaseServerClient.auth.getSession();

    if (!session) {
        return res.status(401).json({
            message: 'Not authenticated',
        })
    }

    res.status(200).json(session)
}

export default handler;
