import { createMiddlewareSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
    // We need to create a response and hand it to the supabase client to be able to modify the response headers.
    const res = NextResponse.next();

    // create authenticated Supabase Client
    const supabase = createMiddlewareSupabaseClient({ req, res })

    // Check if we have  a session
    const { data: { session } } = await supabase.auth.getSession()

    // Check auth condition and if have a sesssion, forward request to authenticated route.
    if (session) return res;

    // Session not set, redirect to login page,
    const redirectUrl = req.nextUrl.clone()
    redirectUrl.pathname = '/login'
    redirectUrl.searchParams.set('redirectFrom', req.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl);
}

export const config = {
    matcher: ['/dashboard/:path']
}
