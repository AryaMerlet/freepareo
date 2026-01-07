import { useEffect, useState, useRef } from 'react'
import { ScrollArea } from "@/components/ui/scroll-area"
import { ChatMessages } from "./chat-messages"
import supabase from '@/utils/supabase'
import { ChatInput } from './chat-input'
import { useAuth } from '@/context/authContext'

export const ChatRoom = () => {
    const [messages, setMessages] = useState([]);
    const [writingMessage, setWritingMessage] = useState('');
    const scrollRef = useRef(null);
    const { user } = useAuth();

    useEffect(() => {
        const getMessages = async () => {
            const { data, error } = await supabase
                .from('message')
                .select('*, user(*)')
                .order('created_at', { ascending: true })

            if (error) {
                console.log(error);
            }

            const msgMap = {};
            // First pass: Initialize versions array for all messages
            data?.forEach(m => {
                m.versions = [];
                msgMap[m.id] = m;
            });

            const roots = [];
            data?.forEach(m => {
                if (m.original && msgMap[m.original]) {
                    msgMap[m.original].versions.push(m);
                } else {
                    roots.push(m);
                }
            });

            setMessages(roots);
        }

        getMessages()

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
                    setMessages((currentMessages) => {
                        const newMessage = { ...payload.new };
                        // Supplement user info if it's the current user
                        if (newMessage.id_user === user.id) {
                            newMessage.user = user.profile;
                        }
                        //TODO : Add a service for getting a user profile when it's not the current user
                        newMessage.versions = [];

                        if (newMessage.original) {
                            // Helper to recursively find and update parent
                            const addToParent = (nodes) => {
                                return nodes.map(node => {
                                    if (node.id === newMessage.original) {
                                        return {
                                            ...node,
                                            versions: [...(node.versions || []), newMessage]
                                        };
                                    }
                                    if (node.versions && node.versions.length > 0) {
                                        return {
                                            ...node,
                                            versions: addToParent(node.versions)
                                        };
                                    }
                                    return node;
                                });
                            };
                            return addToParent(currentMessages);
                        }

                        // Normal message, append to bottom
                        return [...currentMessages, newMessage];
                    })
                }
            )
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'message',
                },
                (payload) => {
                    setMessages((currentMessages) => {
                        const updateNode = (nodes) => {
                            return nodes.map(node => {
                                if (node.id === payload.new.id) {
                                    return { ...node, ...payload.new };
                                }
                                if (node.versions && node.versions.length > 0) {
                                    return {
                                        ...node,
                                        versions: updateNode(node.versions)
                                    };
                                }
                                return node;
                            });
                        };
                        return updateNode(currentMessages);
                    })
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

    const updateMessage = async (rootId, newContent) => {

        // Helper to find message and ensure it exists
        const findMessage = (nodes, id) => {
            for (const node of nodes) {
                if (node.id === id) return node;
                if (node.versions?.length) {
                    const found = findMessage(node.versions, id);
                    if (found) return found;
                }
            }
            return null;
        };

        const rootMsg = findMessage(messages, rootId);
        if (!rootMsg) return;

        const { data: newMsgData, error: newMsgError } = await supabase
            .from('message')
            .insert({
                created_at: rootMsg.created_at, // Maintain original timestamp logic
                contenu: newContent,
                id_user: user.id,
                original: rootId,
            })
            .select()
            .single()

        if (newMsgError) {
            console.log(newMsgError);
            return;
        }

        const { error } = await supabase
            .from('message')
            .update({ updated: newMsgData.id, updated_at: new Date().toISOString() })
            .eq('id', rootId);

        if (error) {
            console.log(error);
        }
    }

    const sendMessage = async (e) => {

        e.preventDefault();
        if ((!writingMessage.trim())) return;

        const { error } = await supabase
            .from('message')
            .insert({
                contenu: writingMessage,
                id_user: user.id,
            });

        if (error) {
            console.log(error);
        }

        setWritingMessage('');
    }

    return (
        <div className="relative flex flex-col h-full bg-white overflow-hidden">
            <ScrollArea className="flex-1 p-0 min-h-0" viewportRef={scrollRef}>
                <ChatMessages messages={messages} onUpdateMessage={updateMessage} />
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
