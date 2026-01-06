import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export const ChatMessages = ({ messages }) => {
    return (
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
                                    {new Date(message.created_at).toLocaleTimeString('fr-FR', {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        hour12: false
                                    })}
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
    )
}
