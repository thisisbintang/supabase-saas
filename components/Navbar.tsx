import React, { useCallback, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useSession, useSupabaseClient, useUser } from '@supabase/auth-helpers-react'
import { useAuth } from '../context/auth'


const Navbar = () => {
    const user = useUser()
    const router = useRouter()
    const supabase = useSupabaseClient()
    const { logout } = useAuth()

    const activeTab = useCallback((pathname: string) => {
        if (pathname === router.pathname) return 'font-medium'

        return ''
    }, [router])

    return (
        <div className='mb-8 border-b flex px-8 py-4 gap-x-4 items-center'>
            <Link className={`${activeTab('/')}`} href={'/'}>Home</Link>
            {
                user && (
                    <Link
                        className={`${activeTab('/dashboard')}`}
                        href={'/dashboard'}>
                        Dashboard
                    </Link>
                )
            }
            <Link className={`${activeTab('/pricing')}`} href={'/pricing'}>Pricing</Link>
            {
                user ? <button className='ml-auto' onClick={logout}>Logout</button> : <Link className={`ml-auto ${activeTab('/login')}`} href='/login'>Login</Link>
            }
        </div>
    )
}

export default Navbar
