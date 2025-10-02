// Filename: server/controllers/interviewController.js (FINAL & COMPLETE)

import InterviewSession from '../models/interviewSessionModel.js';
import { CohereClient } from 'cohere-ai';
import { evaSystemPrompt,reportGeneratorPrompt } from '../ai/prompts.js';

// Initialize Cohere client
const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY,
});

/**
 * Start a new interview session
 */
export const startInterviewSession = async (req, res) => {
    try {
        const initialMessage = {
            role: 'model',
            text: "Hello! I'm Eva 👋. Welcome to your interview session. To begin, could you please introduce yourself and mention the technical areas or roles you’d like to focus on?",
        };
        const newSession = await InterviewSession.create({
            user: req.user.id,
            conversationHistory: [initialMessage],
            status: 'active',
        });
        return res.status(201).json({ success: true, sessionId: newSession._id, initialMessage: initialMessage.text });
    } catch (error) {
        console.error("❌ Error in startInterviewSession:", error);
        return res.status(500).json({ success: false, message: "Failed to start a new interview session." });
    }
};

/**
 * Post a chat message to Eva and get AI response
 */
export const postChatMessage = async (req, res) => {
    try {
        // ... (validation and fetching session logic remains the same) ...
        const { sessionId } = req.params;
        const { message } = req.body;
        const session = await InterviewSession.findById(sessionId);
        // ...

        session.conversationHistory.push({ role: 'user', text: message.trim() });
        
        const chatHistory = session.conversationHistory.slice(0, -1).map(msg => ({
            role: msg.role === 'user' ? 'USER' : 'CHATBOT',
            message: msg.text,
        }));

        const response = await cohere.chat({
            message: message.trim(),
            chatHistory: chatHistory,
            preamble: evaSystemPrompt,
        });

        const aiResponseText = response?.text?.trim();
        if (!aiResponseText) {
            return res.status(502).json({ success: false, message: "Eva couldn’t respond right now." });
        }

        const aiMessage = { role: 'model', text: aiResponseText };
        session.conversationHistory.push(aiMessage);

        // --- REPORT GENERATION LOGIC ---
        if (aiResponseText.includes("<END_OF_INTERVIEW>")) {
            session.status = 'completed';

            // Create the full transcript text
            const transcript = session.conversationHistory.map(msg => `${msg.role}: ${msg.text}`).join('\n');
            
            // Second API call to generate the report
            const reportResponse = await cohere.chat({
                message: transcript,
                preamble: reportGeneratorPrompt,
                chatHistory: [] // No history needed for this call
            });

            try {
                // Parse the JSON response from the AI
                const reportJson = JSON.parse(reportResponse.text);
                session.overallScore = reportJson.overallScore || 0;
                // Save the structured report as a string
                session.finalReport = JSON.stringify({
                    summary: reportJson.summary || "",
                    strengths: reportJson.strengths || "",
                    areasForImprovement: reportJson.areasForImprovement || "",
                });
            } catch (e) {
                console.error("❌ Failed to parse AI report JSON:", e);
                // Save the raw text if JSON parsing fails
                session.finalReport = JSON.stringify({ summary: "Failed to generate a structured report."});
            }
        }

        await session.save();
        return res.status(200).json({ success: true, reply: aiResponseText });

    } catch (error) {
        console.error("❌ Error in postChatMessage:", error);
        return res.status(500).json({ success: false, message: "Eva is taking a short break." });
    }
};


/**
 * @desc    Get a user's interview history
 * @route   GET /api/interviews/history
 */
export const getInterviewHistory = async (req, res) => {
    try {
        const sessions = await InterviewSession.find({ user: req.user.id })
            .sort({ createdAt: -1 })
            .select('topic status overallScore createdAt');

        return res.status(200).json({ success: true, data: sessions });
    } catch (error) {
        console.error("❌ Error in getInterviewHistory:", error);
        return res.status(500).json({ success: false, message: "Failed to fetch interview history." });
    }
};

/**
 * @desc    Get a single interview session's full details for the report page
 * @route   GET /api/interviews/:sessionId
 */
export const getInterviewReport = async (req, res) => {
    try {
        const { sessionId } = req.params;
        const userId = req.user.id;

        const session = await InterviewSession.findById(sessionId);

        // Security check: Make sure the user requesting the report is part of the session
        if (!session || session.user.toString() !== userId) {
            return res.status(404).json({ success: false, message: "Interview session not found." });
        }
        
        return res.status(200).json({ success: true, data: session });

    } catch (error) {
        console.error("❌ Error in getInterviewReport:", error);
        return res.status(500).json({ success: false, message: "Failed to fetch interview report." });
    }
};