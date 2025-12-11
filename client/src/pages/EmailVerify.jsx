import React, { useState, useContext, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { assets } from '../assets/assets';
import { AppContent } from '../context/AppContext';

const EmailVerify = () => {
    axios.defaults.withCredentials = true;
    const { backendUrl, isLoggedin, userData, getUserData } = useContext(AppContent);
    const navigate = useNavigate();

    const [otp, setOtp] = useState(new Array(6).fill(""));
    
    // Yaha humne loading state banayi hai request rokne ke liye
    const [loading, setLoading] = useState(false);

    const inputRefs = useRef([]);

    // Auto-focus on first input
    useEffect(() => {
        if (inputRefs.current[0]) {
            inputRefs.current[0].focus();
        }
    }, []);

    const handleChange = (element, index) => {
        if (isNaN(element.value)) return;
        const newOtp = [...otp];
        newOtp[index] = element.value;
        setOtp(newOtp);
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
        e.preventDefault(); // Default paste behavior roko
        const paste = e.clipboardData.getData('text');
        if (paste.length === 6 && !isNaN(paste)) {
            setOtp(paste.split(''));
            inputRefs.current[5].focus();
        }
    };

    const onSubmitHandler = async (e) => {
        e.preventDefault(); // Page reload roko

        // --- FIX 1: DOUBLE CLICK PROTECTION ---
        // Agar loading chal raha hai, toh click ignore karo
        if (loading) return; 

        const finalOtp = otp.join('');
        if (finalOtp.length !== 6) {
            toast.error("Please enter a valid 6-digit OTP.");
            return;
        }

        try {
            setLoading(true); // Button lock kar do

            const { data } = await axios.post(backendUrl + '/api/auth/verify-account', { otp: finalOtp });

            if (data.success) {
                toast.success(data.message);
                
                // Context update try karo, par agar fail ho toh bhi dashboard bhejo
                try {
                    await getUserData();
                } catch (err) {
                    console.log("Context update skipped");
                }
                
                // --- FIX 2: FORCE NAVIGATION ---
                navigate('/dashboard'); 
            } else {
                toast.error(data.message);
                setLoading(false); // Sirf error aane par button unlock karo
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Verification failed.");
            setLoading(false);
        }
    };

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
                            value={value}
                            onChange={(e) => handleChange(e.target, index)}
                            onKeyDown={(e) => handleKeyDown(e, index)}
                        />
                    ))}
                </div>
                
                {/* Button disable ho jayega jab loading true hoga */}
                <button 
                    type="submit" 
                    disabled={loading}
                    className={`w-full py-3 rounded-full text-white ${loading ? 'bg-gray-500 cursor-not-allowed' : 'bg-gradient-to-r from-indigo-500 to-indigo-900 hover:scale-105 transition-all'}`}
                >
                    {loading ? "Verifying..." : "Verify email"}
                </button>
            </form>
        </div>
    );
};

export default EmailVerify;