// Filename: client/src/pages/Profile.jsx
// (Final, complete version with all fields, robust logic, and professional UI)

import React, { useEffect, useState, useContext, useRef } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/ui/Navbar";
import { AppContent } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

// --- Icon helper components ---
const LinkedInIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    fill="currentColor"
    className="text-gray-400"
    viewBox="0 0 24 24"
  >
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
  </svg>
);
const GitHubIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    fill="currentColor"
    className="text-gray-400"
    viewBox="0 0 24 24"
  >
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
  </svg>
);
const PortfolioIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    fill="currentColor"
    className="text-gray-400"
    viewBox="0 0 24 24"
  >
    <path d="M22 6.152v11.695c0 2.209-1.791 4-4 4h-12c-2.209 0-4-1.791-4-4v-11.695c.503.279 1.21.58 2 .848v11c0 1.104.896 2 2 2h12c1.104 0 2-.896 2-2v-11c.79-.268 1.497-.569 2-.848zm-11-5.152l-11 6 11 6 11-6-11-6z" />
  </svg>
);
const ArrowLeftIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    fill="currentColor"
    viewBox="0 0 16 16"
  >
    <path
      fillRule="evenodd"
      d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"
    />
  </svg>
);

const Profile = () => {
  const { backendUrl, user: contextUser, setUser } = useContext(AppContent);
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    collegeName: "",
    branch: "",
    graduationYear: "",
    skills: [],
    bio: "",
    socialLinks: { linkedIn: "", github: "", portfolio: "" },
    updatedAt: "",
    profilePicture: "",
    isAccountVerified: false,
  });
  
  // --- State Management ---
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [skillsInput, setSkillsInput] = useState(''); // ADDED: State for skills text input
  const fileInputRef = useRef(null);

  // --- Data Normalization ---
  const normalizeFetched = (data = {}) => ({
    name: data.name || "",
    email: data.email || "",
    collegeName: data.collegeName || "",
    branch: data.branch || "",
    graduationYear: data.graduationYear || "",
    skills: Array.isArray(data.skills) ? data.skills : [],
    bio: data.bio || "",
    socialLinks: {
      linkedIn: data.socialLinks?.linkedIn || "",
      github: data.socialLinks?.github || "",
      portfolio: data.socialLinks?.portfolio || "",
    },
    updatedAt: data.updatedAt || "",
    profilePicture: data.profilePicture || "",
    isAccountVerified: data.isAccountVerified || false,
  });

  // --- Effects ---
  useEffect(() => {
    const fetchProfile = async () => {
      if (!contextUser?._id) {
        setLoading(false);
        return;
      }
      try {
        const res = await axios.get(`${backendUrl}/api/profile`);
        if (res?.data?.success) {
          const mapped = normalizeFetched(res.data.data);
          setProfileData(mapped);
          setImagePreview(mapped.profilePicture || "");
          setSkillsInput((mapped.skills || []).join(', ')); // ADDED: Initialize skills input
          if (typeof setUser === "function") setUser(res.data.data);
        } else {
          toast.error(res?.data?.message || "Failed to load profile.");
        }
      } catch (err) {
        console.error("Fetch profile error:", err);
        toast.error("Failed to fetch profile data.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [backendUrl, contextUser?._id, setUser]);

  // --- Handlers ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (["linkedIn", "github", "portfolio"].includes(name)) {
      setProfileData((prev) => ({
        ...prev,
        socialLinks: { ...(prev.socialLinks || {}), [name]: value },
      }));
    } else {
      setProfileData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // CHANGED: Updated skill handler for better UX
  const handleSkillsChange = (e) => {
    const value = e.target.value;
    setSkillsInput(value); // Update the raw input state
    const skillsArray = value
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean); // Filter out empty strings
    setProfileData((prev) => ({ ...prev, skills: skillsArray }));
  };

  const handleImageChange = (e) => {
    const f = e.target.files?.[0];
    if (f) {
      setImageFile(f);
      setImagePreview(URL.createObjectURL(f));
    }
  };
  
  const normalizeUrl = (url) => {
    if (!url || /^\s*$/.test(url)) return "";
    return /^https?:\/\//i.test(url) ? url.trim() : "https://" + url.trim();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    // Create a final payload from the current state
    const submittedProfile = { ...profileData };

    try {
      // Step 1: Handle image upload if a new image is selected
      if (imageFile) {
        const fd = new FormData();
        fd.append("profilePicture", imageFile);
        const imgRes = await axios.post(`${backendUrl}/api/profile/upload-picture`, fd);
        if (imgRes?.data?.success) {
          submittedProfile.profilePicture = imgRes.data.data.profilePicture;
        } else {
          throw new Error(imgRes?.data?.message || "Image upload failed");
        }
      }

      // Step 2: Prepare the final data payload for the PUT request
      const payload = {
        ...submittedProfile,
        socialLinks: {
          linkedIn: normalizeUrl(submittedProfile.socialLinks?.linkedIn),
          github: normalizeUrl(submittedProfile.socialLinks?.github),
          portfolio: normalizeUrl(submittedProfile.socialLinks?.portfolio),
        },
      };
      
      const { name, email, ...updatableData } = payload;
      
      // Step 3: Send the update request
      const res = await axios.put(`${backendUrl}/api/profile`, updatableData);

      // Step 4: Handle the response
      if (res?.data?.success) {
        // CHANGED: Logic to prevent data reverting issue
        // Instead of fully trusting the server response for form fields,
        // we trust the data we just submitted. We only take server-generated
        // values like `updatedAt`.
        const serverResponseData = res.data.data;
        
        // Merge our submitted data with the server's response
        const finalData = normalizeFetched({
            ...submittedProfile, // Our submitted data is the base
            updatedAt: serverResponseData.updatedAt, // Update with new timestamp
            profilePicture: serverResponseData.profilePicture // Update with final URL
        });

        setProfileData(finalData);
        if (typeof setUser === "function") setUser(serverResponseData);
        
        toast.success("Profile saved successfully!");
        setImageFile(null); // Clear the file input state
      } else {
        toast.error(res?.data?.message || "Failed to save profile.");
      }
    } catch (err) {
      console.error("Save profile error:", err);
      toast.error(err?.response?.data?.message || "An error occurred while saving.");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl">Loading Profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="container mx-auto max-w-4xl pt-24 sm:pt-28 p-4 sm:p-6">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-indigo-600 mb-6 group"
        >
          <ArrowLeftIcon />
          <span className="font-semibold group-hover:underline">
            Back to Dashboard
          </span>
        </Link>
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm">
          {/* --- Header --- */}
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">Your Profile</h1>
            <p className="mt-1 text-sm text-gray-500">
              Update your photo and personal details here.
            </p>
          </div>
          
          <div className="divide-y divide-gray-200">
            {/* --- Profile Photo Section --- */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              <div className="md:col-span-1">
                <h2 className="text-lg font-semibold text-gray-800">Profile Photo</h2>
                <p className="mt-1 text-sm text-gray-500">Your public profile picture.</p>
              </div>
              <div className="md:col-span-2 flex items-center gap-6">
                <img
                  src={ imagePreview || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(profileData.name || "user")}` }
                  alt="Profile"
                  className="w-20 h-20 rounded-full object-cover bg-gray-200"
                />
                <input type="file" ref={fileInputRef} onChange={handleImageChange} className="hidden" accept="image/png,image/jpeg" />
                <button type="button" onClick={() => fileInputRef.current?.click()} className="font-semibold text-indigo-600 hover:text-indigo-500">
                  Change
                </button>
              </div>
            </div>

            {/* --- Personal Information Section --- */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1">
                <h2 className="text-lg font-semibold text-gray-800">Personal Information</h2>
                <p className="mt-1 text-sm text-gray-500">This information is fixed.</p>
              </div>
              <div className="md:col-span-2 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Full Name</label>
                  <p className="mt-1 text-md text-gray-900 font-semibold">{profileData.name || "-"}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email Address</label>
                  <p className="mt-1 text-md text-gray-900 font-mono">{profileData.email || "-"}</p>
                </div>
              </div>
            </div>

            {/* --- Academic & Skills Section --- */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1">
                <h2 className="text-lg font-semibold text-gray-800">Academic & Skills</h2>
                <p className="mt-1 text-sm text-gray-500">Tell us about your college and skills.</p>
              </div>
              <div className="md:col-span-2 space-y-4">
                <div>
                  <label htmlFor="collegeName" className="block text-sm font-medium text-gray-700">College Name</label>
                  <input type="text" name="collegeName" id="collegeName" onChange={handleChange} value={profileData.collegeName} className="mt-1 block w-full rounded-md border-0 bg-white py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600" placeholder="e.g., IIT Bombay"/>
                </div>
                <div>
                  <label htmlFor="branch" className="block text-sm font-medium text-gray-700">Branch</label>
                  <input type="text" name="branch" id="branch" onChange={handleChange} value={profileData.branch} className="mt-1 block w-full rounded-md border-0 bg-white py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600" placeholder="e.g., Computer Science"/>
                </div>
                <div>
                  <label htmlFor="graduationYear" className="block text-sm font-medium text-gray-700">Graduation Year</label>
                  <input type="number" name="graduationYear" id="graduationYear" onChange={handleChange} value={profileData.graduationYear} className="mt-1 block w-full rounded-md border-0 bg-white py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600" placeholder="e.g., 2026"/>
                </div>
                <div>
                  <label htmlFor="skills" className="block text-sm font-medium text-gray-700">Skills <span className="text-xs text-gray-400">(comma separated)</span></label>
                    {/* CHANGED: Using skillsInput state for value */}
                  <input type="text" name="skills" id="skills" onChange={handleSkillsChange} value={skillsInput} className="mt-1 block w-full rounded-md border-0 bg-white py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600" placeholder="e.g., React, Node.js, Python"/>
                </div>
              </div>
            </div>

            {/* --- Bio & Socials Section --- */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1">
                <h2 className="text-lg font-semibold text-gray-800">Bio & Socials</h2>
                <p className="mt-1 text-sm text-gray-500">Your professional links and a short bio.</p>
              </div>
              <div className="md:col-span-2 space-y-4">
                <div>
                  <label htmlFor="bio" className="block text-sm font-medium text-gray-700">Short Bio</label>
                  <textarea name="bio" id="bio" rows="3" onChange={handleChange} value={profileData.bio} className="mt-1 block w-full rounded-md border-0 bg-white py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600" placeholder="A passionate developer..."></textarea>
                </div>
                <div>
                  <label htmlFor="linkedIn" className="block text-sm font-medium text-gray-700">LinkedIn URL</label>
                  <div className="relative mt-1">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"><LinkedInIcon /></div>
                    <input type="text" name="linkedIn" id="linkedIn" onChange={handleChange} value={profileData.socialLinks.linkedIn} className="block w-full rounded-md border-0 bg-white py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600" placeholder="linkedin.com/in/your-profile"/>
                  </div>
                </div>
                <div>
                  <label htmlFor="github" className="block text-sm font-medium text-gray-700">GitHub URL</label>
                  <div className="relative mt-1">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"><GitHubIcon /></div>
                    <input type="text" name="github" id="github" onChange={handleChange} value={profileData.socialLinks.github} className="block w-full rounded-md border-0 bg-white py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600" placeholder="github.com/your-username"/>
                  </div>
                </div>
                <div>
                  <label htmlFor="portfolio" className="block text-sm font-medium text-gray-700">Portfolio URL</label>
                  <div className="relative mt-1">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"><PortfolioIcon /></div>
                    <input type="text" name="portfolio" id="portfolio" onChange={handleChange} value={profileData.socialLinks.portfolio} className="block w-full rounded-md border-0 bg-white py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600" placeholder="your-portfolio.com"/>
                  </div>
                </div>
              </div>
            </div>

            {/* --- Profile Status Section --- */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1">
                <h2 className="text-lg font-semibold text-gray-800">Profile Status</h2>
                <p className="mt-1 text-sm text-gray-500">Your account status.</p>
              </div>
              <div className="md:col-span-2 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Account Verification</label>
                  {profileData.isAccountVerified ? (
                    <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">Verified</span>
                  ) : (
                    <span className="inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20">Not Verified</span>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Profile Last Updated</label>
                  <p className="mt-1 text-sm text-gray-600">{profileData.updatedAt ? new Date(profileData.updatedAt).toLocaleString() : "Not available"}</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* --- Footer Actions --- */}
          <div className="flex items-center justify-end gap-x-6 p-6">
            <button type="submit" disabled={isSaving} className="px-5 py-2.5 bg-indigo-600 text-white font-semibold rounded-lg shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed">
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;