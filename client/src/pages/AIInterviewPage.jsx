import React, { useState, useEffect, useContext, useRef } from 'react';
import { AppContent } from '../context/AppContext';
import axios from 'axios';
import useSpeechRecognition from '../hooks/useSpeechRecognition';
import { Link, useLocation, useNavigate } from 'react-router-dom';

// --- Premium Icons ---
const MicIcon = ({ active }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16" className={active ? "animate-pulse" : ""}>
        <path d="M5 3a3 3 0 0 1 6 0v5a3 3 0 0 1-6 0V3z"/><path d="M3.5 6.5A.5.5 0 0 1 4 7v1a4 4 0 0 0 8 0V7a.5.5 0 0 1 1 0v1a5 5 0 0 1-4.5 4.975V15h3a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1h3v-2.025A5 5 0 0 1 3 8V7a.5.5 0 0 1 .5-.5z"/>
    </svg>
);
const StopIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16"><rect width="10" height="10" x="3" y="3" rx="1"/></svg>;
const SendIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11z"/></svg>;
const ExitIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/></svg>;

// --- UI Components ---
const EvaAvatar = () => (
    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg flex-shrink-0 ring-2 ring-white/10">
        E
    </div>
);

const TypingIndicator = () => (
    <div className="flex space-x-1.5 p-2">
        <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
    </div>
);

