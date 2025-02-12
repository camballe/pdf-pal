"use client"
import React, { useState } from 'react'
import UploadButton from './pdf/UploadButton'
import { trpc } from '@/app/_trpc/client'
import { File, FileClock, Ghost, Loader2, MessageSquare, Paperclip, Plus, Trash } from 'lucide-react'
import Image from 'next/image'
import Skeleton from "react-loading-skeleton"
import Link from "next/link"
import { format } from "date-fns"
import { Button } from './ui/button'

const Dashboard = () => {

    const [currentlyDeletingFile, setCurrentlyDeletingFile] = useState<string | null>(null)

    const utils = trpc.useContext()

    const { data: files, isLoading } = trpc.getUserFiles.useQuery()

    const { mutate: deleteFile } = trpc.deleteFile.useMutation({
        onSuccess: () => {
            utils.getUserFiles.invalidate()
        },
        onMutate({ id }) {
            setCurrentlyDeletingFile(id)
        },
        onSettled() {
            setCurrentlyDeletingFile(null)
        }
    })

    return (
        <main className="mx-auto max-w-7xl md:p-10">
            <div className='mt-8 flex flex-col items-start justify-between gap-4 border-b border-gray-200 pb-5 sm:flex-row sm:items-center sm:gap-0'>
                <h1 className='mb-3 font-bold text-5xl'>My Documents</h1>

                <UploadButton />
            </div>

            {/* display all user files */}
            {files && files?.length !== 0 ? (
                <ul className='mt-8 grid grid-cols-1 gap-6 divide-y divide-zinc-200 md:grid-cols-2 lg:grid-cols-3'>
                    {files.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((file) => (
                        <li key={file.id} className='col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow transition hover:shadow-lg'>
                            <Link href={`/dashboard/${file.id}`} className="flex flex-col gap-2">
                                <div className="pt-6 px-6 flex w-full items-center justify-between space-x-6">
                                    {/* <div  className="h-10 w-10 flex-shrink-0 rounded-full bg-gradient-to-r from-pink-500 to-red-500"/> */}
                                    <File className="h-10 w-10 text-red-500" />

                                    <div className="flex-1 truncate">
                                        <div className="flex items-center space-x-3">
                                            <h3 className="truncate text-lg font-medium text-zinc-900">{file.name}</h3>
                                        </div>
                                    </div>
                                </div>
                            </Link>

                            <div className="px-6 mt-4 grid grid-cols-3 place-items-center py-2 gap-6 text-xs text-zinc-500">
                                <div className='flex items-center gap-2'>
                                    {/* <FileClock className='h-4 w-4' /> */}
                                    {format(new Date(file.createdAt), "h:mm, dd MMM yyyy ")}
                                </div>


                                <Button onClick={() => deleteFile({ id: file.id })} size="sm" className='w-full' variant="destructive">
                                    {currentlyDeletingFile === file.id ? (<Loader2 className="h-4 w-4 animate-spin" />) : (<Trash className='h-4 w-4' />)}
                                </Button>
                            </div>


                        </li>
                    ))}
                </ul>
            ) : isLoading ? (
                <Skeleton height={100} className='my-2' count={3} />
            ) : (
                <div className='mt-16 flex flex-col items-center gap-2'>
                    {/* <Ghost className='h-8 w-8 text-zinc-800' /> */}
                    <Image src="/no_files_found.png" alt="No files found" width={250} height={250} quality={100} />
                    <h3 className='font-semibold text-xl'>This place looks empty</h3>
                    <p>Upload some PDFs</p>
                </div>
            )}
        </main>
    )
}

export default Dashboard