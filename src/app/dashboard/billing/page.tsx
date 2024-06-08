import MaxWidthWrapper from '@/components/MaxWidthWrapper'
import { Button } from '@/components/ui/button'
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { getUserSubscriptionPlan } from '@/lib/paypal'
import { format } from 'date-fns'
import Link from 'next/link'
import React from 'react'

const BillingPage = async () => {

  const subscriptionPlan = await getUserSubscriptionPlan()


  return (
    <MaxWidthWrapper className='max-w-5xl mt-12'>
      <Card>
        <CardHeader>
          <CardTitle>Subscription Plan</CardTitle>
          <CardDescription>You are currently on the <strong>{subscriptionPlan.name ? subscriptionPlan.name : "Free"} Plan.</strong></CardDescription>
        </CardHeader>
        <CardFooter>
          <Button className='flex flex-col items-start space-y-2 md:flex-row md:justify-between md:space-x-0'>
            {subscriptionPlan.isSubscribed ? 'Manage Subscription' : (<Link href="/pricing">Upgrade</Link>)}

          </Button>

          {subscriptionPlan.isSubscribed ? (<p className='rounded-full text-xs font-medium'>
            {subscriptionPlan.isCanceled ? "Your subscription will be automatically cancelled on " : "Your subscription will be automatically renewed on "}
            {format(subscriptionPlan.paypalNextBillingTime!, "dd.MM.yyyy")}
          </p>) : null}
        </CardFooter>
      </Card>
    </MaxWidthWrapper>
  )
}

export default BillingPage