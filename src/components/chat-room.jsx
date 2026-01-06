import { useEffect, useState } from 'react'
import { supabase } from './utils/supabase';
import { useAuth } from '@/context/authContext';


export const ChatRoom = () => {
    const [messages, setMessages] = useState([]);
    const [writingMessage, setWritingMessage] = useState('');
    const { user } = useAuth();

    useEffect(() => {
        const getMessages = async () => {
            const { data, error } = await supabase
                .from('message')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) {
                console.log(error);
            }
            console.log(data);

            setMessages(data);
        }

        getMessages();

        const channel = supabase
            .channel('schema-db-changes')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT', // Listen only for new messages
                    schema: 'public',
                    table: 'message',
                },
                (payload) => {
                    // Payload.new contains the new row data
                    console.log("payload", payload);

                    setMessages((currentMessages) => [...currentMessages, payload.new])
                }
            )
            .subscribe()

        // Cleanup subscription on unmount
        return () => {
            supabase.removeChannel(channel)
        }
    }, [])

    const sendMessage = async (e) => {
        e.preventDefault();
        if ((!writingMessage)) return;

        const { error } = await supabase
            .from('message')
            .insert({
                contenu: writingMessage,
                user_id: user.id,
            });

        if (error) {
            console.log(error);
        }

        setWritingMessage('');


    }

    return (
        <div>
            <ul>
                {messages.map((message) => (
                    <li key={message.id}>
                        {message.contenu}
                    </li>
                ))}
            </ul>

            <form onSubmit={sendMessage}>
                <input type="text" value={writingMessage} onChange={(e) => setWritingMessage(e.target.value)} />
                <button type="submit" onClick={sendMessage}>Send</button>
            </form>
        </div>
    )
}
