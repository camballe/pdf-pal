import MaxWidthWrapper from '@/components/MaxWidthWrapper'
import SubscribeButton from '@/components/SubscribeButton'
import { buttonVariants } from '@/components/ui/button'
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import { PLANS } from '@/config/paypalPlans'
import { cn } from '@/lib/utils'
import { currentUser } from '@clerk/nextjs/server'
import { ArrowRight, Check, CheckIcon, CrossIcon, HelpCircle, X } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const PricingPage = async () => {
    const user = await currentUser()

    const pricingItems = [
        {
            plan: 'Free',
            tagline: 'For students who need occasional use.',
            price: 0,
            features: [
                {
                    text: '50 pages per PDF',
                    footnote: 'The maximum amount of pages per PDF file.',
                },
                {
                    text: '4MB file size limit',
                    footnote: 'The maximum file size of a single PDF file.',
                },
                {
                    text: 'Unlimited Queries',
                },
                {
                    text: 'Higher-quality responses',
                    footnote: 'Better responses from the Large Language Model',
                    negative: true,
                },

            ],
            quota: 5,
            planId: PLANS[0].planId
        },
        {
            plan: 'Basic',
            tagline: 'For regular users with moderate needs.',
            price: 4.99,
            features: [
                {
                    text: '150 pages per PDF',
                    footnote: 'The maximum amount of pages per PDF file.',
                },
                {
                    text: '8MB file size limit',
                    footnote: 'The maximum file size of a single PDF file.',
                },
                {
                    text: 'Unlimited Queries',
                },
                {
                    text: 'Higher-quality responses',
                    footnote: 'Better responses from the Large Language Model',
                    negative: true,
                },

            ],
            quota: 20,
            planId: PLANS[1].planId
        },
        {
            plan: 'Standard',
            tagline: 'For heavy users who need more resources.',
            price: 9.99,
            features: [
                {
                    text: '400 pages per PDF',
                    footnote: 'The maximum amount of pages per PDF file.',
                },
                {
                    text: '16MB file size limit',
                    footnote: 'The maximum file size of a single PDF file.',
                },
                {
                    text: 'Unlimited Queries',
                },
                {
                    text: 'Higher-quality responses',
                    footnote: 'Better responses from the Large Language Model',
                },

            ],
            quota: 50,
            planId: PLANS[2].planId
        },
        {
            plan: 'Premium',
            tagline: 'For power users or small groups.',
            price: 19.99,
            features: [
                {
                    text: '1000 pages per PDF',
                    footnote: 'The maximum amount of pages per PDF file.',
                },
                {
                    text: '48MB file size limit',
                    footnote: 'The maximum file size of a single PDF file.',
                },
                {
                    text: 'Unlimited Queries',
                },
                {
                    text: 'Higher-quality responses',
                    footnote: 'Better responses from the Large Language Model',
                },

            ],
            quota: 120,
            planId: PLANS[3].planId
        },
    ];




    return (
        <>
            <MaxWidthWrapper className='mb-8 mt-24 text-center max-w-5xl'>
                <div className='mx-auto mb-10 sm:max-w-lg'>
                    <h1 className='text-6xl font-bold sm:text-7xl'>Pricing</h1>
                </div>

                <div className='pt-12 grid grid-cols-1 gap-10 lg:grid-cols-2'>
                    <TooltipProvider>
                        {pricingItems.map(({ plan, price, tagline, features, quota, planId }) => {


                            return (<div key={plan} className={cn("relative rounded-2xl bg-white shadow-lg", {
                                "border-2 border-[#FF9999] shadow-[#FFCCCC]": plan === "Basic",
                                "border-2 border-[#FF6666] shadow-[#FF9999]": plan === "Standard",
                                "border-2 border-[#990000] shadow-[#CC0000]": plan === "Premium",
                                "border border-gray-200": plan === "Free"
                            })}>
                                {plan === "Standard" && (
                                    <div className='absolute -top-5 left-0 right-0 mx-auto w-32 rounded-full bg-gradient-to-r from-red-600 to-[#FF6666] px-3 py-2 text-sm font-medium text-white'>Recommended</div>
                                )}

                                <div className="p-5">
                                    <h3 className='my-3 text-center font-display text-3xl font-bold'>
                                        {plan}
                                    </h3>
                                    <p className='text-gray-500'>{tagline}</p>
                                    <p className='my-5 font-display text-6xl font-semibold'>${price}</p>
                                    <p className='text-gray-500'>per month</p>
                                </div>

                                <div className='flex h-20 items-center justify-center border-b border-t border-gray-200 bg-gray-50'>
                                    <div className="flex items-center space-x-1">
                                        <p>{quota.toLocaleString()} PDFs/mo included</p>

                                        <Tooltip delayDuration={300}>
                                            <TooltipTrigger className="cursor-default ml-1.5">
                                                <HelpCircle className='h-4 w-4 text-zinc-500' />
                                            </TooltipTrigger>
                                            <TooltipContent className="w-80 p-2">
                                                The number of PDFs you can upload per month.
                                            </TooltipContent>
                                        </Tooltip>
                                    </div>
                                </div>

                                <ul className='my-10 space-y-5 px-8'>
                                    {features.map(({ text, footnote, negative }) => (
                                        <li key={text} className='flex space-x-5'>
                                            <div className='flex-shrink-0'>
                                                {negative ? (
                                                    <X className="h-6 w-6 text-red-600" />
                                                ) : (<Check className="h-6 w-6 text-green-600" />)}
                                            </div>
                                            {footnote ? (
                                                <div className='flex items-center space-x-1'>
                                                    <p className={cn("text-gray-400", {
                                                        "text-gray-600": negative
                                                    })}>
                                                        {text}
                                                    </p>
                                                    <Tooltip delayDuration={300}>
                                                        <TooltipTrigger className="cursor-default ml-1.5">
                                                            <HelpCircle className='h-4 w-4 text-zinc-500' />
                                                        </TooltipTrigger>
                                                        <TooltipContent className="w-80 p-2">
                                                            {footnote}
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </div>
                                            ) : (
                                                <p className={cn("text-gray-400", {
                                                    "text-gray-600": negative
                                                })}>
                                                    {text}
                                                </p>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                                <div className="border-t border-gray-200" />
                                <div className='p-5'>
                                    {plan === "Free" ? (<Link href={user ? "/dashboard" : "/sign-in"} className={buttonVariants({
                                        className: "w-full",
                                        variant: "secondary"
                                    })}>
                                        {user ? "Subscribe for free" : "Sign up"}
                                        <ArrowRight className="h-5 w-5 ml-1.5" />
                                    </Link>) : user ? (
                                        <SubscribeButton price={price} paypalPlanId={planId} />
                                    ) : (<Link href="/sign-in" className={buttonVariants({
                                        className: "w-full"
                                    })}>
                                        {user ? "Subscribe" : "Sign up"}
                                        <ArrowRight className="h-5 w-5 ml-1.5" />
                                    </Link>)}
                                </div>
                            </div>)
                        }


                        )}
                    </TooltipProvider>
                </div>
            </MaxWidthWrapper>
        </>
    )
}

export default PricingPage