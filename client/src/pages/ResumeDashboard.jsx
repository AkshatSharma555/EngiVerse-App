import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContent } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { Plus, FileText, Trash2, Loader2, Edit, Edit3, X } from "lucide-react"; 
import Navbar from "../components/ui/Navbar";

const ResumeDashboard = () => {
  const { backendUrl } = useContext(AppContent);
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // --- MODAL STATE ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create"); // 'create' or 'rename'
  const [resumeTitleInput, setResumeTitleInput] = useState("");
  const [selectedResumeId, setSelectedResumeId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch All Resumes
  const fetchResumes = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/resume/all`);
      if (data.success) {
        setResumes(data.resumes);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResumes();
  }, [backendUrl]);

  // --- HANDLERS ---

  // Open Modal for Create
  const openCreateModal = () => {
      setModalMode("create");
      setResumeTitleInput("");
      setIsModalOpen(true);
  };

  // Open Modal for Rename
  const openRenameModal = (e, resume) => {
      e.stopPropagation(); // Card click na ho jaye
      setModalMode("rename");
      setResumeTitleInput(resume.title);
      setSelectedResumeId(resume._id);
      setIsModalOpen(true);
  };

  // Submit Modal (Create or Rename)
  const handleModalSubmit = async (e) => {
      e.preventDefault();
      
      if (!resumeTitleInput.trim()) {
          toast.error("Please enter a valid name");
          return;
      }

      setIsSubmitting(true);

      try {
          if (modalMode === "create") {
              // --- CREATE LOGIC ---
              const { data } = await axios.post(`${backendUrl}/api/resume/create`, {
                  title: resumeTitleInput
              });
              if (data.success) {
                  toast.success("Workspace Created!");
                  setIsModalOpen(false);
                  navigate(`/resume/builder/${data.resume._id}`);
              }
          } else {
              // --- RENAME LOGIC ---
              // Hum existing update API use karenge, bas sirf title bhejenge
              // Backend existing data ko overwrite nahi karega agar hum sirf title bhejein (kyunki mongoose update logic)
              // Lekin safe side ke liye humein ensure karna hai backend partial updates support kare.
              // Current ResumeController logic: `resumeData` string parse karta hai.
              
              const payload = {
                  title: resumeTitleInput
              };

              const formData = new FormData();
              formData.append("resumeId", selectedResumeId);
              formData.append("resumeData", JSON.stringify(payload)); 

              const { data } = await axios.put(`${backendUrl}/api/resume/update`, formData);
              
              if (data.success) {
                  toast.success("Resume Renamed!");
                  // Update UI locally without refresh
                  setResumes(prev => prev.map(r => r._id === selectedResumeId ? { ...r, title: resumeTitleInput } : r));
                  setIsModalOpen(false);
              }
          }
      } catch (error) {
          console.error(error);
          toast.error("Operation failed. Try again.");
      } finally {
          setIsSubmitting(false);
      }
  };

  // Delete Resume
  const handleDelete = async (e, id) => {
    e.stopPropagation(); 
    if(!window.confirm("Are you sure? This cannot be undone.")) return;

    try {
        await axios.delete(`${backendUrl}/api/resume/delete/${id}`);
        setResumes(prev => prev.filter(r => r._id !== id));
        toast.success("Resume deleted");
    } catch (error) {
        toast.error("Failed to delete");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 relative">
      <Navbar theme="light" />
      
      {/* --- MAIN CONTENT --- */}
      <div className="container mx-auto max-w-7xl pt-24 px-6">
        
        <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-800">My Resumes</h1>
            <p className="text-slate-500">Manage your CVs and AI drafts</p>
        </div>

        {loading ? (
            <div className="flex justify-center mt-20"><Loader2 className="animate-spin size-8 text-indigo-600"/></div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 pb-10">
                
                {/* Create New Card */}
                <div 
                    onClick={openCreateModal}
                    className="group cursor-pointer min-h-[280px] border-2 border-dashed border-indigo-300 rounded-xl flex flex-col items-center justify-center bg-indigo-50/50 hover:bg-indigo-50 transition-all hover:border-indigo-400"
                >
                    <div className="bg-white p-4 rounded-full mb-4 shadow-sm group-hover:scale-110 transition-transform group-hover:shadow-md">
                        <Plus className="size-8 text-indigo-600" />
                    </div>
                    <h3 className="font-semibold text-indigo-900">Create New Resume</h3>
                    <p className="text-xs text-indigo-500 mt-1">Start from scratch</p>
                </div>

                {/* Existing Resumes List */}
                {resumes.map((resume) => (
                    <div 
                        key={resume._id}
                        className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-lg transition-all group flex flex-col"
                    >
                        {/* Preview Area */}
                        <div 
                            onClick={() => navigate(`/resume/builder/${resume._id}`)}
                            className="h-40 bg-slate-100 flex items-center justify-center border-b border-slate-100 cursor-pointer relative overflow-hidden"
                        >
                             {resume.personal_info?.image ? (
                                <img src={resume.personal_info.image} alt="profile" className="h-full w-full object-cover opacity-90 transition-transform group-hover:scale-105" />
                             ) : (
                                <FileText className="size-12 text-slate-300" />
                             )}
                             
                             {/* Hover Overlay */}
                             <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <span className="bg-white/90 text-slate-700 px-3 py-1 rounded-full text-xs font-semibold shadow-sm backdrop-blur-sm">Open Editor</span>
                             </div>
                        </div>
                        
                        {/* Info Area */}
                        <div className="p-4 flex-grow relative">
                            <div className="flex justify-between items-start gap-2">
                                {/* Title with Rename Logic */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 group/title">
                                        <h3 className="font-bold text-slate-800 truncate" title={resume.title}>
                                            {resume.title || "Untitled Resume"}
                                        </h3>
                                        <button 
                                            onClick={(e) => openRenameModal(e, resume)}
                                            className="opacity-0 group-hover/title:opacity-100 text-slate-400 hover:text-indigo-600 transition-opacity"
                                            title="Rename Resume"
                                        >
                                            <Edit3 size={14} />
                                        </button>
                                    </div>
                                    <p className="text-xs text-slate-500 mt-1">Edited: {new Date(resume.updatedAt).toLocaleDateString()}</p>
                                </div>
                            </div>
                            
                            <div className="flex gap-2 mt-3">
                                <span className={`text-[10px] px-2 py-1 rounded-full font-medium border ${resume.public ? 'bg-green-50 text-green-700 border-green-100' : 'bg-slate-50 text-slate-600 border-slate-100'}`}>
                                    {resume.public ? 'Public' : 'Private'}
                                </span>
                            </div>
                        </div>

                        {/* Action Buttons Footer */}
                        <div className="p-3 border-t border-slate-100 flex gap-2 bg-slate-50/50">
                             <button 
                                onClick={() => navigate(`/resume/builder/${resume._id}`)}
                                className="flex-1 flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-700 py-2 rounded-lg text-sm font-medium hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-all shadow-sm"
                             >
                                <Edit size={14} /> Edit
                             </button>
                             <button 
                                onClick={(e) => handleDelete(e, resume._id)}
                                className="p-2 bg-white border border-slate-200 text-slate-400 hover:text-red-600 hover:bg-red-50 hover:border-red-200 rounded-lg transition-all shadow-sm"
                                title="Delete Resume"
                             >
                                <Trash2 size={16} />
                             </button>
                        </div>
                    </div>
                ))}
            </div>
        )}
      </div>

      {/* --- CUSTOM MODAL (Create/Rename) --- */}
      {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fadeIn">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all scale-100 animate-scaleIn">
                  
                  {/* Modal Header */}
                  <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                      <h3 className="text-lg font-bold text-slate-800">
                          {modalMode === 'create' ? "Create New Resume" : "Rename Resume"}
                      </h3>
                      <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                          <X size={20} />
                      </button>
                  </div>

              {/* Modal Form */}
                  <form onSubmit={handleModalSubmit} className="p-6">
                      <div className="mb-4">
                          <label className="block text-sm font-medium text-slate-700 mb-2">Resume Name</label>
                          <input 
                              type="text" 
                              autoFocus
                              value={resumeTitleInput}
                              onChange={(e) => setResumeTitleInput(e.target.value)}
                              placeholder="e.g. Full Stack Developer CV"
                              // --- CHANGE IS HERE: Added 'text-slate-900' and 'bg-white' ---
                              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-slate-900 bg-white"
                          />
                      </div>
                      
                      <div className="flex gap-3 justify-end mt-6">
                          <button 
                              type="button"
                              onClick={() => setIsModalOpen(false)}
                              className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium transition-colors"
                          >
                              Cancel
                          </button>
                          <button 
                              type="submit"
                              disabled={isSubmitting}
                              className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-70 flex items-center gap-2 shadow-md hover:shadow-lg transition-all"
                          >
                              {isSubmitting && <Loader2 className="animate-spin size-4" />}
                              {modalMode === 'create' ? "Create Resume" : "Save Changes"}
                          </button>
                      </div>
                  </form>
              </div>
          </div>
      )}

    </div>
  );
};

export default ResumeDashboard;