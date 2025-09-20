// Filename: client/src/components/ui/Navbar.jsx
// (Fixed by your AI assistant to use onClick for dropdown)

import React, { useState, useEffect, useRef, useContext } from 'react'; // Imports for state, side-effects, and refs
import { useNavigate } from 'react-router-dom';
import { assets } from '../../assets/assets';
import { AppContent } from '../../context/AppContext';
import { toast } from 'react-toastify';
import axios from 'axios';

const Navbar = ({ theme = 'light' }) => {
    const navigate = useNavigate();
    const { user, backendUrl, setUser } = useContext(AppContent);

    // --- CHANGE 1: State to manage dropdown visibility ---
    // Yeh state track karega ki dropdown khula hai ya nahi.
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    // --- CHANGE 2: Ref to detect clicks outside the dropdown ---
    // Is ref ko hum dropdown ke main container par lagaenge.
    const dropdownRef = useRef(null);

    const isTransparent = theme === 'transparent';
    const navClasses = isTransparent ? 'bg-white/5 backdrop-blur-lg border-b border-white/20' : 'bg-white shadow-sm';
    const buttonClasses = isTransparent ? 'border-white/50 text-white hover:bg-white/20' : 'border-gray-400 text-gray-800 hover:bg-gray-100';
    const arrowIconClass = isTransparent ? 'w-4 invert' : 'w-4';

    // --- CHANGE 3: Effect to close dropdown on outside click ---
    // Yeh code check karta hai ki user ne dropdown ke bahar click kiya hai ya nahi.
    // Agar bahar click kiya hai, toh dropdown band ho jayega.
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        // Event listener add karna
        document.addEventListener('mousedown', handleClickOutside);
        // Cleanup function: Jab component unmount ho, toh listener remove kar do
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);


    const sendVerificationOtp = async () => {
        try {
            const { data } = await axios.post(backendUrl + '/api/auth/send-verify-otp');
            if (data.success) {
                navigate('/email-verify');
                toast.success(data.message);
            } else {
                toast.error(data.message);
            }
        } catch (error) { toast.error(error.message); }
        setIsDropdownOpen(false); // Close dropdown after action
    };

    const logout = async () => {
        try {
            const { data } = await axios.post(backendUrl + '/api/auth/logout');
            if (data.success) {
                setUser(null);
                toast.success("Logged out successfully!");
                navigate('/');
            }
        } catch (error) { toast.error(error.message); }
        setIsDropdownOpen(false); // Close dropdown after action
    };
    
    // --- Helper function for navigation to also close dropdown ---
    const handleNavigate = (path) => {
        navigate(path);
        setIsDropdownOpen(false);
    }

    return (
        <div className={`w-full flex justify-between items-center p-4 sm:px-12 fixed top-0 z-20 transition-colors duration-300 ${navClasses}`}>
            <img 
                onClick={() => user ? navigate('/dashboard') : navigate('/')} 
                src={assets.logo} 
                alt="EngiVerse Logo" 
                className='w-32 h-9 cursor-pointer' 
            />
            {user ? (
                // --- CHANGE 4: Added ref and removed 'group' class ---
                <div className='relative' ref={dropdownRef}>
                    {/* --- CHANGE 5: Added onClick to toggle the dropdown --- */}
                    <button onClick={() => setIsDropdownOpen(prev => !prev)} className="focus:outline-none">
                        {user.profilePicture ? (
                            <img 
                                src={user.profilePicture} 
                                alt="Profile" 
                                className={`w-10 h-10 rounded-full object-cover cursor-pointer ring-2 transition-all ${isDropdownOpen ? 'ring-indigo-400' : 'ring-transparent'}`}
                            />
                        ) : (
                            <div className={`w-10 h-10 flex justify-center items-center rounded-full font-bold text-lg cursor-pointer ring-2 transition-all ${isDropdownOpen ? 'ring-indigo-400' : 'ring-transparent'} ${isTransparent ? 'bg-white/20 text-white' : 'bg-indigo-600 text-white'}`}>
                                {user.name ? user.name[0].toUpperCase() : '?'}
                            </div>
                        )}
                    </button>

                    {/* --- CHANGE 6: Replaced hover classes with conditional classes based on state --- */}
                    <div className={`absolute top-full right-0 z-10 mt-2 text-black rounded-md shadow-lg transition-all duration-200 ease-in-out ${isDropdownOpen ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible'}`}>
                        <ul className='list-none m-0 bg-white text-sm w-48 border border-gray-100 rounded-md'>
                            <li onClick={() => handleNavigate('/profile')} className='py-2 px-4 hover:bg-gray-100 cursor-pointer'>My Profile</li>
                            {!user.isAccountVerified && <li onClick={sendVerificationOtp} className='py-2 px-4 hover:bg-gray-100 cursor-pointer'>Verify Email</li>}
                            <li onClick={logout} className='py-2 px-4 hover:bg-gray-100 cursor-pointer border-t border-gray-100'>Logout</li>
                        </ul>
                    </div>
                </div>
            ) : (
                <button
                    onClick={() => navigate('/login')}
                    className={`flex items-center gap-2 border-2 rounded-full px-5 py-2 font-semibold transition-all ${buttonClasses}`}
                >
                    Login <img src={assets.arrow_icon} alt="" className={arrowIconClass}/>
                </button>
            )}
        </div>
    );
};

export default Navbar;