import React from "react";
import { Video as VideoIcon, Clock } from "lucide-react";

function Video() {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-slate-900 text-white text-center px-6">
      
      <div className="bg-slate-800 p-10 rounded-3xl shadow-xl max-w-lg w-full">
        
        <VideoIcon size={60} className="mx-auto mb-6 text-blue-500" />

        <h1 className="text-3xl font-semibold mb-4">
          AI Video Generator
        </h1>

        <div className="flex items-center justify-center gap-2 bg-yellow-500/20 text-yellow-300 px-4 py-2 rounded-full text-sm mb-6">
          <Clock size={16} />
          Coming Soon
        </div>

        <p className="text-slate-400 text-sm leading-relaxed">
          We're working hard to bring AI-powered video generation to UniGen AI.
          This feature will allow you to generate high-quality videos from text prompts.
          Stay tuned for updates!
        </p>

      </div>

    </div>
  );
}

export default Video;
