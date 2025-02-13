import ChatWrapper from '@/components/chat/ChatWrapper'
import PDFRenderer from '@/components/pdf/PDFRenderer'
import { db } from '@/db'
import { currentUser } from '@clerk/nextjs/server'
import { notFound, redirect } from 'next/navigation'
import React from 'react'

type PageProps = {
    params: {
        fileId: string
    }
}
const FilePage = async ({ params }: PageProps) => {

    // retrieve the file id
    const { fileId } = params

    const user = await currentUser()

    if (!user || !user.id) redirect(`/auth-callback?origin=dashboard/${fileId}`)

    // make database call
    const file = await db.file.findFirst({
        where: {
            id: fileId,
            userId: user.id
        }
    })

    if (!file) notFound()

    return (
        <div className='flex-1 justify-between flex flex-col h-[calc(100vh-3.5rem)]'>
            <div className='mx-auto w-full max-w-8xl grow lg:flex xl:px-2'>
                {/* left side */}
                <div className='flex-1 xl:flex'>
                    <div className='px-4 py-6 sm:px-6 lg:pl-8 xl:flex-1 xl:pl-6'>
                        <PDFRenderer url={file.url} />
                    </div>
                </div>

                {/* right side */}
                <div className='shrink-0 flex-[0.75] border-t border-gray-200 lg:w-96 lg:border-l lg:border-t-0'>
                    <ChatWrapper fileId={fileId} />
                </div>
            </div>
        </div>
    )
}

export default FilePage