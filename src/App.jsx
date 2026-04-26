import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, Settings, History, Trash2, Copy, X, Play, Pause, Download, Volume2, 
  ChevronRight, Plus, Check, AlertCircle, LayoutDashboard, Layers, Moon, Sun, 
  Globe, FastForward, Music, FileAudio, MoreVertical, SkipBack, SkipForward 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SidebarItem = ({ icon: Icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
      active 
        ? 'bg-indigo-500/10 text-indigo-400 shadow-sm' 
        : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50'
    }`}
  >
    <Icon size={20} />
    <span className="font-medium">{label}</span>
  </button>
);

const ControlSlider = ({ label, value, min, max, step, onChange, icon: Icon }) => (
  <div className="space-y-2">
    <div className="flex justify-between items-center text-sm">
      <div className="flex items-center gap-2 text-zinc-400">
        {Icon && <Icon size={16} />}
        <span>{label}</span>
      </div>
      <span className="text-indigo-400 font-mono font-medium">{value}</span>
    </div>
    <input 
      type="range" min={min} max={max} step={step} value={value}
      onChange={(e) => onChange(parseFloat(e.target.value))}
      className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
    />
  </div>
);

const HistoryItem = ({ title, date, duration }) => (
  <div className="group p-4 rounded-xl hover:bg-zinc-800/50 transition-all border border-transparent hover:border-zinc-800">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center text-indigo-400 border border-zinc-800">
          <Play size={16} fill="currentColor" />
        </div>
        <div>
          <h4 className="text-sm font-medium text-zinc-100 line-clamp-1">{title}</h4>
          <p className="text-xs text-zinc-500">{date} • {duration}</p>
        </div>
      </div>
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button className="p-2 text-zinc-400 hover:text-zinc-100"><Download size={16} /></button>
        <button className="p-2 text-zinc-400 hover:text-red-400"><Trash2 size={16} /></button>
      </div>
    </div>
  </div>
);

export default function App() {
  const [text, setText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [language, setLanguage] = useState('EN');
  const [voice, setVoice] = useState('Male 1');
  const [speed, setSpeed] = useState(1.0);
  const [pitch, setPitch] = useState(1.0);
  const [volume, setVolume] = useState(0.8);
  const [activeTab, setActiveTab] = useState('generate');
  const [batchMode, setBatchMode] = useState(false);
  const [batchItems, setBatchItems] = useState(['']);
  const [fileName, setFileName] = useState('untitled_audio');
  const [format, setFormat] = useState('MP3');
  const [isPlaying, setIsPlaying] = useState(false);

  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [text]);

  const handleGenerate = () => {
    if (!text.trim() && !batchMode) return;
    setIsGenerating(true);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) { 
          clearInterval(interval); 
          setIsGenerating(false); 
          return 100; 
        }
        return p + 5;
      });
    }, 100);
  };

  return (
    <div className="flex h-screen bg-[#09090b] text-zinc-100 overflow-hidden font-sans">
      <aside className="w-64 border-r border-zinc-800/50 flex flex-col p-4 bg-zinc-950/20">
        <div className="flex items-center gap-3 px-2 mb-10 mt-2">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
            <Mic size={24} />
          </div>
          <div>
            <h1 className="font-bold text-lg">VoxAI</h1>
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Premium TTS</p>
          </div>
        </div>
        <nav className="flex-1 space-y-1">
          <SidebarItem icon={LayoutDashboard} label="Studio" active={activeTab === 'generate'} onClick={() => setActiveTab('generate')} />
          <SidebarItem icon={History} label="History" active={activeTab === 'history'} onClick={() => setActiveTab('history')} />
          <SidebarItem icon={Settings} label="Settings" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
        </nav>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 relative">
        <header className="h-16 border-b border-zinc-800/50 flex items-center justify-between px-8 bg-zinc-950/50 backdrop-blur-sm sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <h2 className="text-sm font-semibold text-zinc-400">Project /</h2>
            <input value={fileName} onChange={(e) => setFileName(e.target.value)} className="bg-transparent border-none text-sm font-semibold text-zinc-100 hover:bg-zinc-800/50 px-2 py-1 rounded w-48" />
          </div>
          <div className="flex items-center gap-3">
            <div className="flex bg-zinc-900 p-1 rounded-lg border border-zinc-800">
              {['BN', 'EN'].map(l => (
                <button key={l} onClick={() => setLanguage(l)} className={`px-3 py-1 text-xs font-bold rounded-md ${language === l ? 'bg-zinc-800 text-indigo-400' : 'text-zinc-500 hover:text-zinc-300'}`}>{l}</button>
              ))}
            </div>
            <button className="p-2 text-zinc-400 hover:text-zinc-100"><Moon size={18} /></button>
          </div>
        </header>

        <div className="flex-1 flex overflow-hidden">
          <div className="flex-1 flex flex-col border-r border-zinc-800/50 p-8 overflow-y-auto bg-zinc-950/10">
            <div className="max-w-4xl w-full mx-auto space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold">Script Area {batchMode && <span className="ml-2 bg-indigo-500/20 text-indigo-400 text-[10px] px-2 py-0.5 rounded-full uppercase">Batch</span>}</h3>
                <div className="flex items-center gap-2">
                  <button onClick={() => setBatchMode(!batchMode)} className="text-xs font-medium text-zinc-400 hover:text-zinc-100 flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-zinc-800"><Layers size={14} />{batchMode ? "Single" : "Batch"}</button>
                  <button onClick={() => setText('')} className="text-xs font-medium text-zinc-400 hover:text-red-400 flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-zinc-800"><Trash2 size={14} />Clear</button>
                </div>
              </div>

              {!batchMode ? (
                <div className="relative group">
                  <textarea ref={textareaRef} placeholder="Enter your script here..." value={text} onChange={(e) => setText(e.target.value)}
                    className="w-full min-h-[400px] bg-zinc-900/30 border-2 border-zinc-800/50 rounded-2xl p-6 text-xl leading-relaxed focus:outline-none focus:border-indigo-500/50 transition-all resize-none shadow-inner" />
                  <div className="absolute bottom-4 right-6 text-sm text-zinc-500 font-mono">{text.length} <span className="text-zinc-700">/ 5000</span></div>
                </div>
              ) : (
                <div className="space-y-4">
                  {batchItems.map((item, idx) => (
                    <div key={idx} className="relative flex gap-4 items-start">
                      <div className="w-8 h-8 rounded-full bg-zinc-800 flex-shrink-0 flex items-center justify-center text-xs font-bold text-zinc-500 mt-2">{idx+1}</div>
                      <textarea value={item} onChange={(e) => { const n = [...batchItems]; n[idx] = e.target.value; setBatchItems(n); }} placeholder={`Scene ${idx + 1}...`}
                        className="flex-1 bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 min-h-[100px] focus:outline-none focus:border-indigo-500 transition-all resize-none" />
                      <button onClick={() => setBatchItems(batchItems.filter((_, i) => i !== idx))} className="p-2 text-zinc-600 hover:text-red-400 mt-2"><X size={16} /></button>
                    </div>
                  ))}
                  <button onClick={() => setBatchItems([...batchItems, ''])} className="w-full py-4 border-2 border-dashed border-zinc-800 rounded-xl text-zinc-500 hover:text-zinc-300 hover:border-zinc-700 transition-all flex items-center justify-center gap-2"><Plus size={18} />Add Segment</button>
                </div>
              )}
            </div>
          </div>

          <div className="w-80 flex flex-col p-6 space-y-8 overflow-y-auto bg-zinc-950/30">
            <section className="space-y-4">
              <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2"><Music size={14} />Voice Selection</h4>
              <div className="space-y-3">
                <select value={language} onChange={(e) => setLanguage(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 appearance-none cursor-pointer">
                  <option value="EN">English (US)</option><option value="BN">Bangla (Bangladesh)</option>
                </select>
                <div className="grid grid-cols-2 gap-2">
                  {['Male 1', 'Male 2', 'Female 1', 'Female 2'].map((v) => (
                    <button key={v} onClick={() => setVoice(v)} className={`py-2 px-3 rounded-lg text-xs font-medium border transition-all ${voice === v ? 'bg-indigo-500/10 border-indigo-500 text-indigo-400' : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700'}`}>{v}</button>
                  ))}
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2"><Settings size={14} />Audio Controls</h4>
              <ControlSlider label="Speed" icon={FastForward} value={speed} min={0.5} max={2.0} step={0.1} onChange={setSpeed} />
              <ControlSlider label="Pitch" icon={Music} value={pitch} min={0.5} max={1.5} step={0.1} onChange={setPitch} />
              <ControlSlider label="Volume" icon={Volume2} value={volume} min={0} max={1.0} step={0.01} onChange={setVolume} />
            </section>

            <section className="space-y-4 pt-4 border-t border-zinc-800">
              <button disabled={isGenerating || (!text.trim() && !batchMode)} onClick={handleGenerate}
                className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all relative overflow-hidden shadow-xl ${isGenerating ? 'bg-zinc-800 text-zinc-500' : 'bg-indigo-600 text-white hover:bg-indigo-500'}`}>
                {isGenerating ? <><div className="animate-spin rounded-full h-5 w-5 border-2 border-zinc-600 border-t-zinc-400" />Generating...</> : <><Play size={20} fill="white" />Generate Audio</>}
                {isGenerating && <div className="absolute bottom-0 left-0 h-1 bg-white/20 transition-all" style={{ width: `${progress}%` }} />}
              </button>
            </section>
          </div>
        </div>

        <div className="h-24 bg-zinc-900 border-t border-zinc-800 flex items-center px-8 gap-8 relative z-20">
          <div className="flex items-center gap-4 w-64">
            <div className="w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center border border-zinc-700 text-indigo-400"><FileAudio size={24} /></div>
            <div className="min-w-0"><h4 className="text-sm font-bold line-clamp-1">{fileName}</h4><p className="text-xs text-zinc-500">{voice} • {language}</p></div>
          </div>
          <div className="flex-1 flex flex-col items-center gap-2">
            <div className="flex items-center gap-6">
              <button className="text-zinc-500 hover:text-zinc-100"><SkipBack size={20} /></button>
              <button onClick={() => setIsPlaying(!isPlaying)} className="w-12 h-12 rounded-full bg-zinc-100 text-background flex items-center justify-center hover:scale-105 transition-all">{isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} className="ml-1" fill="currentColor" />}</button>
              <button className="text-zinc-500 hover:text-zinc-100"><SkipForward size={20} /></button>
            </div>
            <div className="w-full max-w-2xl flex items-center gap-4">
              <span className="text-[10px] font-mono text-zinc-500">0:00</span>
              <div className="flex-1 h-1 bg-zinc-800 rounded-full relative"><div className="absolute top-0 left-0 h-full bg-indigo-500 rounded-full" style={{ width: '0%' }} /></div>
              <span className="text-[10px] font-mono text-zinc-500">0:00</span>
            </div>
          </div>
          <div className="flex items-center gap-4 w-64 justify-end">
            <button className="bg-zinc-800 hover:bg-zinc-700 text-zinc-100 px-6 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2"><Download size={18} />Download</button>
          </div>
        </div>
      </main>

      <AnimatePresence>
        {activeTab === 'history' && (
          <motion.div initial={{ x: 300 }} animate={{ x: 0 }} exit={{ x: 300 }} className="absolute top-16 right-0 bottom-24 w-80 bg-zinc-950 border-l border-zinc-800 z-30 shadow-2xl p-6">
            <div className="flex items-center justify-between mb-6"><h3 className="font-bold">History</h3><button onClick={() => setActiveTab('generate')}><X size={18} /></button></div>
            <div className="space-y-2 overflow-y-auto max-h-full"><HistoryItem title="Sample Project" date="Today" duration="0:45" /></div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {progress === 100 && !isGenerating && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="fixed bottom-28 left-1/2 -translate-x-1/2 bg-zinc-900 border border-zinc-800 px-6 py-3 rounded-xl flex items-center gap-3 shadow-2xl z-50">
            <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500"><Check size={14} /></div>
            <span className="text-sm font-medium">Generation complete!</span>
            <button onClick={() => setProgress(0)} className="ml-4 text-zinc-500"><X size={14} /></button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
