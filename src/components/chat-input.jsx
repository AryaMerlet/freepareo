import { Send } from 'lucide-react'
import React from 'react'
import { Input } from './ui/input'
import { Button } from './ui/button'

export const ChatInput = ({ sendMessage, writingMessage, setWritingMessage }) => {
    return (
        <form onSubmit={sendMessage} className="flex items-center gap-2 max-w-full">
            <Input
                type="text"
                placeholder="Votre message..."
                value={writingMessage}
                onChange={(e) => setWritingMessage(e.target.value)}
                className="flex-1 rounded-full bg-slate-100 border-none px-5 py-6 focus-visible:ring-primary/20 focus-visible:ring-0 focus-visible:scale-101 focus-visible:drop-shadow-lg hover:scale-101 hover:drop-shadow-lg  drop-shadow-xl ring-offset-0 transition-all duration-500"
            />
            <Button type="submit" size="icon" className="rounded-full h-12 w-12 shrink-0 drop-shadow-xl hover:drop-shadow-md hover:scale-105 transition-all duration-500">
                <Send className="h-5 w-5" />
            </Button>
        </form>
    )
}