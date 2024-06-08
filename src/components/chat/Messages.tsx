import { trpc } from '@/app/_trpc/client'
import { INFINITE_QUERY_LIMIT } from '@/config/infinite-query'
import { Loader2, MessageSquare } from 'lucide-react'
import React, { useContext, useRef, useEffect } from 'react'
import Skeleton from 'react-loading-skeleton'
import Message from './Message'
import { ChatContext } from './context/ChatContext'
import { useIntersection } from "@mantine/hooks"
import Typing from './Typing'

interface MessagesProps {
    fileId: string
}

const Messages = ({ fileId }: MessagesProps) => {

    const { isLoading: isAIThinking } = useContext(ChatContext)

    const { data, isLoading, fetchNextPage } = trpc.getFileMessages.useInfiniteQuery({
        fileId,
        limit: INFINITE_QUERY_LIMIT
    }, {
        getNextPageParam: (lastPage) => lastPage?.nextCursor
    })

    const messages = data?.pages.flatMap((page) => page.messages)

    const loadingMessage = {
        createdAt: new Date().toISOString(),
        id: "loading-message",
        isUserMessage: false,
        text: (<span className="flex h-full items-center justify-center">
            <Typing />
        </span>)
    }

    const combinedMessages = [
        ...(isAIThinking ? [loadingMessage] : []),
        ...(messages ?? [])
    ]

    const lastMessageRef = useRef<HTMLDivElement>(null)

    const { ref, entry } = useIntersection({
        root: lastMessageRef.current,
        threshold: 1
    })

    useEffect(() => {
        if (entry?.isIntersecting) {
            fetchNextPage()
        }
    }, [entry, fetchNextPage])

    return (
        <div className="flex max-h-[calc(100vh-3.5rem-7rem)] border-zinc-200 flex-1 flex-col-reverse gap-4 p-3 overflow-y-auto scrollbar-thumb-red scrollbar-thumb-rounded scrollbar-track-red-lighter scrollbar-w-2 scrolling-touch">
            {combinedMessages && combinedMessages.length > 0 ? (
                combinedMessages.map((message, i) => {

                    const isNextMessageFromSamePerson = combinedMessages[i - 1]?.isUserMessage === combinedMessages[i]?.isUserMessage

                    if (i === combinedMessages.length - 1) {
                        return <Message ref={ref} message={message} isNextMessageFromSamePerson={isNextMessageFromSamePerson} key={message.id} />
                    } else return <Message message={message} isNextMessageFromSamePerson={isNextMessageFromSamePerson} key={message.id} />
                })
            ) : isLoading ? (<div className="w-full flex flex-col gap-2">
                <Skeleton className='h-16' />
                <Skeleton className='h-16' />
                <Skeleton className='h-16' />
                <Skeleton className='h-16' />
            </div>) : (<div className='flex-1 flex flex-col items-center justify-center gap-2'>
                <MessageSquare className="h-8 w-8 text-red-500" />
                <h3 className='font-semibold text-xl'>You&apos;re all set!</h3>
                <p className="text-zinc-500 text-sm">
                    Ask your first question to get started.
                </p>
            </div>)}
        </div>
    )
}

export default Messages