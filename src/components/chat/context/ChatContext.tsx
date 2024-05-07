import { useToast } from "@/components/ui/use-toast";
import { useMutation } from "@tanstack/react-query";
import React, { ReactNode, createContext, useState } from "react";

type StreamResponse = {
    addMessage: () => void,
    message: string,
    handleInputChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void,
    isLoading: boolean,
}

export const ChatContext = createContext<StreamResponse>({
    addMessage: () => { },
    message: "",
    handleInputChange: () => { },
    isLoading: false,
})

type ProviderProps = {
    fileId: string,
    children: ReactNode
}

export const ChatContextProvider = ({ fileId, children }: ProviderProps) => {
    const [message, setMessage] = useState<string>("")
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const { toast } = useToast()

    const { mutate: sendMessage } = useMutation({
        mutationFn: async ({ message }: { message: string }) => {
            const response = await fetch("/api/message", {
                method: "POST",
                body: JSON.stringify({
                    fileId,
                    message
                })
            })

            if (!response.ok) {
                throw new Error("Failed to send message")
            }

            return response.body

        }
    })

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setMessage(e.target.value)
    }

    const addMessage = () => sendMessage({ message })

    return (
        <ChatContext.Provider value={{ addMessage, message, handleInputChange, isLoading }}>
            {children}
        </ChatContext.Provider>
    )
}