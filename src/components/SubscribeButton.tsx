"use client";
import { useRouter } from 'next/navigation';
import React, { useState, ReactNode } from 'react';
import { Button } from './ui/button';
import { ArrowRight, LoaderCircle } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { trpc } from '@/app/_trpc/client';

type SubscribeButtonProps = {
    price: number;
    paypalPlanId: string;
};

const SubscribeButton = ({ price, paypalPlanId }: SubscribeButtonProps) => {
    const router = useRouter();
    const [message, setMessage] = useState<ReactNode>(null);

    const { mutateAsync: createPaypalSubscription } = trpc.createPaypalSubscriptionOrder.useMutation();
    const { mutate: approvePaypalSubscription } = trpc.approvePaypalSubscriptionOrder.useMutation();

    return (
        <Popover>
            <PopoverTrigger className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full">
                Subscribe now <ArrowRight className="h-5 w-5 ml-1.5" />
            </PopoverTrigger>
            <PopoverContent>
                <PayPalScriptProvider
                    options={{
                        clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!,
                        "enable-funding": "paylater,venmo",
                        "data-sdk-integration-source": "integrationbuilder_sc",
                        vault: "true",
                        intent: "subscription",
                    }}
                >
                    <PayPalButtons
                        createSubscription={async () => {
                            try {
                                const response = await createPaypalSubscription({ planId: paypalPlanId });

                                if (response && response.data && response.data.id) {
                                    return response.data.id;
                                } else {
                                    console.error(
                                        { callback: "createSubscription", serverResponse: response.data },
                                        JSON.stringify(response.data, null, 2)
                                    );
                                    setMessage(
                                        <p className="text-red-500 text-xs p-4">
                                            We could not initiate this subscription! Please try again.
                                        </p>
                                    );
                                    throw new Error("Failed to create subscription");
                                }
                            } catch (error) {
                                console.error(error);
                                setMessage(
                                    <p className="text-red-500 text-xs p-4">
                                        We could not initiate this subscription! Please try again.
                                    </p>
                                );
                                throw new Error("Failed to create subscription");
                            }
                        }}
                        onApprove={async (data, actions) => {
                            if (data.subscriptionID) {
                                setMessage(
                                    <p className="text-zinc-800 font-semibold text-xs p-4">
                                        Your payment was successful!
                                        <br />
                                        <span className="text-[0.72rem] text-zinc-800 flex justify-center items-center gap-1">
                                            Processing your subscription <LoaderCircle className="animate-spin h-2 w-2" />
                                        </span>
                                    </p>
                                );

                                setTimeout(() => {
                                    router.push('/dashboard/billing');
                                }, 6000);

                                approvePaypalSubscription({ paypalPlanId, paypalSubscriptionId: data.subscriptionID });
                            } else {
                                setMessage(
                                    <p className="text-red-500 text-xs p-4">
                                        We could not activate your subscription! Please try again.
                                    </p>
                                );
                            }
                        }}
                    />
                </PayPalScriptProvider>
            </PopoverContent>
        </Popover>
    );
};

export default SubscribeButton;
