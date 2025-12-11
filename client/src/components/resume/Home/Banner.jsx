import React from 'react'

const Banner = () => {
  return (
    <div className="relative w-full h-10 bg-gradient-to-r from-[#f0fdf4] via-[#dcfce7] to-[#f0fdf4] border-b border-green-200 overflow-hidden flex items-center">
      
      {/* Side Fade Effects (Updated to match Green BG) */}
      <div className="absolute left-0 top-0 h-full w-24 bg-gradient-to-r from-[#f0fdf4] to-transparent z-10"></div>
      <div className="absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-[#f0fdf4] to-transparent z-10"></div>

      {/* Marquee Wrapper */}
      <div className="marquee-track flex items-center whitespace-nowrap">
        {/* Loop content multiple times for seamless effect */}
        {[...Array(10)].map((_, i) => (
          <div key={i} className="flex items-center mx-8">
            <span className="bg-green-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm shadow-green-200 uppercase tracking-wide mr-3">
              New
            </span>
            <span className="text-xs font-medium text-green-900 tracking-wide">
              AI Features Added
            </span>
            
            <span className="mx-4 text-green-400/60">•</span>
            
            <span className="text-xs text-green-800 tracking-wide">
              Crafted by <span className="font-bold text-green-950">Akshat Sharma</span>
            </span>
          </div>
        ))}
      </div>

      <style>{`
        .marquee-track {
          animation: marquee 60s linear infinite;
        }
        
        /* Pause on Hover */
        .marquee-track:hover {
          animation-play-state: paused;
        }

        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  )
}

export default Banner