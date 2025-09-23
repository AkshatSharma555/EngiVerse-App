import React, { useState, useEffect, useContext, useRef, useCallback } from 'react';
import { AppContent } from '../../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

// --- Helper Components & Icons ---
const Spinner = () => <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>;
const ThreeDotsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/></svg>;
const PaperclipIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" viewBox="0 0 16 16"><path d="M4.5 3a2.5 2.5 0 0 1 5 0v9a1.5 1.5 0 0 1-3 0V5a.5.5 0 0 1 1 0v7a.5.5 0 0 0 1 0V3a1.5 1.5 0 1 0-3 0v9a2.5 2.5 0 0 0 5 0V5a.5.5 0 0 1 1 0v7a3.5 3.5 0 1 1-7 0V3z"/></svg>;
const DownloadIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/><path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/></svg>;

// --- Confirmation Modal Component ---
const ClearChatModal = ({ onClose, onConfirm, isClearing }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-sm mx-4">
                <h3 className="text-lg font-bold">Clear Chat History</h3>
                <p className="text-sm text-gray-600 mt-2">Are you sure? This action cannot be undone.</p>
                <div className="mt-6 space-y-3">
                    <button onClick={() => onConfirm('for_me')} disabled={isClearing} className="w-full px-4 py-2 bg-yellow-500 text-white font-semibold rounded-lg hover:bg-yellow-600 disabled:bg-yellow-300">
                        {isClearing ? 'Clearing...' : 'Delete for Me'}
                    </button>
                    <button onClick={() => onConfirm('for_everyone')} disabled={isClearing} className="w-full px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 disabled:bg-red-400">
                        {isClearing ? 'Deleting...' : 'Delete for Everyone'}
                    </button>
                    <button onClick={onClose} disabled={isClearing} className="w-full px-4 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300">
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

const ChatWindow = ({ recipientId, conversationId }) => {
    const { backendUrl, user, socket } = useContext(AppContent);
    const [recipientProfile, setRecipientProfile] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [showClearConfirm, setShowClearConfirm] = useState(false);
    const [isClearing, setIsClearing] = useState(false);
    
    const messagesEndRef = useRef(null);
    const fileInputRef = useRef(null);

    const fetchChatData = useCallback(async () => {
        if (!recipientId) return;
        setLoading(true);
        try {
            const [profileRes, messagesRes] = await Promise.all([
                axios.get(`${backendUrl}/api/profile/${recipientId}`),
                axios.get(`${backendUrl}/api/messages/${recipientId}`)
            ]);
            if (profileRes.data.success) setRecipientProfile(profileRes.data.data);
            if (messagesRes.data.success) setMessages(messagesRes.data.data);
        } catch (error) {
            toast.error("Failed to load chat data.");
        } finally {
            setLoading(false); 
        }
    }, [recipientId, backendUrl]);

    useEffect(() => { fetchChatData(); }, [fetchChatData]);
    
    useEffect(() => {
        if (socket) {
            const handleNewMessage = (newMessage) => {
                // Add message if it belongs to the current conversation
                if (newMessage.sender === recipientId || newMessage.sender === user._id) {
                    setMessages(prev => [...prev, newMessage]);
                }
            };
            socket.on("newMessage", handleNewMessage);
            return () => socket.off("newMessage", handleNewMessage);
        }
    }, [socket, recipientId, user._id]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);
    
    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;
        const tempId = Date.now().toString();
        const tempMessage = { _id: tempId, sender: user._id, content: newMessage, type: 'text', createdAt: new Date().toISOString() };
        setMessages(prev => [...prev, tempMessage]);
        setNewMessage("");
        try {
            const response = await axios.post(`${backendUrl}/api/messages/send/${recipientId}`, { text: tempMessage.content });
            if (response.data.success) {
                // Replace temp message with the real one from server to get correct _id and timestamp
                setMessages(prev => prev.map(msg => msg._id === tempId ? response.data.data : msg));
            }
        } catch (error) {
            toast.error("Message failed to send.");
            setMessages(prev => prev.filter(msg => msg._id !== tempId));
        }
    };

    const handleFileSend = async (file) => {
        if (!file) return;
        setIsUploading(true);
        toast.info("Uploading file...");
        const formData = new FormData();
        formData.append("file", file);
        try {
            await axios.post(`${backendUrl}/api/messages/send-file/${recipientId}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            toast.success("File sent successfully!");
        } catch (error) {
            toast.error(error.response?.data?.message || "File upload failed.");
        } finally {
            setIsUploading(false);
            if(fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    const handleClearChat = async (mode) => {
        if (!conversationId) return toast.error("Cannot clear a new chat.");
        setIsClearing(true);
        try {
            await axios.put(`${backendUrl}/api/messages/clear/${conversationId}`, { mode });
            setMessages([]); 
            toast.success("Chat history cleared.");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to clear chat.");
        } finally {
            setIsClearing(false);
            setShowClearConfirm(false); 
        }
    };

    const renderMessageContent = (msg) => {
    switch (msg.type) {
        case 'image':
            return (
                <a href={msg.content} target="_blank" rel="noopener noreferrer">
                    <img src={msg.content} alt="Sent file" className="max-w-xs rounded-lg cursor-pointer" />
                </a>
            );
        case 'document':
            // No need to replace the URL anymore, the backend provides the correct one now.
            return (
                <a href={msg.content} target="_blank" rel="noopener noreferrer" download={msg.fileName} className="flex items-center gap-3 p-3 bg-gray-200 rounded-lg hover:bg-gray-300 text-gray-900 no-underline">
                    <DownloadIcon /> 
                    <span className="font-semibold">{msg.fileName}</span>
                </a>
            );
        default:
            return msg.content;
    }
};

    if (loading) return <div className="flex-1 flex justify-center items-center"><Spinner /></div>;
    
    return (
        <div className="flex flex-col h-full bg-gray-50">
            {showClearConfirm && <ClearChatModal onClose={() => setShowClearConfirm(false)} onConfirm={handleClearChat} isClearing={isClearing} />}
            
            <div className="flex items-center justify-between p-4 border-b bg-white">
                <Link to={`/profile/${recipientProfile?._id}`} className="flex items-center gap-4 group">
                    <img src={recipientProfile?.profilePicture || `https://api.dicebear.com/7.x/initials/svg?seed=${recipientProfile?.name}`} alt="Recipient" className="w-12 h-12 rounded-full object-cover"/>
                    <div><h2 className="font-bold text-lg text-gray-800 group-hover:text-indigo-600">{recipientProfile?.name}</h2></div>
                </Link>
                <div className="relative">
                           <button 
                        onClick={() => setIsMenuOpen(prev => !prev)} 
                        className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                    >
                        <ThreeDotsIcon />
                    </button>
                    {isMenuOpen && (
                        <div 
                            className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border z-10"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            <button 
                                onClick={() => setShowClearConfirm(true)} 
                                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                            >
                                Clear Chat
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex-1 p-4 overflow-y-auto">
                {messages.map(msg => (
                    <div key={msg._id} className={`flex my-2 ${msg.sender === user._id ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-xs md:max-w-md p-3 rounded-2xl shadow-sm ${msg.sender === user._id ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-white text-gray-800 border rounded-bl-none'}`}>
                            {renderMessageContent(msg)}
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            
            <div className="p-4 bg-white border-t">
                <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={(e) => handleFileSend(e.target.files[0])} 
                        className="hidden" 
                    />
                    <button 
                        type="button" 
                        onClick={() => fileInputRef.current.click()} 
                        disabled={isUploading} 
                        className="p-3 rounded-full hover:bg-gray-100 text-gray-500 disabled:opacity-50"
                    >
                        <PaperclipIcon />
                    </button>
                    <input 
                        type="text" 
                        value={newMessage} 
                        onChange={(e) => setNewMessage(e.target.value)} 
                        placeholder={isUploading ? "Uploading..." : "Type a message..."} 
                        className="flex-1 p-3 rounded-full border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 bg-gray-100" 
                        disabled={isUploading} 
                    />
                    <button 
                        type="submit" 
                        disabled={isUploading || !newMessage.trim()} 
                        className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-full hover:bg-indigo-700 disabled:bg-indigo-400"
                    >
                        Send
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChatWindow;