import React from "react";
import { Upload, X, Loader2 } from "lucide-react";
import { toast } from "react-toastify";

const PersonalInfoForm = ({ data, onChange, removeBackground, setRemoveBackground }) => {

  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange({ ...data, [name]: value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image size should be less than 2MB");
        return;
      }
      onChange({ ...data, image: file });
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Photo Upload Section */}
      <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-4">
          <div className="relative size-16 shrink-0">
             {data.image ? (
                 <>
                   <img 
                      src={typeof data.image === 'string' ? data.image : URL.createObjectURL(data.image)} 
                      alt="Profile" 
                      className="w-full h-full object-cover rounded-full border-2 border-white shadow-sm"
                   />
                   <button 
                      onClick={() => onChange({...data, image: ''})}
                      className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 shadow-sm hover:bg-red-600"
                   >
                      <X size={12}/>
                   </button>
                 </>
             ) : (
                 <div className="w-full h-full bg-slate-200 rounded-full flex items-center justify-center text-slate-400">
                    <Upload size={20}/>
                 </div>
             )}
          </div>
          
          <div className="flex-1">
              <label className="block text-sm font-medium text-slate-700 mb-1">Profile Photo</label>
              <div className="flex gap-3 items-center">
                  <label className="cursor-pointer px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-sm">
                      Upload Photo
                      <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload}/>
                  </label>
                  
                  {/* Remove BG Toggle */}
                  <button
                    onClick={() => setRemoveBackground(!removeBackground)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                        removeBackground 
                        ? 'bg-indigo-50 border-indigo-200 text-indigo-700' 
                        : 'bg-white border-slate-300 text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                      {removeBackground ? <span className="flex size-2 bg-indigo-500 rounded-full animate-pulse"/> : <span className="size-2 border border-slate-400 rounded-full"/>}
                      Remove Background
                  </button>
              </div>
          </div>
      </div>

      {/* Inputs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Full Name */}
          <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Full Name</label>
              <input
                  type="text"
                  name="full_name"
                  value={data.full_name || ""}
                  onChange={handleChange}
                  placeholder="e.g. Akshat Sharma"
                  // --- CHANGE: Added 'text-slate-900' ---
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-slate-900 placeholder:text-slate-400"
              />
          </div>

          {/* Job Title */}
          <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Job Title</label>
              <input
                  type="text"
                  name="profession"
                  value={data.profession || ""}
                  onChange={handleChange}
                  placeholder="e.g. Full Stack Developer"
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-slate-900 placeholder:text-slate-400"
              />
          </div>

          {/* Email */}
          <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Email</label>
              <input
                  type="email"
                  name="email"
                  value={data.email || ""}
                  onChange={handleChange}
                  placeholder="e.g. akshat@example.com"
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-slate-900 placeholder:text-slate-400"
              />
          </div>

          {/* Phone */}
          <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Phone</label>
              <input
                  type="tel"
                  name="phone"
                  value={data.phone || ""}
                  onChange={handleChange}
                  placeholder="e.g. +91 98765 43210"
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-slate-900 placeholder:text-slate-400"
              />
          </div>

          {/* Location */}
          <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Location</label>
              <input
                  type="text"
                  name="location"
                  value={data.location || ""}
                  onChange={handleChange}
                  placeholder="e.g. Mumbai, India"
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-slate-900 placeholder:text-slate-400"
              />
          </div>

           {/* Website */}
           <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Portfolio / Website</label>
              <input
                  type="text"
                  name="website"
                  value={data.website || ""}
                  onChange={handleChange}
                  placeholder="e.g. myportfolio.com"
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-slate-900 placeholder:text-slate-400"
              />
          </div>

          {/* LinkedIn */}
          <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">LinkedIn Profile</label>
              <input
                  type="text"
                  name="linkedin"
                  value={data.linkedin || ""}
                  onChange={handleChange}
                  placeholder="e.g. linkedin.com/in/akshat"
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-slate-900 placeholder:text-slate-400"
              />
          </div>

      </div>
    </div>
  );
};

export default PersonalInfoForm;