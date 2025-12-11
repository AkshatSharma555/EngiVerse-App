import React from 'react'
import { Zap, Bot, FileCheck, Download } from 'lucide-react' // Updated icons import
import Title from './Title'

const Features = () => {
    const [isHover, setIsHover] = React.useState(false);

    return (
        <div id='features' className='flex flex-col items-center my-10 scroll-mt-12'>

            <div className="flex items-center gap-2 text-sm text-green-600 bg-green-400/10 rounded-full px-6 py-1.5 mb-8">
                <Zap width={14} />
                <span>Smart Resume Builder</span>
            </div>

            <Title title='Build your perfect resume' description='Our AI-powered platform helps you craft professional, ATS-friendly resumes in minutes with intelligent suggestions.' />

            <div className="flex flex-col md:flex-row items-center justify-center xl:-mt-10">

                <img className="max-w-2xl w-full xl:-ml-32" src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/features/group-image-1.png" alt="Feature showcase" />

                <div className="px-4 md:px-0" onMouseEnter={() => setIsHover(true)} onMouseLeave={() => setIsHover(false)}>
                    
                    {/* Feature 1: AI Writing */}
                    <div className={"flex items-center justify-center gap-6 max-w-md group cursor-pointer"}>
                        <div className={`p-6 group-hover:bg-violet-100 border border-transparent group-hover:border-violet-300  flex gap-4 rounded-xl transition-colors ${!isHover ? 'border-violet-300 bg-violet-100' : ''}`}>
                            <Bot className="size-8 text-violet-600 shrink-0" /> {/* AI Bot Icon */}
                            <div className="space-y-2">
                                <h3 className="text-base font-semibold text-slate-700">AI-Powered Writing</h3>
                                <p className="text-sm text-slate-600 max-w-xs">Generate professional summaries and bullet points instantly with smart AI suggestions.</p>
                            </div>
                        </div>
                    </div>

                    {/* Feature 2: ATS Friendly */}
                    <div className="flex items-center justify-center gap-6 max-w-md group cursor-pointer">
                        <div className="p-6 group-hover:bg-green-100 border border-transparent group-hover:border-green-300 flex gap-4 rounded-xl transition-colors">
                            <FileCheck className="size-8 text-green-600 shrink-0" /> {/* File Check Icon */}
                            <div className="space-y-2">
                                <h3 className="text-base font-semibold text-slate-700">ATS-Friendly Templates</h3>
                                <p className="text-sm text-slate-600 max-w-xs">Professionally designed templates optimized to pass Applicant Tracking Systems effortlessly.</p>
                            </div>
                        </div>
                    </div>

                    {/* Feature 3: Instant Download */}
                    <div className="flex items-center justify-center gap-6 max-w-md group cursor-pointer">
                        <div className="p-6 group-hover:bg-orange-100 border border-transparent group-hover:border-orange-300 flex gap-4 rounded-xl transition-colors">
                            <Download className="size-8 text-orange-600 shrink-0" /> {/* Download Icon */}
                            <div className="space-y-2">
                                <h3 className="text-base font-semibold text-slate-700">Instant PDF Export</h3>
                                <p className="text-sm text-slate-600 max-w-xs">Download your polished resume in high-quality PDF format with a single click, ready to apply.</p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
            
                * {
                    font-family: 'Poppins', sans-serif;
                }
            `}</style>
        </div>
    )
}

export default Features