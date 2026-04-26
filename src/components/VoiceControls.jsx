import React from 'react';
import { Volume2, Activity, FastForward, Globe, User, VolumeX } from 'lucide-react';

const SliderControl = ({ label, value, min, max, step, onChange, icon: Icon, unit = "" }) => (
  <div className="space-y-2">
    <div className="flex justify-between items-center text-sm">
      <div className="flex items-center gap-2 text-zinc-400 font-medium text-xs">
        <Icon size={14} className="opacity-70" />
        {label}
      </div>
      <span className="text-zinc-200 font-mono text-xs bg-[#27272a] px-2 py-0.5 rounded border border-zinc-700/50">
        {value > 0 && label === 'Pitch' ? '+' : ''}{value}{unit}
      </span>
    </div>
    <div className="relative flex items-center group">
      <input 
        type="range" 
        min={min} max={max} step={step} 
        value={value} 
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-1.5 bg-zinc-800 rounded-full appearance-none cursor-pointer outline-none focus:ring-2 focus:ring-indigo-500/20"
        style={{
          background: `linear-gradient(to right, #6366f1 ${(value - min) / (max - min) * 100}%, #27272a ${(value - min) / (max - min) * 100}%)`
        }}
      />
      {/* Custom thumb styles are in global CSS or tailwind config, using inline gradient for track progress */}
    </div>
  </div>
);

export default function VoiceControls({
  language,
  setLanguage,
  voice,
  setVoice,
  speed,
  setSpeed,
  pitch,
  setPitch,
  volume,
  setVolume,
  isGenerating,
  handleGenerate,
  text,
  batchMode,
  availableVoices
}) {

  // Group voices by lang or type if we have them, else just default
  const filteredVoices = availableVoices.length > 0 
    ? availableVoices.filter(v => v.lang.toLowerCase().includes(language === 'BN' ? 'bn' : 'en'))
    : [{ name: 'Default System Voice', lang: 'en-US' }, { name: 'Premium Male 1', lang: 'en-US' }, { name: 'Premium Female 1', lang: 'en-US'}];

  // If filtered is empty, fallback
  const displayVoices = filteredVoices.length > 0 ? filteredVoices : [{name: 'Fallback Voice', lang: language}];

  return (
    <div className="w-full lg:w-[380px] flex flex-col gap-4">
      {/* Voice Selection Panel */}
      <div className="bg-[#18181b] rounded-2xl border border-zinc-800/50 shadow-sm p-5 space-y-5">
        <div className="flex items-center gap-2 pb-3 border-b border-zinc-800/50">
          <Globe size={16} className="text-indigo-400" />
          <h3 className="text-sm font-semibold text-zinc-100">Voice Settings</h3>
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-zinc-400 ml-1">Language / Accent</label>
            <div className="relative">
              <select 
                value={language} 
                onChange={(e) => setLanguage(e.target.value)} 
                className="w-full bg-[#121214] border border-zinc-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 appearance-none text-zinc-200 transition-colors"
              >
                <option value="EN">English (US)</option>
                <option value="BN">Bangla (Bangladesh)</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-50">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-zinc-400 ml-1">Voice Actor</label>
            <div className="relative">
              <select 
                value={voice} 
                onChange={(e) => setVoice(e.target.value)} 
                className="w-full bg-[#121214] border border-zinc-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 appearance-none text-zinc-200 pr-10"
              >
                {displayVoices.map((v, i) => (
                  <option key={i} value={v.name}>{v.name}</option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500">
                <Volume2 size={14} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Audio Controls Panel */}
      <div className="bg-[#18181b] rounded-2xl border border-zinc-800/50 shadow-sm p-5 space-y-6">
        <div className="flex items-center gap-2 pb-3 border-b border-zinc-800/50">
          <Activity size={16} className="text-indigo-400" />
          <h3 className="text-sm font-semibold text-zinc-100">Audio Profile</h3>
        </div>

        <div className="space-y-5">
          <SliderControl label="Playback Speed" icon={FastForward} value={speed} min={0.5} max={2.0} step={0.1} onChange={setSpeed} unit="x" />
          <SliderControl label="Voice Pitch" icon={Activity} value={pitch} min={-10} max={10} step={0.5} onChange={setPitch} />
          <SliderControl label="Volume Level" icon={Volume2} value={volume} min={0} max={100} step={1} onChange={setVolume} unit="%" />
        </div>
      </div>

      {/* Generate Action */}
      <div className="mt-auto pt-2">
        <button 
          disabled={isGenerating || (!text.trim() && !batchMode)} 
          onClick={handleGenerate}
          className={`w-full py-3.5 rounded-xl font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-sm ${
            isGenerating 
              ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700' 
              : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-500/20 hover:shadow-indigo-500/40 border border-indigo-500/50 active:scale-[0.98]'
          }`}
        >
          {isGenerating ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-zinc-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating Speech...
            </>
          ) : (
            <>
              <Volume2 size={16} /> Generate Speech {batchMode ? '(Batch)' : ''}
            </>
          )}
        </button>
      </div>
    </div>
  );
}
