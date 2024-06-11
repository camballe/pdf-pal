"use client"

import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import { ArrowRight, Menu } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useState } from 'react'

const MobileNavbar = () => {

    const pathname = usePathname()

    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false)

    const toggleMenu = () => {
        setIsMenuOpen((prev) => !prev)
    }

    return (
        <nav className='sm:hidden'>
            <div className='flex justify-center items-center gap-4'>
                <UserButton />
                <Menu onClick={toggleMenu} className="relative z-50 h-5 w-5 text-zinc-700 cursor-pointer" />
            </div>


            {isMenuOpen ? (
                <div className='fixed animate-in slide-in-from-top-5 fade-in-20 inset-0 z-0 w-full'>
                    <ul className="absolute bg-white border-b border-zinc-200 shadow-xl grid w-full gap-3 px-10 pt-20 pb-8">
                        <SignedOut>
                            {pathname !== "/sign-up" ?
                                (<li>
                                    <Link href="/sign-up" className='flex items-center w-full font-semibold text-green-600'>Get Started <ArrowRight className='ml-2 h-5 w-5' /></Link>
                                </li>) : null}
                            <li className='my-3 h-px w-full bg-gray-300' />
                            {pathname !== "/sign-in" ?
                                (<li>
                                    <Link href="/sign-in" className='flex items-center w-full font-semibold '>Sign In </Link>
                                </li>) : null}
                        </SignedOut>
                        <SignedIn>
                            {pathname !== "/dashboard" ? (
                                <li>
                                    <Link href="/dashboard" className='flex items-center w-full font-semibold '>Dashboard </Link>
                                </li>) : null}
                        </SignedIn>
                    </ul>
                </div>
            ) : null}
        </nav>
    )
}

export default MobileNavbar