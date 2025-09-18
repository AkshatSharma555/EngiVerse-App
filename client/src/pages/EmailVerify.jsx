// Filename: client/src/pages/EmailVerify.jsx
// (Updated by your AI assistant to fix errors while keeping your UI)

import React, { useState, useContext, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { assets } from '../assets/assets';
import { AppContent } from '../context/AppContext';

const EmailVerify = () => {
    // FIX 1: Humne context se naye, correct variables liye hain
    const { backendUrl, user, checkUserStatus } = useContext(AppContent);
    const navigate = useNavigate();
    
    // FIX 2: OTP ko store karne ke liye React state banayi hai
    const [otp, setOtp] = useState(new Array(6).fill(""));
    const [loading, setLoading] = useState(false);

    const inputRefs = useRef([]);

    // Page load hote hi pehle input par focus
    useEffect(() => {
        if (inputRefs.current[0]) {
            inputRefs.current[0].focus();
        }
    }, []);

    // FIX 3: useEffect ko naye 'user' object ke saath update kiya hai
    useEffect(() => {
        // Agar user pehle se verified hai, toh usse dashboard par bhej do
        if (user && user.isAccountVerified) {
            navigate('/dashboard');
        }
    }, [user, navigate]);

    // FIX 4: Handlers ko update kiya hai taaki woh 'otp' state ka use karein
    const handleChange = (element, index) => {
        if (isNaN(element.value)) return; // Sirf numbers allow karo
        
        // State update karo
        const newOtp = [...otp];
        newOtp[index] = element.value;
        setOtp(newOtp);

        // Agle input par focus karo
        if (element.value !== "" && index < 5) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace' && otp[index] === '' && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    const handlePaste = (e) => {
        const paste = e.clipboardData.getData('text');
        if (paste.length === 6 && !isNaN(paste)) {
            setOtp(paste.split(''));
            inputRefs.current[5].focus(); // Aakhri input par focus karo
        }
    };

    // FIX 5: onSubmitHandler ko update kiya hai
    const onSubmitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        const finalOtp = otp.join('');

        if (finalOtp.length !== 6) {
            toast.error("Please enter a valid 6-digit OTP.");
            setLoading(false);
            return;
        }

        try {
            const { data } = await axios.post(backendUrl + '/api/auth/verify-account', { otp: finalOtp });
            if (data.success) {
                toast.success(data.message);
                await checkUserStatus(); // User state ko refresh karo
                navigate('/dashboard'); // Dashboard par bhej do
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Verification failed.");
        } finally {
            setLoading(false);
        }
    };
    
    // Aapka UI/JSX bilkul same hai, bas input mein 'value' prop add kiya hai
    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 to-purple-400">
            <img
                onClick={() => navigate("/")}
                src={assets.logo}
                alt=""
                className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer"
            />
            <form onSubmit={onSubmitHandler} className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm">
                <h1 className="text-white text-2xl font-semibold text-center mb-4">
                    Email Verify OTP
                </h1>
                <p className="text-center mb-6 text-indigo-300">
                    Enter the 6-digit code sent to your email id.
                </p>

                <div className='flex justify-between mb-8' onPaste={handlePaste}>
                    {otp.map((value, index) => (
                        <input
                            key={index}
                            type="text"
                            maxLength="1"
                            required
                            className='w-12 h-12 bg-[#333A5C] text-white text-center text-xl rounded-md'
                            ref={el => inputRefs.current[index] = el}
                            value={value} // FIX 6: Input ko state se connect kiya hai
                            onChange={(e) => handleChange(e.target, index)}
                            onKeyDown={(e) => handleKeyDown(e, index)}
                        />
                    ))}
                </div>
                <button 
                    type="submit"
                    disabled={loading}
                    className='w-full py-3 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full disabled:bg-indigo-400 disabled:cursor-not-allowed'
                >
                    {loading ? "Verifying..." : "Verify email"}
                </button>
            </form>
        </div>
    );
};

export default EmailVerify;