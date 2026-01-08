import { useEffect, useState, useRef } from 'react'
import { ScrollArea } from "@/components/ui/scroll-area"
import { ChatMessages } from "./chat-messages"
import { ChatInput } from './chat-input'
import { useAuth } from '@/context/authContext'
import { chatService } from '@/services/chatService'

export const ChatRoom = () => {
    const [messages, setMessages] = useState([]);
    const [writingMessage, setWritingMessage] = useState('');
    const scrollRef = useRef(null);
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(true);

    // Initial load
    useEffect(() => {
        const loadMessages = async () => {
            setIsLoading(true);
            const structuredMessages = await chatService.getMessages();
            if (structuredMessages) {
                setMessages(structuredMessages);
            }
            setIsLoading(false);
        }

        loadMessages();
    }, []);

    // Real-time subscription
    useEffect(() => {
        const handleInsert = async (newMessage) => {
            let fullMessage = { ...newMessage };

            // optimization: if it's me, I know my profile
            if (fullMessage.id_user === user?.id && user?.profile) {
                fullMessage.user = user.profile;
            } else {
                // otherwise fetch full details to get user info
                const fetched = await chatService.getMessageById(fullMessage.id);
                if (fetched) fullMessage = fetched;
            }

            setMessages((current) => chatService.mergeNewMessage(current, fullMessage));
        };

        const handleUpdate = (updatedMessage) => {
            setMessages((current) => chatService.mergeUpdatedMessage(current, updatedMessage));
        };

        const channel = chatService.subscribeToChanges(handleInsert, handleUpdate);

        return () => {
            chatService.unsubscribe(channel);
        }
    }, [user]);

    // Auto-scroll logic
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
        // Find message to get original timestamp
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

        await chatService.editMessage(rootId, newContent, user.id, rootMsg.created_at);
        // State update is handled by subscription
    }

    const sendMessage = async (e) => {
        e.preventDefault();
        const content = writingMessage;
        if (!content.trim()) return;

        setWritingMessage(''); // Optimistic clear

        await chatService.sendMessage(content, user.id);
        // State update is handled by subscription
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

