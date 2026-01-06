import { useEffect, useState, useRef } from 'react'
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Send } from "lucide-react"
import { ChatMessages } from "./chat-messages"
import supabase from '@/utils/supabase'
import { ChatInput } from './chat-input'

export const ChatRoom = () => {
    const [messages, setMessages] = useState([]);
    const [writingMessage, setWritingMessage] = useState('');
    const scrollRef = useRef(null);

    useEffect(() => {
        const getMessages = async () => {
            const { data, error } = await supabase
                .from('message')
                .select('*')
                .order('created_at', { ascending: true });

            if (error) {
                console.log(error);
            }
            setMessages(data || []);
        }

        getMessages();

        const channel = supabase
            .channel('schema-db-changes')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'message',
                },
                (payload) => {
                    setMessages((currentMessages) => [...currentMessages, payload.new])
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [])

    useEffect(() => {
        const scrollToBottom = () => {
            if (scrollRef.current) {
                scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
            }
        };

        scrollToBottom();

        // Also scroll after a short delay to ensure layout is done
        const timeoutId = setTimeout(scrollToBottom, 50);

        return () => clearTimeout(timeoutId);
    }, [messages]);

    const sendMessage = async (e) => {
        e.preventDefault();
        if ((!writingMessage.trim())) return;

        const { error } = await supabase
            .from('message')
            .insert({
                contenu: writingMessage,
            });

        if (error) {
            console.log(error);
        }

        setWritingMessage('');
    }

    return (
        <div className="relative flex flex-col h-full bg-white overflow-hidden">
            <ScrollArea className="flex-1 p-0 min-h-0" viewportRef={scrollRef}>
                <ChatMessages messages={messages} />
            </ScrollArea>

            <div className="absolute bottom-0 left-0 right-0 p-4">
                <ChatInput
                    sendMessage={sendMessage}
                    writingMessage={writingMessage}
                    setWritingMessage={setWritingMessage}
                />
            </div>
        </div>
    )
}
