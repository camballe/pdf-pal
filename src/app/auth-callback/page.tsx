"use client"
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect } from 'react'
import { trpc } from '../_trpc/client'
import { Loader2 } from 'lucide-react'

const AuthCallback = () => {
    const router = useRouter()

    const searchParams = useSearchParams()
    const origin = searchParams.get("origin")

    const { data, error, isLoading, isError } = trpc.authCallback.useQuery()

    useEffect(() => {
        if (data?.success) {
            // user is synced to db
            router.push(origin ? `/${origin}` : '/dashboard')
        } else if (isError && error?.data?.code === "UNAUTHORIZED") {
            router.push("/sign-in")
        }
    }, [data, error, isError, router, origin])


    return (
        <div className='w-full mt-24 flex justify-center'>
            <div className='flex flex-col items-center gap-2'>
                <Loader2 className="h-8 w-8 animate-spin text-zinc-800" />
                <h3 className='font-semibold text-xl'>Setting up your account...</h3>
                <p>You will be redirected automatically.</p>
            </div>
        </div>
    )
}

export default AuthCallback