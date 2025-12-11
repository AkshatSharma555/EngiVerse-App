import React, { useEffect, useState, useContext } from 'react';
import { Link, useParams } from 'react-router-dom';
import { AppContent } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
  ArrowLeftIcon, User, FileText, Briefcase, GraduationCap, FolderIcon, Sparkles,
  ChevronLeft, ChevronRight, DownloadIcon, Eye, EyeOff, Share2, Save
} from 'lucide-react'; // Added Icons

// Components
import PersonalInfoForm from '../components/resume/PersonalInfoForm'; 
import ResumePreview from '../components/resume/ResumePreview';
import ExperienceForm from '../components/resume/ExperienceForm';
import EducationForm from '../components/resume/EducationForm';
import ProjectForm from '../components/resume/ProjectForm';
import SkillsForm from '../components/resume/SkillsForm';
import ProfessionalSummaryForm from '../components/resume/ProfessionalSummaryForm';
import TemplateSelector from '../components/resume/TemplateSelector';
import ColorPicker from '../components/resume/ColorPicker';

const ResumeBuilder = () => {
  const { backendUrl } = useContext(AppContent);
  const { resumeId } = useParams();

  const [resumeData, setResumeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false); // To show saving state
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const [removeBackground, setRemoveBackground] = useState(false);

  const sections = [
    { id: "personal", name: "Personal Info", icon: User },
    { id: "summary", name: "Summary", icon: FileText },
    { id: "experience", name: "Experience", icon: Briefcase },
    { id: "education", name: "Education", icon: GraduationCap },
    { id: "projects", name: "Projects", icon: FolderIcon },
    { id: "skills", name: "Skills", icon: Sparkles }
  ];

  const activeSection = sections[activeSectionIndex];

  // Load Data
  useEffect(() => {
    const loadExistingResume = async () => {
      try {
        const { data } = await axios.get(`${backendUrl}/api/resume/get/${resumeId}`);
        if (data.success) {
          setResumeData(data.resume);
        }
      } catch (error) {
        toast.error("Failed to load resume");
      } finally {
        setLoading(false);
      }
    };
    loadExistingResume();
  }, [resumeId, backendUrl]);

  // --- SAVE FUNCTION (Only called manually) ---
  const saveResume = async () => {
    setIsSaving(true);
    try {
      let updatedResumeData = structuredClone(resumeData);
      
      if (typeof resumeData.personal_info.image === 'object') {
        delete updatedResumeData.personal_info.image;
      }

      const formData = new FormData();
      formData.append("resumeId", resumeId);
      formData.append("resumeData", JSON.stringify(updatedResumeData));
      
      if (removeBackground) formData.append("removeBackground", "yes");
      
      if (resumeData.personal_info.image instanceof File) {
        formData.append("image", resumeData.personal_info.image);
      }

      const { data } = await axios.put(
        `${backendUrl}/api/resume/update`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      if(data.success) {
          setResumeData(data.resume);
          toast.success("Changes Saved Successfully!");
      }
    } catch (error) {
      console.error(error);
      toast.error("Save Failed");
    } finally {
      setIsSaving(false);
    }
  };

  // --- NEW: Toggle Public/Private ---
  const toggleVisibility = async () => {
      const newStatus = !resumeData.public;
      // Optimistic update (UI first)
      setResumeData(prev => ({ ...prev, public: newStatus }));
      
      try {
          // Hum sirf updated status bhej rahe hain chota request banake
          // Note: Hamein pura resume save karne ki zarurat nahi, bas flag update karna hai
          // Lekin abhi ke liye simple rakhte hain, pura save logic use karte hain
          // par state update pehle kar diya taaki UI fast lage.
          
          // Background me save call:
          const formData = new FormData();
          formData.append("resumeId", resumeId);
          formData.append("resumeData", JSON.stringify({ ...resumeData, public: newStatus })); // Send updated data
          
          await axios.put(`${backendUrl}/api/resume/update`, formData);
          toast.success(newStatus ? "Resume is now Public" : "Resume is now Private");

      } catch (error) {
          setResumeData(prev => ({ ...prev, public: !newStatus })); // Revert on error
          toast.error("Failed to update visibility");
      }
  };

  // --- NEW: Share Logic ---
  const handleShare = () => {
      if(!resumeData.public) {
          toast.error("Make resume public first to share!");
          return;
      }
      // Assuming you will have a view page later like /view/:id
      // For now copying the current URL or a view URL
      const url = `${window.location.origin}/resume/view/${resumeId}`; 
      navigator.clipboard.writeText(url);
      toast.success("Public Link Copied to Clipboard!");
  };

  const handleDownload = () => {
    window.print();
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading Editor...</div>;
  if (!resumeData) return <div className="min-h-screen flex items-center justify-center">Resume Not Found</div>;

  return (
    <div className="min-h-screen bg-slate-50">
       
      {/* --- Top Bar --- */}
      <div className='sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm'>
        <div className='max-w-7xl mx-auto px-4 py-3 flex justify-between items-center'>
            
            {/* Left: Back & Title */}
            <div className='flex items-center gap-4'>
                <Link to='/resume-dashboard' className='p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-all'>
                    <ArrowLeftIcon className='size-5' />
                </Link>
                <div>
                    <h1 className='text-lg font-bold text-slate-800 hidden sm:block'>{resumeData.title}</h1>
                    <p className='text-xs text-slate-500'>
                        {isSaving ? "Saving..." : "Unsaved changes"}
                    </p>
                </div>
            </div>
            
            {/* Right: Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
                
                {/* Visibility Toggle */}
                <button 
                    onClick={toggleVisibility}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        resumeData.public 
                        ? 'bg-green-50 text-green-700 border border-green-200 hover:bg-green-100' 
                        : 'bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200'
                    }`}
                    title={resumeData.public ? "Anyone with link can view" : "Only you can view"}
                >
                    {resumeData.public ? <Eye size={16}/> : <EyeOff size={16}/>}
                    <span className="hidden sm:inline">{resumeData.public ? 'Public' : 'Private'}</span>
                </button>

                {/* Share Button */}
                {resumeData.public && (
                    <button 
                        onClick={handleShare}
                        className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg border border-transparent hover:border-slate-200 transition-all"
                        title="Copy Link"
                    >
                        <Share2 size={18}/>
                    </button>
                )}

                <div className="h-6 w-px bg-slate-200 mx-1"></div>

                <button onClick={handleDownload} className="hidden md:flex gap-2 items-center text-slate-600 hover:bg-slate-100 px-3 py-2 rounded-lg transition-colors text-sm font-medium">
                    <DownloadIcon size={18}/> PDF
                </button>
                
                <button 
                    onClick={saveResume} 
                    disabled={isSaving}
                    className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 font-medium shadow-md transition-all hover:shadow-lg disabled:opacity-70"
                >
                    <Save size={18} />
                    <span className="hidden sm:inline">{isSaving ? 'Saving...' : 'Save'}</span>
                </button>
            </div>
        </div>
      </div>

      <div className='max-w-7xl mx-auto px-4 py-8'>
        <div className='grid lg:grid-cols-12 gap-8'>
          
          {/* --- LEFT: EDITOR FORM (Same as before) --- */}
          <div className='lg:col-span-5 h-full'>
            <div className='bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-[calc(100vh-140px)] sticky top-24'>
               
               {/* Progress Bar */}
               <div className="relative h-1 bg-gray-100 shrink-0">
                  <div 
                    className="absolute top-0 left-0 h-full bg-indigo-500 transition-all duration-300"
                    style={{ width: `${((activeSectionIndex + 1) / sections.length) * 100}%` }}
                  ></div>
               </div>

               {/* Navigation Header */}
               <div className="flex justify-between items-center p-4 border-b border-gray-100 bg-gray-50/50 shrink-0">
                    <button 
                        disabled={activeSectionIndex === 0}
                        onClick={() => setActiveSectionIndex(p => p - 1)}
                        className="p-2 hover:bg-white rounded-lg text-slate-500 disabled:opacity-30 transition-colors border border-transparent hover:border-gray-200"
                    >
                        <ChevronLeft size={20}/>
                    </button>
                    
                    <div className="flex items-center gap-2 font-bold text-slate-700">
                        <span className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                            {React.createElement(activeSection.icon, { size: 18 })}
                        </span>
                        {activeSection.name}
                    </div>

                    <button 
                         disabled={activeSectionIndex === sections.length - 1}
                         onClick={() => setActiveSectionIndex(p => p + 1)}
                         className="p-2 hover:bg-white rounded-lg text-slate-500 disabled:opacity-30 transition-colors border border-transparent hover:border-gray-200"
                    >
                        <ChevronRight size={20}/>
                    </button>
               </div>
              
              {/* Form Content Area */}
              <div className="p-6 overflow-y-auto flex-grow custom-scrollbar">
                
                {activeSectionIndex === 0 && (
                    <div className="mb-6 pb-6 border-b border-dashed border-gray-200 flex flex-wrap gap-4">
                         <TemplateSelector selectedTemplate={resumeData.template} onChange={(t) => setResumeData(prev => ({...prev, template: t}))} />
                         <ColorPicker selectedColor={resumeData.accent_color} onChange={(c) => setResumeData(prev => ({...prev, accent_color: c}))} />
                    </div>
                )}

                {activeSection.id === 'personal' && (
                  <PersonalInfoForm
                    data={resumeData.personal_info}
                    onChange={(data) => setResumeData(prev => ({ ...prev, personal_info: data }))}
                    removeBackground={removeBackground}
                    setRemoveBackground={setRemoveBackground}
                  />
                )}
                {activeSection.id === 'summary' && (
                   <ProfessionalSummaryForm 
                     data={resumeData.professional_summary}
                     onChange={(data) => setResumeData(prev => ({ ...prev, professional_summary: data }))}
                   />
                )}
                {activeSection.id === 'experience' && (
                   <ExperienceForm 
                      data={resumeData.experience} 
                      onChange={(data) => setResumeData(prev => ({ ...prev, experience: data }))} 
                   />
                )}
                {activeSection.id === 'education' && (
                   <EducationForm 
                      data={resumeData.education} 
                      onChange={(data) => setResumeData(prev => ({ ...prev, education: data }))} 
                   />
                )}
                 {activeSection.id === 'projects' && (
                   <ProjectForm 
                      data={resumeData.project} 
                      onChange={(data) => setResumeData(prev => ({ ...prev, project: data }))} 
                   />
                )}
                 {activeSection.id === 'skills' && (
                   <SkillsForm 
                      data={resumeData.skills} 
                      onChange={(data) => setResumeData(prev => ({ ...prev, skills: data }))} 
                   />
                )}
              </div>

            </div>
          </div>

          {/* --- RIGHT: PREVIEW --- */}
          <div className='lg:col-span-7'>
             <div className="sticky top-24">
                <div className="bg-white rounded-xl shadow-lg border border-slate-200/60 p-1 min-h-[800px]">
                    <ResumePreview
                    data={resumeData}
                    template={resumeData.template}
                    accentColor={resumeData.accent_color}
                    />
                </div>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default ResumeBuilder;