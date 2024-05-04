import React from 'react'
import { EmailAddress, auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from 'next/navigation';
import { db } from '@/db';

const Dashboard = async () => {

    const user = await currentUser()

    if (!user || !user.id) redirect("/auth-callback?origin=dashboard")

    const dbUser = await db.user.findFirst({
        where: { id: user.id }
    })

    if (!dbUser) redirect("/auth-callback?origin=dashboard")

    return (
        <div>Email: {user?.primaryEmailAddress?.emailAddress} </div>
    )
}

export default Dashboard