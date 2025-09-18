// Filename: client/src/components/ui/Navbar.jsx
// (Cleaned up by your AI assistant)

import React from 'react';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { assets } from '../../assets/assets';
import { AppContent } from '../../context/AppContext';
import { toast } from 'react-toastify';
import axios from 'axios';

const Navbar = ({ theme = 'light' }) => {
    const navigate = useNavigate();
    const { user, backendUrl, setUser } = useContext(AppContent);

    const isTransparent = theme === 'transparent';
    const navClasses = isTransparent ? 'bg-white/5 backdrop-blur-lg border-b border-white/20' : 'bg-white shadow-sm';
    const buttonClasses = isTransparent ? 'border-white/50 text-white hover:bg-white/20' : 'border-gray-400 text-gray-800 hover:bg-gray-100';
    const arrowIconClass = isTransparent ? 'w-4 invert' : 'w-4';

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
    };

    return (
        <div className={`w-full flex justify-between items-center p-4 sm:px-12 fixed top-0 z-20 transition-colors duration-300 ${navClasses}`}>
            <img 
              onClick={() => user ? navigate('/dashboard') : navigate('/')} 
              src={assets.logo} 
              alt="EngiVerse Logo" 
              className='w-32 h-9 cursor-pointer' 
            />
            {user ? (
                <div className='relative group pb-4 -mb-4'>
                    {user.profilePicture ? (
                        <img 
                            src={user.profilePicture} 
                            alt="Profile" 
                            className="w-10 h-10 rounded-full object-cover cursor-pointer ring-2 ring-transparent group-hover:ring-white/50 transition-all"
                        />
                    ) : (
                        <div className={`w-10 h-10 flex justify-center items-center rounded-full font-bold text-lg cursor-pointer ring-2 ring-transparent group-hover:ring-white/50 transition-all ${isTransparent ? 'bg-white/20 text-white' : 'bg-indigo-600 text-white'}`}>
                            {user.name ? user.name[0].toUpperCase() : '?'}
                        </div>
                    )}
                    <div className='absolute hidden group-hover:block top-full right-0 z-10 mt-2 text-black rounded-md shadow-lg transition-all duration-200 ease-in-out opacity-0 scale-95 invisible group-hover:opacity-100 group-hover:scale-100 group-hover:visible'>
                        <ul className='list-none m-0 bg-white text-sm w-48 border border-gray-100 rounded-md'>
                            <li onClick={() => navigate('/profile')} className='py-2 px-4 hover:bg-gray-100 cursor-pointer'>My Profile</li>
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