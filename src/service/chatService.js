import supabase from '@/utils/supabase'

export const chatService = {
    /**
     * Fetches all messages with user details.
     */
    async getMessages() {
        const { data, error } = await supabase
            .from('message')
            .select('*, user(*)')
            .order('created_at', { ascending: true })

        if (error) {
            console.error('Error fetching messages:', error)
            return null
        }

        return this.structureMessages(data)
    },

    /**
     * Fetches a single message by ID with user details.
     * Useful for realtime updates where we only get the raw record.
     */
    async getMessageById(id) {
        const { data, error } = await supabase
            .from('message')
            .select('*, user(*)')
            .eq('id', id)
            .single()

        if (error) {
            console.error('Error fetching message:', error)
            return null
        }
        return data
    },

    /**
     * Structures flat list of messages into conversation threads/versions.
     */
    structureMessages(data) {
        if (!data) return []

        const msgMap = {}
        // First pass: Initialize versions array for all messages
        data.forEach(m => {
            m.versions = []
            msgMap[m.id] = m
        })

        const roots = []
        data.forEach(m => {
            if (m.original && msgMap[m.original]) {
                msgMap[m.original].versions.push(m)
            } else {
                roots.push(m)
            }
        })

        return roots
    },

    /**
     * Sends a new message.
     */
    async sendMessage(content, userId) {
        if (!content.trim()) return

        const { error } = await supabase
            .from('message')
            .insert({
                contenu: content,
                id_user: userId,
            })

        if (error) {
            console.error('Error sending message:', error)
            return error
        }
    },

    /**
     * Edits a message (creates a new version and updates the original).
     * @param {string} rootId - The ID of the original message being edited
     * @param {string} newContent - The new content
     * @param {string} userId - The ID of the user editing
     * @param {string} originalCreatedAt - The creation time of the root message (to keep ordering)
     */
    async editMessage(rootId, newContent, userId, originalCreatedAt) {
        // 1. Insert new version
        const { data: newMsgData, error: newMsgError } = await supabase
            .from('message')
            .insert({
                created_at: originalCreatedAt,
                contenu: newContent,
                id_user: userId,
                original: rootId,
            })
            .select()
            .single()

        if (newMsgError) {
            console.error('Error creating message version:', newMsgError)
            return newMsgError
        }

        // 2. Update parent to point to latest update
        const { error: updateError } = await supabase
            .from('message')
            .update({ updated: newMsgData.id, updated_at: new Date().toISOString() })
            .eq('id', rootId)

        if (updateError) {
            console.error('Error updating parent message:', updateError)
            return updateError
        }
    },

    /**
     * Helper to merge a new message (from realtime INSERT) into the structured state.
     */
    mergeNewMessage(currentMessages, newMessage) {
        // Initialize versions if missing
        newMessage.versions = newMessage.versions || []

        if (newMessage.original) {
            // It's a version/edit of an existing message. Find parent and append.
            const addToParent = (nodes) => {
                return nodes.map(node => {
                    if (node.id === newMessage.original) {
                        return {
                            ...node,
                            versions: [...(node.versions || []), newMessage]
                        }
                    }
                    if (node.versions && node.versions.length > 0) {
                        return {
                            ...node,
                            versions: addToParent(node.versions)
                        }
                    }
                    return node
                })
            }
            return addToParent(currentMessages)
        }

        // It's a new root message
        return [...currentMessages, newMessage]
    },

    /**
     * Helper to merge an updated message (from realtime UPDATE) into the structured state.
     */
    mergeUpdatedMessage(currentMessages, updatedPayload) {
        const updateNode = (nodes) => {
            return nodes.map(node => {
                if (node.id === updatedPayload.id) {
                    return { ...node, ...updatedPayload }
                }
                if (node.versions && node.versions.length > 0) {
                    return {
                        ...node,
                        versions: updateNode(node.versions)
                    }
                }
                return node
            })
        }
        return updateNode(currentMessages)
    },

    /**
     * Subscribes to database changes.
     * @param {Function} onInsert - Callback for INSERT events (payload) => void
     * @param {Function} onUpdate - Callback for UPDATE events (payload) => void
     * @returns {Object} - The subscription channel (call unsubscribe on unmount)
     */
    subscribeToChanges(onInsert, onUpdate) {
        return supabase
            .channel('schema-db-changes')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'message',
                },
                (payload) => onInsert(payload.new)
            )
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'message',
                },
                (payload) => onUpdate(payload.new)
            )
            .subscribe()
    },

    /**
     * Unsubscribes from the channel.
     */
    unsubscribe(channel) {
        supabase.removeChannel(channel)
    }

}
