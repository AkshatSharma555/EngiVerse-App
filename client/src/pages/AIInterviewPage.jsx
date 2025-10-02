// Filename: client/src/pages/AIInterviewPage.jsx

import React, { useState, useEffect, useContext, useRef } from 'react';
import { AppContent } from '../context/AppContext';
import axios from 'axios';
import useSpeechRecognition from '../hooks/useSpeechRecognition';
import { Link, useLocation } from 'react-router-dom';

// Helper Components & Icons
const MicIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16"><path d="M5 3a3 3 0 0 1 6 0v5a3 3 0 0 1-6 0V3z"/><path d="M3.5 6.5A.5.5 0 0 1 4 7v1a4 4 0 0 0 8 0V7a.5.5 0 0 1 1 0v1a5 5 0 0 1-4.5 4.975V15h3a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1h3v-2.025A5 5 0 0 1 3 8V7a.5.5 0 0 1 .5-.5z"/></svg>;
const StopIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16"><rect width="10" height="10" x="3" y="3" rx="1"/></svg>;
const SendIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16"><path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11z"/></svg>;
const EvaAvatar = () => <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold text-lg shadow-md flex-shrink-0">E</div>;


const AIInterviewPage = () => {
    const { backendUrl } = useContext(AppContent);
    const { text, setText, isListening, startListening, stopListening, hasRecognitionSupport } = useSpeechRecognition();
    const location = useLocation(); // To get state from the previous page

    const [sessionId, setSessionId] = useState(null);
    const [history, setHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const messagesEndRef = useRef(null);

    const { domain, voice } = location.state || { domain: 'General', voice: 'female' };

    const speak = (textToSpeak) => {
        try {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(textToSpeak);
            const voices = window.speechSynthesis.getVoices();
            if (voice === 'male') {
                utterance.voice = voices.find(v => v.name.includes("Google") && v.lang.startsWith('en') && v.name.includes('Male')) || voices.find(v => v.lang.startsWith('en') && v.name.includes('Male')) || voices[2];
            } else {
                utterance.voice = voices.find(v => v.name.includes("Google") && v.lang.startsWith('en') && v.name.includes('Female')) || voices.find(v => v.lang.startsWith('en') && v.name.includes('Female')) || voices[1];
            }
            window.speechSynthesis.speak(utterance);
        } catch (error) {
            console.error("Speech synthesis failed", error);
        }
    };

    useEffect(() => {
        const startSession = async () => {
            try {
                // We pass the selected domain to the start endpoint
                const response = await axios.post(`${backendUrl}/api/interviews/start`, { domain });
                if (response.data.success) {
                    const { sessionId, initialMessage } = response.data;
                    setSessionId(sessionId);
                    setHistory([{ role: 'model', text: initialMessage }]);
                    // Wait a bit for voices to load
                    setTimeout(() => speak(initialMessage), 100);
                }
            } catch (error) {
                console.error("Failed to start session", error);
            } finally {
                setIsLoading(false);
            }
        };
        startSession();

        // Cleanup function to stop speaking if user navigates away
        return () => window.speechSynthesis.cancel();
    }, [backendUrl, domain]);
    
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [history]);

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
        <div className="flex flex-col h-screen bg-slate-900 text-white font-sans">
            <header className="flex items-center justify-between p-4 border-b border-slate-700 flex-shrink-0">
                <Link to="/ai-interviewer" className="text-2xl font-bold text-white flex items-center gap-2">
                    <span className="text-indigo-400">Engi</span>Verse <span className="text-sm font-light text-slate-400">AI Interview</span>
                </Link>
                <div className="flex items-center gap-2 text-green-400 animate-fade-in">
                    <span className="relative flex h-3 w-3"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span></span>
                    Live
                </div>
            </header>

            <main className="flex-1 p-6 overflow-y-auto">
                <div className="space-y-8 max-w-4xl mx-auto w-full">
                    {history.map((msg, index) => (
                        <div key={index} className={`flex gap-4 animate-fade-in-up ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            {msg.role === 'model' && <EvaAvatar />}
                            <div className={`max-w-xl lg:max-w-2xl p-4 rounded-xl shadow-md ${msg.role === 'user' ? 'bg-indigo-600 rounded-br-none' : 'bg-slate-700 rounded-bl-none'}`}>
                                <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                            </div>
                        </div>
                    ))}
                    {isLoading && <div className="flex gap-4 justify-start animate-fade-in-up"> <EvaAvatar /> <div className="p-4 rounded-xl bg-slate-700 rounded-bl-none flex items-center"> <div className="animate-pulse flex space-x-1.5"> <div className="w-2.5 h-2.5 bg-slate-400 rounded-full"></div> <div className="w-2.5 h-2.5 bg-slate-400 rounded-full animation-delay-200"></div> <div className="w-2.5 h-2.5 bg-slate-400 rounded-full animation-delay-400"></div> </div> </div> </div>}
                    <div ref={messagesEndRef} />
                </div>
            </main>
            
          <footer className="p-4 border-t border-slate-700 flex-shrink-0">
                    <div className="flex items-center gap-4 max-w-3xl mx-auto">
                        <textarea
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            className="flex-1 w-full p-3 rounded-lg bg-slate-800 border border-slate-600 resize-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder={isListening ? "Listening... Speak now." : "Your transcribed answer will appear here..."}
                            rows="2"
                            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(text); } }}
                        />
                        {hasRecognitionSupport ? (
                            <button
                                onClick={isListening ? stopListening : startListening}
                                className={`p-4 rounded-full transition-colors ${isListening ? 'bg-red-500 hover:bg-red-600 animate-pulse' : 'bg-indigo-600 hover:bg-indigo-700'}`}
                            >
                                {/* --- THIS IS THE FIX --- */}
                                {isListening ? <StopIcon /> : <MicIcon />}
                            </button>
                        ) : <p className="text-sm text-red-400">Voice input not supported.</p>}
                        <button 
                            onClick={() => handleSend(text)} 
                            disabled={isLoading || isListening || !text.trim()} 
                            className="px-5 py-4 bg-green-600 rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-500 disabled:cursor-not-allowed"
                        >
                            <SendIcon/>
                        </button>
                    </div>
                </footer>
        </div>
    );
};

export default AIInterviewPage;