const AIInterviewPage = () => {
    const { backendUrl } = useContext(AppContent);
    const { text, setText, isListening, startListening, stopListening, hasRecognitionSupport } = useSpeechRecognition();
    const location = useLocation();
    const navigate = useNavigate();

    const [sessionId, setSessionId] = useState(null);
    const [history, setHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const messagesEndRef = useRef(null);

    // Get params from navigation state. Default to female if accessed directly (fallback)
    const { voice, sessionId: existingSessionId, isResuming } = location.state || { voice: 'female' };

    // --- 1. UX: Redirect if no state found (Direct URL access) ---
    useEffect(() => {
        if (!location.state) {
            navigate('/dashboard'); 
        }
    }, [location.state, navigate]);

    // --- 2. LOGIC: Robust Voice Handler (Fixes Silent Issue) ---
    const speak = (textToSpeak) => {
        if (!textToSpeak) return;
        
        // Stop any previous speech
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(textToSpeak);
        
        const setVoiceAndSpeak = () => {
            const allVoices = window.speechSynthesis.getVoices();
            
            // Safety Check: If browser hasn't loaded voices yet
            if (allVoices.length === 0) return;

            // Filter for English voices only
            const englishVoices = allVoices.filter(v => v.lang.includes('en'));
            
            let selectedVoice = null;

            if (voice === 'male') {
                // Try specific high-quality male voices often found in OS
                selectedVoice = englishVoices.find(v => 
                    v.name.toLowerCase().includes('google us english') || 
                    v.name.toLowerCase().includes('david') || 
                    v.name.toLowerCase().includes('male')
                );
            } else {
                // Try specific high-quality female voices
                selectedVoice = englishVoices.find(v => 
                    v.name.toLowerCase().includes('google uk english female') || 
                    v.name.toLowerCase().includes('zira') || 
                    v.name.toLowerCase().includes('female')
                );
            }

            // FALLBACK: If preferred gender not found, use the first available English voice
            if (!selectedVoice) {
                console.warn("Preferred voice not found, using fallback.");
                selectedVoice = englishVoices[0] || allVoices[0];
            }

            utterance.voice = selectedVoice;
            utterance.rate = 1; // Normal speed
            utterance.pitch = voice === 'male' ? 0.9 : 1.05; // Slight pitch adjustment for realism

            window.speechSynthesis.speak(utterance);
        };

        // Browser Compatibility: Chrome needs onvoiceschanged
        if (window.speechSynthesis.getVoices().length > 0) {
            setVoiceAndSpeak();
        } else {
            window.speechSynthesis.onvoiceschanged = setVoiceAndSpeak;
        }
    };

    // --- 3. LOGIC: Initialize Session (New vs Resume) ---
    useEffect(() => {
        const initSession = async () => {
            setIsLoading(true);
            try {
                if (isResuming && existingSessionId) {
                    // RESUME LOGIC: Fetch old history
                    const response = await axios.get(`${backendUrl}/api/interviews/${existingSessionId}`);
                    if (response.data.success) {
                        setSessionId(existingSessionId);
                        const fetchedHistory = response.data.data.conversationHistory;
                        setHistory(fetchedHistory);
                        // Note: We don't auto-speak on resume to avoid jarring the user
                    }
                } else {
                    // NEW SESSION LOGIC
                    const response = await axios.post(`${backendUrl}/api/interviews/start`);
                    if (response.data.success) {
                        const { sessionId, initialMessage } = response.data;
                        setSessionId(sessionId);
                        setHistory([{ role: 'model', text: initialMessage }]);
                        speak(initialMessage);
                    }
                }
            } catch (error) {
                console.error("Failed to initialize session", error);
            } finally {
                setIsLoading(false);
            }
        };

        initSession();

        // Cleanup: Stop speaking when leaving page
        return () => window.speechSynthesis.cancel();
    }, [backendUrl, existingSessionId, isResuming]); // Removed 'voice' dependency to prevent restart on re-render
    
    // Auto-scroll logic
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [history, isLoading]);

    const handleSend = async (messageText) => {
        if (!messageText.trim() || !sessionId || isLoading) return;
        if (isListening) stopListening();

        const userMessage = { role: 'user', text: messageText };
        setHistory(prev => [...prev, userMessage]);
        setText('');
        setIsLoading(true);

        try {
            const response = await axios.post(`${backendUrl}/api/interviews/chat/${sessionId}`, { message: messageText });
            if (response.data.success) {
                const aiReply = { role: 'model', text: response.data.reply };
                setHistory(prev => [...prev, aiReply]);
                speak(aiReply.text);
            }
        } catch (error) {
            console.error("Error communicating with AI", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-screen bg-[#0F1117] text-white font-sans overflow-hidden">
            
            {/* --- UX: Premium Header --- */}
            <header className="absolute top-0 w-full z-20 px-6 py-4 flex items-center justify-between bg-[#0F1117]/80 backdrop-blur-md border-b border-white/5">
                <button 
                    onClick={() => navigate('/dashboard')} 
                    className="group flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-medium px-3 py-2 rounded-lg hover:bg-white/5"
                >
                    <ExitIcon /> 
                    <span className="group-hover:translate-x-0.5 transition-transform">Exit Session</span>
                </button>
                
                <div className="flex items-center gap-3 px-4 py-1.5 bg-indigo-500/10 rounded-full border border-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.3)]">
                    <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-indigo-500"></span>
                    </span>
                    <span className="text-xs font-bold text-indigo-300 tracking-wide uppercase">
                        {isResuming ? 'Resumed' : 'Live Interview'}
                    </span>
                </div>
            </header>

            {/* --- UX: Chat Area --- */}
            <main className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent pt-24 pb-32 px-4 sm:px-6">
                <div className="max-w-3xl mx-auto space-y-6">
                    
                    {/* Welcome/Date divider for context */}
                    <div className="flex justify-center">
                        <span className="text-xs font-medium text-slate-500 bg-white/5 px-3 py-1 rounded-full">
                            {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
                        </span>
                    </div>

                    {history.map((msg, index) => (
                        <div key={index} className={`flex gap-4 animate-fade-in-up ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            
                            {/* AI Avatar */}
                            {msg.role === 'model' && <EvaAvatar />}
                            
                            {/* Message Bubble */}
                            <div className={`max-w-[85%] sm:max-w-[75%] p-4 rounded-2xl shadow-md text-[15px] leading-relaxed relative group
                                ${msg.role === 'user' 
                                    ? 'bg-gradient-to-br from-indigo-600 to-blue-600 text-white rounded-br-none' 
                                    : 'bg-[#1E212B] text-slate-200 border border-white/5 rounded-bl-none'
                                }`}>
                                <p className="whitespace-pre-wrap">{msg.text}</p>
                                {/* Timestamp on hover */}
                                <div className={`absolute bottom-1 text-[10px] opacity-0 group-hover:opacity-60 transition-opacity ${msg.role === 'user' ? 'left-2 text-indigo-100' : 'right-2 text-slate-400'}`}>
                                    Just now
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* AI Typing Indicator */}
                    {isLoading && (
                         <div className="flex gap-4 justify-start animate-fade-in-up">
                            <EvaAvatar />
                            <div className="p-3 rounded-2xl bg-[#1E212B] border border-white/5 rounded-bl-none flex items-center">
                                <TypingIndicator />
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </main>
            
            {/* --- UX: Floating Input Bar --- */}
            <footer className="absolute bottom-0 w-full z-20 p-4 sm:p-6 bg-gradient-to-t from-[#0F1117] via-[#0F1117] to-transparent">
                <div className="max-w-3xl mx-auto relative bg-[#1E212B]/90 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl p-2 flex items-end gap-2">
                    
                    {/* Text Area */}
                    <textarea 
                        value={text} 
                        onChange={(e) => setText(e.target.value)} 
                        className="flex-1 bg-transparent border-0 text-white placeholder-slate-500 focus:ring-0 resize-none py-3 px-4 max-h-32 min-h-[52px]" 
                        placeholder={isListening ? "Listening... Speak now." : "Type your answer..."} 
                        rows="1"
                        onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(text); } }}
                    />

                    {/* Mic Button */}
                    {hasRecognitionSupport && (
                        <button 
                            onClick={isListening ? stopListening : startListening} 
                            className={`p-3 rounded-xl transition-all duration-300 flex-shrink-0 ${
                                isListening 
                                    ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30 ring-1 ring-red-500/50' 
                                    : 'hover:bg-white/5 text-slate-400 hover:text-indigo-400'
                            }`}
                            title="Toggle Voice Input"
                        >
                            {isListening ? <MicIcon active={true} /> : <MicIcon active={false} />}
                        </button>
                    )}
                    
                    {/* Send Button */}
                    <button 
                        onClick={() => handleSend(text)} 
                        disabled={isLoading || isListening || !text.trim()} 
                        className="p-3 bg-indigo-600 rounded-xl text-white shadow-lg hover:bg-indigo-500 hover:shadow-indigo-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95 flex-shrink-0"
                    >
                        <SendIcon/>
                    </button>
                </div>
            </footer>
        </div>
    );
};

export default AIInterviewPage;