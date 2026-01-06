import { useEffect, useState, useRef } from 'react'
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Send } from "lucide-react"
import supabase from '@/utils/supabase'

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
                <div className="flex flex-col gap-4 p-4 pb-20">
                    {messages.map((message) => (
                        <div key={message.id} className="flex items-start gap-3 max-w-full">
                            <Avatar className="h-8 w-8 shrink-0 mt-1 border">
                                <AvatarFallback className="text-[10px] bg-primary/10 text-primary font-bold uppercase">
                                    {message.user_id?.substring(0, 2) || '??'}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                                <div className="text-[11px] font-semibold text-muted-foreground/80 flex items-center gap-2 ml-1">
                                    <span>User {message.user_id?.substring(0, 4) || 'Anon'}</span>
                                    {message.created_at && (
                                        <span className="font-normal text-[10px] opacity-60">
                                            {new Date(message.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', hour12: false })}
                                        </span>
                                    )}
                                </div>
                                <div
                                    className="bg-white border rounded-2xl rounded-tl-none px-4 py-2.5 text-sm shadow-sm text-slate-700 leading-relaxed self-start max-w-[95%] wrap-anywhere"
                                >
                                    {message.contenu}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </ScrollArea>

            <div className="absolute bottom-0 left-0 right-0 p-4">
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
            </div>
        </div>
    )
}
