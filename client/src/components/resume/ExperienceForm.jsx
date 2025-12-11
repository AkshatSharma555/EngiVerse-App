import React, { useState, useContext } from "react";
import { Plus, Trash2, Briefcase, Sparkles, Loader2 } from "lucide-react";
import { AppContent } from "../../context/AppContext"; // EngiVerse Context
import axios from "axios";
import { toast } from "react-toastify"; // EngiVerse Toast

const ExperienceForm = ({ data, onChange }) => {
  const { backendUrl } = useContext(AppContent);
  const [loadingIndex, setLoadingIndex] = useState(-1); // Tracks which item is loading AI

  const handleChange = (index, field, value) => {
    const newExperience = [...data];
    newExperience[index][field] = value;
    onChange(newExperience);
  };

  const handleAdd = () => {
    onChange([
      ...data,
      {
        company: "",
        position: "",
        start_date: "",
        end_date: "",
        description: "",
        is_current: false,
      },
    ]);
  };

  const handleRemove = (index) => {
    const newExperience = [...data];
    newExperience.splice(index, 1);
    onChange(newExperience);
  };

  // --- AI Enhance Logic for Job Description ---
  const handleEnhanceDescription = async (index, currentDescription) => {
    if (!currentDescription || currentDescription.length < 10) {
      toast.error("Please write a basic description first.");
      return;
    }

    setLoadingIndex(index);
    try {
      const { data: responseData } = await axios.post(
        `${backendUrl}/api/resume/enhance-job-description`, // Make sure this route exists or use generic
        { userContent: currentDescription },
        { withCredentials: true }
      );

      // Note: Agar backend me specific route nahi banaya, hum generic wala use kar sakte hain
      // Filhal assuming tumne 'enhance-summary' jaisa hi logic controller me copy kiya hoga.
      // Agar error aaye to mujhe batana, hum controller fix karenge.
      
      // For now, let's reuse the summary enhancer if specific one isn't there, 
      // OR better: use the one we created in controller.
      
      // Let's assume the route is /api/resume/enhance-summary for now as a fallback 
      // OR if you added enhanceJobDescription in controller, use that.
      
      // Using the generic AI endpoint we setup:
      const aiResponse = await axios.post(
         `${backendUrl}/api/resume/enhance-summary`, 
         { userContent: `Rewrite these job bullet points to be punchy and use action verbs: ${currentDescription}` }
      );

      if (aiResponse.data.success) {
        handleChange(index, "description", aiResponse.data.enhancedContent);
        toast.success("Description Enhanced!");
      }
    } catch (error) {
      console.error(error);
      toast.error("AI enhancement failed");
    } finally {
      setLoadingIndex(-1);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-slate-700">Work Experience</h2>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-700 font-medium"
        >
          <Plus className="size-4" /> Add Experience
        </button>
      </div>

      {data.map((exp, index) => (
        <div key={index} className="p-4 border border-gray-200 rounded-lg bg-gray-50/50 relative group">
          
          {/* Delete Button */}
          <button
            onClick={() => handleRemove(index)}
            className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
          >
            <Trash2 className="size-4" />
          </button>

          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase">Job Title</label>
              <input
                type="text"
                value={exp.position}
                onChange={(e) => handleChange(index, "position", e.target.value)}
                placeholder="e.g. Software Engineer"
                className="w-full mt-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase">Company</label>
              <input
                type="text"
                value={exp.company}
                onChange={(e) => handleChange(index, "company", e.target.value)}
                placeholder="e.g. Google"
                className="w-full mt-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase">Start Date</label>
              <input
                type="text" // using text to allow flexible formats or use date
                value={exp.start_date}
                onChange={(e) => handleChange(index, "start_date", e.target.value)}
                placeholder="e.g. Jan 2022"
                className="w-full mt-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase">End Date</label>
              <input
                type="text"
                disabled={exp.is_current}
                value={exp.is_current ? "Present" : exp.end_date}
                onChange={(e) => handleChange(index, "end_date", e.target.value)}
                placeholder="e.g. Dec 2023"
                className="w-full mt-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 outline-none disabled:bg-gray-100"
              />
              <div className="flex items-center gap-2 mt-2">
                 <input 
                    type="checkbox" 
                    checked={exp.is_current}
                    onChange={(e) => handleChange(index, "is_current", e.target.checked)}
                    id={`current-${index}`}
                 />
                 <label htmlFor={`current-${index}`} className="text-xs text-gray-600 cursor-pointer">I currently work here</label>
              </div>
            </div>
          </div>

          {/* Description with AI Button */}
          <div>
            <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-semibold text-gray-500 uppercase">Description</label>
                <button
                    onClick={() => handleEnhanceDescription(index, exp.description)}
                    disabled={loadingIndex === index}
                    className="text-xs flex items-center gap-1 text-fuchsia-600 hover:text-fuchsia-700 disabled:opacity-50"
                >
                    {loadingIndex === index ? <Loader2 className="animate-spin size-3"/> : <Sparkles className="size-3"/>}
                    Enhance with AI
                </button>
            </div>
            <textarea
              value={exp.description}
              onChange={(e) => handleChange(index, "description", e.target.value)}
              placeholder="• Developed features..."
              className="w-full h-24 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 outline-none resize-none text-sm"
            />
          </div>

        </div>
      ))}
      
      {data.length === 0 && (
          <div className="text-center p-8 border-2 border-dashed border-gray-200 rounded-lg text-gray-400">
              <Briefcase className="size-8 mx-auto mb-2 opacity-50"/>
              <p>No experience added yet</p>
          </div>
      )}
    </div>
  );
};

export default ExperienceForm;