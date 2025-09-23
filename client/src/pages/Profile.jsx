// Filename: client/src/pages/Profile.jsx (FINAL COMPLETE & CORRECTED VERSION)

import React, { useEffect, useState, useContext, useRef, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../components/ui/Navbar";
import { AppContent } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

// --- Self-contained Helper Components ---
const Spinner = () => <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>;
const LinkedInIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="text-gray-500 hover:text-blue-600" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg> );
const GitHubIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="text-gray-500 hover:text-black" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg> );
const PortfolioIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="text-gray-500 hover:text-indigo-600" viewBox="0 0 24 24"><path d="M22 6.152v11.695c0 2.209-1.791 4-4 4h-12c-2.209 0-4-1.791-4-4v-11.695c.503.279 1.21.58 2 .848v11c0 1.104.896 2 2 2h12c1.104 0 2-.896 2-2v-11c.79-.268 1.497-.569 2-.848zm-11-5.152l-11 6 11 6 11-6-11-6z" /></svg> );
const ArrowLeftIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z" /></svg> );

const Profile = () => {
    const { backendUrl, user: contextUser, setUser } = useContext(AppContent);
    const { userId } = useParams();
    const isOwnProfile = !userId || (contextUser && userId === contextUser._id);

    const [profileData, setProfileData] = useState(null);
    const [friendship, setFriendship] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState("");
    const [skillsInput, setSkillsInput] = useState('');
    const fileInputRef = useRef(null);

    const fetchProfile = useCallback(async () => {
    const targetUserId = userId || contextUser?._id;
    if (!targetUserId) {
        setLoading(false);
        return;
    }
    try {
        setLoading(true);
        const res = await axios.get(`${backendUrl}/api/profile/${targetUserId}`);
        
        if (res.data.success) {
            const data = res.data.data;
            
            // Set all the data correctly
            setProfileData(data);
            setFriendship(data.friendship);

            // --- THIS IS THE FIX ---
            // Set the imagePreview state with the URL from the database.
            // The <img> tag uses this state to show the picture.
            setImagePreview(data.profilePicture || "");

            // Also update the global user state if it's our own profile
            if (isOwnProfile) {
                setUser(data);
            }
        } else {
            toast.error("Failed to load profile.");
            setProfileData(null);
        }
    } catch (err) {
        toast.error("Profile not found or an error occurred.");
        setProfileData(null);
    } finally {
        setLoading(false);
    }
}, [backendUrl, userId, contextUser?._id, isOwnProfile, setUser]);


    useEffect(() => {
        setLoading(true);
        fetchProfile();
    }, [fetchProfile]);
    
    // --- FORM HANDLERS (Only for own profile) ---
    const handleChange = (e) => {
        const { name, value } = e.target;
        if (["linkedIn", "github", "portfolio"].includes(name)) {
            setProfileData((prev) => ({ ...prev, socialLinks: { ...(prev.socialLinks || {}), [name]: value } }));
        } else {
            setProfileData((prev) => ({ ...prev, [name]: value }));
        }
    };
    const handleSkillsChange = (e) => setSkillsInput(e.target.value);
    const handleImageChange = (e) => {
        const f = e.target.files?.[0];
        if (f) {
            setImageFile(f);
            setImagePreview(URL.createObjectURL(f));
        }
    };
    const normalizeUrl = (url) => (!url || /^\s*$/.test(url) ? "" : /^https?:\/\//i.test(url) ? url.trim() : "https://" + url.trim());

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isOwnProfile) return;
        setIsSaving(true);
        try {
            let pictureUrl = profileData.profilePicture;
            if (imageFile) {
                const fd = new FormData();
                fd.append("profilePicture", imageFile);
                const imgRes = await axios.post(`${backendUrl}/api/profile/upload-picture`, fd);
                if (imgRes.data.success) pictureUrl = imgRes.data.data.profilePicture;
            }
            const payload = { ...profileData, skills: skillsInput.split(",").map(s => s.trim()).filter(Boolean), profilePicture: pictureUrl, socialLinks: { linkedIn: normalizeUrl(profileData.socialLinks?.linkedIn), github: normalizeUrl(profileData.socialLinks?.github), portfolio: normalizeUrl(profileData.socialLinks?.portfolio) }};
            const res = await axios.put(`${backendUrl}/api/profile`, payload);
            if (res.data.success) {
                toast.success("Profile saved!");
                setUser(res.data.data);
                setProfileData(res.data.data);
                setImageFile(null);
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Error saving profile.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleSendRequest = async () => {
        try {
            const res = await axios.post(`${backendUrl}/api/friends/requests/send/${userId}`);
            toast.success(res.data.message);
            fetchProfile(); // Refetch to update button state
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to send request.");
        }
    };

    const handleWithdrawRequest = async () => {
        try {
            const res = await axios.delete(`${backendUrl}/api/friends/requests/withdraw/${userId}`);
            toast.success(res.data.message);
            fetchProfile(); // Refetch to update button state
        } catch (err) {
             toast.error(err.response?.data?.message || "Failed to withdraw request.");
        }
    };

    const handleUnfriend = async () => {
        if (!window.confirm("Are you sure you want to remove this friend?")) return;
        try {
            const res = await axios.delete(`${backendUrl}/api/friends/${userId}`);
            if (res.data.success) {
                toast.success("Friend removed.");
                fetchProfile(); // Refetch profile to update the button
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to remove friend.");
        }
    };

const renderFriendshipButton = () => {
        if (!contextUser || isOwnProfile) return null;
        switch (friendship?.status) {
            case 'friends':
                // --- FIX: Added a return statement ---
                return (
                    <div className="flex items-center">
                        <button type="button" className="px-5 py-2.5 bg-green-500 text-white font-semibold rounded-lg cursor-default">
                            Friends
                        </button>
                        <button 
                            onClick={handleUnfriend}
                            className="ml-2 px-3 py-2.5 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-red-500 hover:text-white"
                            title="Unfriend"
                        >
                            &times;
                        </button>
                    </div>
                );
            case 'request_sent':
                return (
                    <div className="flex flex-col items-center gap-2">
                         <button type="button" className="px-5 py-2.5 bg-gray-400 text-white font-semibold rounded-lg cursor-default w-full">Request Sent</button>
                         <button type="button" onClick={handleWithdrawRequest} className="text-xs text-red-500 hover:underline">Withdraw</button>
                    </div>
                );
            case 'request_received':
                return <Link to="/friends" className="px-5 py-2.5 bg-yellow-500 text-white font-semibold rounded-lg shadow-sm hover:bg-yellow-600">Respond to Request</Link>;
            default:
                return <button type="button" onClick={handleSendRequest} className="px-5 py-2.5 bg-indigo-600 text-white font-semibold rounded-lg shadow-sm hover:bg-indigo-700">Add Friend</button>;
        }
    };


    if (loading) return <div className="min-h-screen bg-slate-50 flex justify-center items-center"><Spinner /></div>;
    if (!profileData) return <div className="min-h-screen bg-slate-50 text-center pt-40"><h1 className="text-2xl font-bold">Profile Not Found</h1></div>;
    
    // --- THIS IS THE FIX ---
    const inputClasses = "mt-1 block w-full rounded-md border-0 bg-white py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600";
    
    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />
            <div className="container mx-auto max-w-4xl pt-24 sm:pt-28 p-4 sm:p-6">
                <Link to={isOwnProfile ? "/dashboard" : "/skill-exchange"} className="inline-flex items-center gap-2 text-gray-500 hover:text-indigo-600 mb-6 group">
                    <ArrowLeftIcon />
                    <span className="font-semibold group-hover:underline">Back</span>
                </Link>

                <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm">
                    {/* Header */}
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex flex-col md:flex-row items-center gap-6">
                            <img src={imagePreview || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(profileData.name || "user")}`} alt="Profile" className="w-24 h-24 rounded-full object-cover bg-gray-200 border-4 border-white shadow-md"/>
                            <div className="flex-1 text-center md:text-left">
                                <h1 className="text-3xl font-bold text-gray-900">{profileData.name}</h1>
                                <p className="mt-1 text-md text-gray-500">{profileData.collegeName || "College not specified"}</p>
                                <div className="flex gap-4 justify-center md:justify-start mt-3">
                                    {profileData.socialLinks?.linkedIn && <a href={profileData.socialLinks.linkedIn} target="_blank" rel="noopener noreferrer"><LinkedInIcon /></a>}
                                    {profileData.socialLinks?.github && <a href={profileData.socialLinks.github} target="_blank" rel="noopener noreferrer"><GitHubIcon /></a>}
                                    {profileData.socialLinks?.portfolio && <a href={profileData.socialLinks.portfolio} target="_blank" rel="noopener noreferrer"><PortfolioIcon /></a>}
                                </div>
                            </div>
                            <div className="mt-4 md:mt-0">
                                {renderFriendshipButton()}
                            </div>
                        </div>
                    </div>
                    
                    <div className="divide-y divide-gray-200">
                        {isOwnProfile && (
                            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                                <div className="md:col-span-1"><h2 className="text-lg font-semibold text-gray-800">Profile Photo</h2><p className="mt-1 text-sm text-gray-500">Your public avatar.</p></div>
                                <div className="md:col-span-2 flex items-center gap-4">
                                    <input type="file" ref={fileInputRef} onChange={handleImageChange} className="hidden" accept="image/png,image/jpeg" />
                                    <button type="button" onClick={() => fileInputRef.current?.click()} className="font-semibold text-indigo-600 hover:text-indigo-500">Change</button>
                                </div>
                            </div>
                        )}
                        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="md:col-span-1"><h2 className="text-lg font-semibold text-gray-800">Personal Info</h2><p className="mt-1 text-sm text-gray-500">This information is fixed.</p></div>
                             <div className="md:col-span-2 space-y-4">
                                <div><label className="block text-sm font-medium text-gray-700">Full Name</label><p className="mt-1 text-md text-gray-900 font-semibold">{profileData.name || "-"}</p></div>
                                <div><label className="block text-sm font-medium text-gray-700">Email Address</label><p className="mt-1 text-md text-gray-900 font-mono">{profileData.email || "-"}</p></div>
                             </div>
                        </div>
                        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="md:col-span-1"><h2 className="text-lg font-semibold text-gray-800">Bio</h2><p className="mt-1 text-sm text-gray-500">A short introduction.</p></div>
                            <div className="md:col-span-2">{isOwnProfile ? <textarea name="bio" rows="3" onChange={handleChange} value={profileData.bio || ''} className={inputClasses} placeholder="A passionate developer..."></textarea> : <p className="text-gray-700">{profileData.bio || "No bio provided."}</p>}</div>
                        </div>
                        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="md:col-span-1"><h2 className="text-lg font-semibold text-gray-800">Skills</h2><p className="mt-1 text-sm text-gray-500">Your technical skills.</p></div>
                            <div className="md:col-span-2">{isOwnProfile ? <input type="text" name="skills" onChange={handleSkillsChange} value={skillsInput} className={inputClasses} placeholder="e.g., React, Node.js"/> : <p className="text-gray-700">{(profileData.skills || []).join(', ') || "No skills listed."}</p>}</div>
                        </div>
                        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                             <div className="md:col-span-1"><h2 className="text-lg font-semibold text-gray-800">Academics & Socials</h2><p className="mt-1 text-sm text-gray-500">Your college and professional links.</p></div>
                             <div className="md:col-span-2 space-y-4">
                                <div><label className="block text-sm font-medium text-gray-700">College Name</label>{isOwnProfile ? <input type="text" name="collegeName" onChange={handleChange} value={profileData.collegeName || ''} className={inputClasses} /> : <p className="text-gray-700 font-medium">{profileData.collegeName || '-'}</p>}</div>
                                <div><label className="block text-sm font-medium text-gray-700">Branch</label>{isOwnProfile ? <input type="text" name="branch" onChange={handleChange} value={profileData.branch || ''} className={inputClasses} /> : <p className="text-gray-700 font-medium">{profileData.branch || '-'}</p>}</div>
                                <div><label className="block text-sm font-medium text-gray-700">Graduation Year</label>{isOwnProfile ? <input type="number" name="graduationYear" onChange={handleChange} value={profileData.graduationYear || ''} className={inputClasses} /> : <p className="text-gray-700 font-medium">{profileData.graduationYear || '-'}</p>}</div>
                                <div><label className="block text-sm font-medium text-gray-700">LinkedIn URL</label>{isOwnProfile ? <input type="text" name="linkedIn" onChange={handleChange} value={profileData.socialLinks?.linkedIn || ''} className={inputClasses} /> : <p className="text-gray-700 font-medium">{profileData.socialLinks?.linkedIn || '-'}</p>}</div>
                                <div><label className="block text-sm font-medium text-gray-700">GitHub URL</label>{isOwnProfile ? <input type="text" name="github" onChange={handleChange} value={profileData.socialLinks?.github || ''} className={inputClasses} /> : <p className="text-gray-700 font-medium">{profileData.socialLinks?.github || '-'}</p>}</div>
                                <div><label className="block text-sm font-medium text-gray-700">Portfolio URL</label>{isOwnProfile ? <input type="text" name="portfolio" onChange={handleChange} value={profileData.socialLinks?.portfolio || ''} className={inputClasses} /> : <p className="text-gray-700 font-medium">{profileData.socialLinks?.portfolio || '-'}</p>}</div>
                             </div>
                        </div>
                        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                             <div className="md:col-span-1"><h2 className="text-lg font-semibold text-gray-800">Profile Status</h2><p className="mt-1 text-sm text-gray-500">Your account status.</p></div>
                             <div className="md:col-span-2 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Account Verification</label>
                                    {profileData.isAccountVerified ? <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">Verified</span> : <span className="inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20">Not Verified</span>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Profile Last Updated</label>
                                    <p className="mt-1 text-sm text-gray-600">{profileData.updatedAt ? new Date(profileData.updatedAt).toLocaleString() : "Not available"}</p>
                                </div>
                             </div>
                        </div>
                    </div>
                    {isOwnProfile && (
                        <div className="flex items-center justify-end gap-x-6 p-6 border-t border-gray-200 mt-4">
                            <button type="submit" disabled={isSaving} className="px-5 py-2.5 bg-indigo-600 text-white font-semibold rounded-lg shadow-sm hover:bg-indigo-700 disabled:bg-indigo-400">
                                {isSaving ? "Saving..." : "Save Changes"}
                            </button>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default Profile;