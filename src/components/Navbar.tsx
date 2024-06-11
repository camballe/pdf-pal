"use client"
import React from 'react'
import MaxWidthWrapper from './MaxWidthWrapper'
import Link from "next/link"
import { buttonVariants } from './ui/button'
import { ArrowRight } from 'lucide-react'
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import { usePathname } from 'next/navigation'
import MobileNav from './MobileNavbar'
import MobileNavbar from './MobileNavbar'

const Navbar = () => {

    const pathname = usePathname()

    return (
        <nav className='sticky h-14 inset-x-0 top-0 z-30 w-full border-b border-gray-200 bg-white/75 backdrop-blur-lg transition-all'>
            <MaxWidthWrapper>
                <div className='flex h-14 items-center justify-between border-b border-zinc-200'>
                    <Link href="/" className="flex z-40 font-semibold text-2xl"><span className='text-red-600'>PDF</span>Pal</Link>

                    <MobileNavbar />

                    <div className='hidden items-center space-x-4 sm:flex'>
                        <>
                            {/* <Link href="/pricing" className={buttonVariants({
                                variant: "ghost",
                                size: "sm"
                            })}>Pricing</Link> */}
                            <SignedOut>
                                {pathname !== "/sign-in" ? (<Link href="/sign-in" className={buttonVariants({
                                    variant: "ghost",
                                    size: "sm"
                                })}>Sign In</Link>) : null}
                                {pathname !== "/sign-up" ? (<Link href="/sign-up" className={buttonVariants({
                                    size: "sm"
                                })}>Get Started <ArrowRight className='ml-1.5 h-5 w-5' /></Link>) : null}

                            </SignedOut>
                            <SignedIn>
                                {pathname !== "/dashboard" ? (
                                    <Link href="/dashboard" className={buttonVariants({
                                        variant: "ghost",
                                        size: "sm"
                                    })}>Dashboard</Link>) : null}
                                <UserButton />
                            </SignedIn>

                        </>
                    </div>
                </div>
            </MaxWidthWrapper>
        </nav>
    )
}

export default Navbar