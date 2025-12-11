import React, { useState, useContext } from "react";
import { AppContent } from "../../context/AppContext"; // EngiVerse Context
import axios from "axios";
import { toast } from "react-toastify"; // Updated to Toastify
import { Sparkles, Loader2 } from "lucide-react";

const ProfessionalSummaryForm = ({ data, onChange }) => {
  const { backendUrl } = useContext(AppContent);
  const [loading, setLoading] = useState(false);
  const [aiSummary, setAiSummary] = useState(null);

  const handleGenerateSummary = async () => {
    // Basic validation
    if (!data || data.length < 10) {
      toast.error("Please write a few words first so AI can improve it.");
      return;
    }

    setLoading(true);
    try {
      const { data: responseData } = await axios.post(
        `${backendUrl}/api/resume/enhance-summary`,
        { userContent: data },
        { withCredentials: true } // Important for cookies/auth
      );

      if (responseData.success) {
        setAiSummary(responseData.enhancedContent);
        toast.success("AI Generated a suggestion!");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "AI generation failed");
    } finally {
      setLoading(false);
    }
  };

  const applySuggestion = () => {
    onChange(aiSummary);
    setAiSummary(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-slate-700">Professional Summary</h2>
        <button
          onClick={handleGenerateSummary}
          disabled={loading}
          className="flex items-center gap-2 text-sm bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white px-4 py-2 rounded-lg hover:opacity-90 transition-all disabled:opacity-70"
        >
          {loading ? (
            <Loader2 className="animate-spin size-4" />
          ) : (
            <Sparkles className="size-4" />
          )}
          {loading ? "Generating..." : "Enhance with AI"}
        </button>
      </div>

      <p className="text-sm text-slate-500">
        Write 2-3 sentences about your role, years of experience, and key achievements.
      </p>

      <textarea
        value={data}
        onChange={(e) => onChange(e.target.value)}
        placeholder="e.g. Passionate Full Stack Developer with 2 years of experience in MERN stack..."
        className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none"
      />

      {/* --- AI SUGGESTION BOX (Only shows if AI generated something) --- */}
      {aiSummary && (
        <div className="mt-4 p-4 bg-fuchsia-50 border border-fuchsia-200 rounded-lg animate-fadeIn">
          <div className="flex justify-between items-start mb-2">
            <h4 className="text-sm font-bold text-fuchsia-800 flex items-center gap-2">
              <Sparkles className="size-3" /> AI Suggestion
            </h4>
            <div className="flex gap-2">
                <button 
                    onClick={() => setAiSummary(null)}
                    className="text-xs text-slate-500 hover:text-slate-700"
                >
                    Discard
                </button>
                <button 
                    onClick={applySuggestion}
                    className="text-xs bg-fuchsia-600 text-white px-3 py-1 rounded hover:bg-fuchsia-700"
                >
                    Apply
                </button>
            </div>
          </div>
          <p className="text-sm text-slate-700 leading-relaxed">{aiSummary}</p>
        </div>
      )}
    </div>
  );
};

export default ProfessionalSummaryForm;