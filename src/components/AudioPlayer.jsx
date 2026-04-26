import React from 'react';
import { Play, Pause, SkipBack, SkipForward, Download, Volume2, Waves } from 'lucide-react';

export default function AudioPlayer({ 
  isPlaying, 
  handlePlayPause, 
  fileName, 
  voice, 
  language,
  progress,
  isGenerating
}) {
  return (
    <div className="fixed bottom-0 left-0 right-0 h-24 bg-[#0c0c0e]/90 backdrop-blur-xl border-t border-zinc-800/80 z-40 flex items-center px-4 lg:px-8 gap-4 lg:gap-8 shadow-[0_-10px_40px_rgba(0,0,0,0.3)]">
      
      {/* Track Info */}
      <div className="hidden md:flex items-center gap-4 w-64 lg:w-80">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center border border-indigo-500/20 text-indigo-400">
          <Waves size={24} />
        </div>
        <div className="min-w-0">
          <h4 className="text-sm font-semibold text-zinc-100 line-clamp-1 truncate">{fileName || "Untitled Audio"}</h4>
          <p className="text-[11px] text-zinc-500 mt-0.5">{voice} • {language}</p>
        </div>
      </div>

      {/* Main Controls */}
      <div className="flex-1 flex flex-col items-center gap-2">
        <div className="flex items-center gap-4 lg:gap-6">
          <button className="text-zinc-500 hover:text-zinc-300 transition-colors">
            <SkipBack size={18} />
          </button>
          <button 
            onClick={handlePlayPause} 
            className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-white text-zinc-900 flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg hover:shadow-white/10"
          >
            {isPlaying ? <Pause size={20} className="fill-current" /> : <Play size={20} className="ml-1 fill-current" />}
          </button>
          <button className="text-zinc-500 hover:text-zinc-300 transition-colors">
            <SkipForward size={18} />
          </button>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full max-w-xl lg:max-w-3xl flex items-center gap-3 lg:gap-4 px-2">
          <span className="text-[10px] font-mono text-zinc-500 w-8 text-right">0:00</span>
          <div className="flex-1 h-1.5 bg-zinc-800/80 rounded-full relative overflow-hidden group cursor-pointer">
            <div 
              className={`absolute top-0 left-0 h-full bg-indigo-500 rounded-full transition-all duration-300 ${isGenerating ? 'opacity-50' : ''}`} 
              style={{ width: `${isGenerating ? progress : (isPlaying ? '100%' : '0%')}` }} 
            />
            {/* Mock Waveform overlay if we wanted to visually indicate sound */}
          </div>
          <span className="text-[10px] font-mono text-zinc-500 w-8">0:00</span>
        </div>
      </div>

      {/* Right Controls */}
      <div className="hidden md:flex items-center gap-4 w-64 lg:w-80 justify-end">
        <div className="flex items-center gap-2 mr-4">
          <Volume2 size={16} className="text-zinc-500" />
          <div className="w-16 h-1 bg-zinc-800 rounded-full overflow-hidden cursor-pointer">
            <div className="w-4/5 h-full bg-zinc-400 rounded-full"></div>
          </div>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-[#18181b] hover:bg-[#27272a] text-zinc-200 text-xs font-semibold rounded-lg border border-zinc-700/50 transition-colors shadow-sm">
          <Download size={14} /> Export
        </button>
      </div>
    </div>
  );
}
