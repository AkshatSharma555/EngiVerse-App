import React from 'react'

const Footer = () => {
  return (
    <>
      <footer className="w-full bg-gradient-to-r from-white via-green-50/50 to-white pt-16 pb-8 px-6 md:px-12 lg:px-24 text-[13px] text-gray-500 mt-20 border-t border-green-100/50">
        
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between gap-10 md:gap-4">
            
            {/* --- LEFT SECTION: Logo & Navigation Links --- */}
            <div className="flex flex-col md:flex-row gap-8 md:gap-16 lg:gap-24 w-full md:w-auto">
                
                {/* Logo */}
                <div className="shrink-0">
                    <a href="#" className="block hover:opacity-80 transition-opacity">
                       <img src="/logo.svg" alt="logo" className='h-10 w-auto'/>
                    </a>
                </div>

                {/* Navigation Columns */}
                <div className="flex flex-wrap gap-8 sm:gap-12 lg:gap-20">
                    {/* Product Column */}
                    <div>
                        <p className="text-slate-900 font-bold mb-4 text-sm tracking-wide">Product</p>
                        <ul className="space-y-3">
                            <li><a href="/" className="hover:text-green-600 hover:translate-x-1 transition-all duration-300 block">Resume Builder</a></li>
                            <li><a href="/" className="hover:text-green-600 hover:translate-x-1 transition-all duration-300 block">CV Maker</a></li>
                            <li><a href="/" className="hover:text-green-600 hover:translate-x-1 transition-all duration-300 block">Templates</a></li>
                        </ul>
                    </div>

                    {/* Resources Column */}
                    <div>
                        <p className="text-slate-900 font-bold mb-4 text-sm tracking-wide">Resources</p>
                        <ul className="space-y-3">
                            <li><a href="/" className="hover:text-green-600 hover:translate-x-1 transition-all duration-300 block">Career Blog</a></li>
                            <li><a href="/" className="hover:text-green-600 hover:translate-x-1 transition-all duration-300 block">Examples</a></li>
                            <li><a href="/" className="hover:text-green-600 hover:translate-x-1 transition-all duration-300 block">Interview Tips</a></li>
                        </ul>
                    </div>

                    {/* Support Column */}
                    <div>
                        <p className="text-slate-900 font-bold mb-4 text-sm tracking-wide">Support</p>
                        <ul className="space-y-3">
                            <li><a href="/" className="hover:text-green-600 hover:translate-x-1 transition-all duration-300 block">Help Center</a></li>
                            <li><a href="/" className="hover:text-green-600 hover:translate-x-1 transition-all duration-300 block">Contact Us</a></li>
                            <li><a href="/" className="hover:text-green-600 hover:translate-x-1 transition-all duration-300 block">Privacy Policy</a></li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* --- RIGHT SECTION: Tagline, Socials, Credit --- */}
            <div className="flex flex-col items-center md:items-end text-center md:text-right gap-6 shrink-0">
                
                <p className="text-sm font-medium text-slate-600 max-w-[280px] leading-relaxed">
                    Build your professional resume in minutes and land your dream job faster.
                </p>
                
                <div className="flex items-center gap-4">
                    <a href="https://www.linkedin.com/in/akshat-sharma-6664422b3/" target="_blank" rel="noreferrer" className="group bg-white p-2.5 rounded-full shadow-sm border border-slate-200 hover:border-green-400 hover:shadow-green-100 transition-all duration-300">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-linkedin text-slate-500 group-hover:text-green-600 transition-colors"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
                    </a>
                    <a href="http://x.com/AkshatSharma518" target="_blank" rel="noreferrer" className="group bg-white p-2.5 rounded-full shadow-sm border border-slate-200 hover:border-green-400 hover:shadow-green-100 transition-all duration-300">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-twitter text-slate-500 group-hover:text-green-600 transition-colors"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
                    </a>
                    <a href="https://www.youtube.com/@Akshat_sharma." target="_blank" rel="noreferrer" className="group bg-white p-2.5 rounded-full shadow-sm border border-slate-200 hover:border-green-400 hover:shadow-green-100 transition-all duration-300">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-youtube text-slate-500 group-hover:text-green-600 transition-colors"><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/><path d="m10 15 5-3-5-3z"/></svg>
                    </a>
                </div>

                <div className="flex flex-col items-center md:items-end gap-1 mt-2">
                    <p className="text-xs font-medium text-slate-400">© 2025 Resume Builder. All rights reserved.</p>
                    
                    {/* --- YOUR AESTHETIC CREDIT SECTION --- */}
                    <div className="flex items-center gap-1.5 text-sm font-medium text-slate-500">
                        <span className="text-slate-400">Crafted by</span>
                        <a 
                            href="https://www.linkedin.com/in/akshat-sharma-6664422b3/" 
                            target="_blank" 
                            rel="noreferrer"
                            className="bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent font-bold hover:scale-105 transition-transform duration-300 cursor-pointer"
                        >
                            Akshat Sharma
                        </a>
                    </div>
                </div>

            </div>

        </div>
      </footer>

      <style>{`
            @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
            * { font-family: 'Poppins', sans-serif; }
      `}</style>
    </>
  )
}

export default Footer