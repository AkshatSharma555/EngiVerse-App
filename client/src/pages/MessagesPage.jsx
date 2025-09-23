// Filename: client/src/pages/MessagesPage.jsx (FINAL VERSION)

import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/ui/Navbar';
import { AppContent } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import ConversationList from '../components/chat/ConversationList';
import ChatWindow from '../components/chat/ChatWindow';

const MessagesPage = () => {
    const { backendUrl } = useContext(AppContent);
    let { recipientId } = useParams();

    // Final safety guard for the frontend
    if (recipientId === 'undefined') {
        recipientId = undefined;
    }

    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchConversations = useCallback(async () => {
        try {
            const response = await axios.get(`${backendUrl}/api/messages/conversations`);
            if (response.data.success) {
                setConversations(response.data.data);
            }
        } catch (error) {
            toast.error("Failed to load conversations.");
        } finally {
            setLoading(false);
        }
    }, [backendUrl]);

    useEffect(() => {
        setLoading(true);
        fetchConversations();
    }, [fetchConversations]);

    const currentConversation = conversations.find(c => c.participants[0]?._id === recipientId);
    const conversationId = currentConversation?._id;

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar theme="light" />
            <div className="container mx-auto max-w-7xl pt-20 sm:pt-24 h-screen">
                <div className="flex h-[calc(100vh-6rem)] bg-white rounded-t-xl border shadow-sm overflow-hidden">
                    
                    <aside className="w-full md:w-1/3 border-r border-gray-200 flex flex-col">
                        <div className="p-4 border-b">
                            <h1 className="text-xl font-bold text-gray-800">Chats</h1>
                        </div>
                        <div className="overflow-y-auto">
                           <ConversationList conversations={conversations} loading={loading} />
                        </div>
                    </aside>

                    <main className="hidden md:flex w-2/3 flex-col">
                        {recipientId ? (
                            <ChatWindow 
                                key={recipientId}
                                recipientId={recipientId} 
                                conversationId={conversationId}
                            />
                        ) : (
                            <div className="flex-1 flex flex-col justify-center items-center text-center p-4">
                                <div className="text-gray-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" fill="currentColor" className="mx-auto" viewBox="0 0 16 16"><path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.5a1 1 0 0 0-.8.4l-1.9 2.533a1 1 0 0 1-1.6 0L5.3 12.4a1 1 0 0 0-.8-.4H2a2 2 0 0 1-2-2V2zm3.5 1a.5.5 0 0 0 0 1h9a.5.5 0 0 0 0-1h-9zm0 2.5a.5.5 0 0 0 0 1h9a.5.5 0 0 0 0-1h-9zm0 2.5a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1h-5z"/></svg>
                                    <h2 className="mt-4 text-2xl font-semibold text-gray-800">EngiVerse Chat</h2>
                                    <p className="mt-2 text-gray-500">Select a conversation from the left to start messaging.</p>
                                </div>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default MessagesPage;