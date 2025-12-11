import React from 'react'
import { Github, Star } from 'lucide-react'

const CallToAction = () => {
  return (
    <div className='border-y border-dashed border-slate-200 w-full max-w-5xl mx-auto px-6 sm:px-16 mt-28 bg-slate-50/50'>
        <div className="flex flex-col md:flex-row text-center md:text-left items-center justify-between gap-8 border-x border-dashed border-slate-200 py-16 sm:py-20 -mt-px -mb-px w-full px-10">
            
            {/* Left Content */}
            <div className="flex flex-col gap-2 max-w-lg">
                <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
                    Ready to build your career?
                </h2>
                <p className="text-lg text-slate-600 font-medium">
                    Build a professional resume that helps you stand out.
                </p>
                <div className="flex items-center justify-center md:justify-start gap-2 mt-2 text-sm font-medium text-slate-500">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    <span>Open Source Project by <span className="text-slate-800 font-bold">Akshat Sharma</span></span>
                </div>
            </div>

            {/* Right Button (Green GitHub Star) */}
            <a 
                href="https://github.com/AkshatSharma555" 
                target="_blank" 
                rel="noreferrer"
                className="group relative inline-flex items-center gap-3 px-8 py-4 bg-green-600 text-white rounded-full shadow-xl shadow-green-200 hover:shadow-2xl hover:shadow-green-300 hover:bg-green-700 hover:-translate-y-1 transition-all duration-300"
            >
                {/* GitHub Icon */}
                <Github className="size-5 text-white/90 group-hover:text-white transition-colors" />
                
                <span className="font-semibold tracking-wide">Star on GitHub</span>
                
                {/* Star Icon Badge */}
                <div className="flex items-center justify-center bg-green-700/50 border border-green-500/50 w-8 h-8 rounded-full group-hover:bg-yellow-400/20 group-hover:border-yellow-400/50 transition-all duration-300">
                    <Star className="size-4 text-green-100 group-hover:text-yellow-300 group-hover:fill-yellow-300 transition-all duration-300" />
                </div>
            </a>

        </div>
    </div>
  )
}

export default CallToAction