import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useState } from 'react'
import { Pencil, Check, X } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useAuth } from '@/context/authContext'

export const ChatMessages = ({ messages, onUpdateMessage }) => {
    const [editingId, setEditingId] = useState(null)
    const [editValue, setEditValue] = useState('')
    const { user } = useAuth()

    const handleStartEdit = (message) => {
        setEditingId(message.id)
        setEditValue(message.contenu)
    }

    const handleCancelEdit = () => {
        setEditingId(null)
        setEditValue('')
    }

    const handleSaveEdit = (id) => {
        if (editValue.trim() && editValue !== messages.find(m => m.id === id)?.contenu) {
            onUpdateMessage(id, editValue)
        }
        setEditingId(null)
        setEditValue('')
    }

    return (
        <div className="flex flex-col gap-4 p-4 pb-20">
            {messages.map((message) => {
                const isEditing = editingId === message.id
                return (
                    <div key={message.id} className="flex items-start gap-3 max-w-full group">
                        <Avatar className="h-8 w-8 shrink-0 mt-1 border">
                            <AvatarFallback className="text-[10px] bg-primary/10 text-primary font-bold uppercase">
                                {message.user?.prenom?.substring(0, 1) + message.user?.nom?.substring(0, 1) || '??'}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                            <div className="text-[11px] font-semibold text-muted-foreground/80 flex items-center gap-2 ml-1">
                                <span>{message.user?.prenom + ' ' + message.user?.nom || 'Anon'}</span>
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
                            <div className="flex items-center gap-2 group/bubble max-w-full">
                                {isEditing ? (
                                    <div className="flex items-center gap-1.5 flex-1 max-w-[95%]">
                                        <Input
                                            value={editValue}
                                            onChange={(e) => setEditValue(e.target.value)}
                                            className="flex-1 min-h-[40px] bg-white border-primary/20 focus-visible:ring-primary/20"
                                            autoFocus
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') handleSaveEdit(message.id)
                                                if (e.key === 'Escape') handleCancelEdit()
                                            }}
                                        />
                                        <div className="flex items-center gap-1">
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                className="h-8 w-8 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 shrink-0"
                                                onClick={() => handleSaveEdit(message.id)}
                                            >
                                                <Check className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                className="h-8 w-8 text-rose-600 hover:text-rose-700 hover:bg-rose-50 shrink-0"
                                                onClick={handleCancelEdit}
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div
                                            className="bg-white border rounded-2xl rounded-tl-none px-4 py-2.5 text-sm shadow-sm text-slate-700 leading-relaxed self-start max-w-[95%] wrap-anywhere"
                                            onClick={message.id_user === user.id ? () => handleStartEdit(message) : null}
                                        >
                                            {message.contenu}
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className={"h-7 w-7 opacity-0 group-hover/bubble:opacity-100 transition-opacity shrink-0" + (message.id_user !== user.id ? ' hidden' : '')}
                                            onClick={() => handleStartEdit(message)}
                                        >
                                            <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                                        </Button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

