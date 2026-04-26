import React, { useState, useEffect, useRef } from 'react';
import { Mic, Settings as SettingsIcon, History, Bell, CheckCircle2, AlertCircle } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

import TextInput from './components/TextInput';
import VoiceControls from './components/VoiceControls';
import AudioPlayer from './components/AudioPlayer';
import HistoryPanel from './components/HistoryPanel';
import Settings from './components/Settings';

export default function App() {
  // UI State
  const [activeTab, setActiveTab] = useState('studio');
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [uiLanguage, setUiLanguage] = useState('EN');
  const [toast, setToast] = useState(null);

  // Content State
  const [text, setText] = useState('');
  const [batchMode, setBatchMode] = useState(false);
  const [batchItems, setBatchItems] = useState(['']);
  
  // Audio Settings State
  const [language, setLanguage] = useState('EN');
  const [voice, setVoice] = useState('Premium Male 1');
  const [speed, setSpeed] = useState(1.0);
  const [pitch, setPitch] = useState(0);
  const [volume, setVolume] = useState(80);
  
  // Generation & Playback State
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [fileName, setFileName] = useState('Untitled_Audio_01');
  const [availableVoices, setAvailableVoices] = useState([]);

  const synth = window.speechSynthesis;
  const currentUtterance = useRef(null);

  useEffect(() => {
    const loadVoices = () => {
      const voices = synth.getVoices();
      setAvailableVoices(voices);
    };
    loadVoices();
    if (synth.onvoiceschanged !== undefined) {
      synth.onvoiceschanged = loadVoices;
    }
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleGenerate = () => {
    const textToSpeak = batchMode ? batchItems.join('. ') : text;
    if (!textToSpeak.trim()) {
      showToast("Please enter some text first", "error");
      return;
    }

    setIsGenerating(true);
    setProgress(0);

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    
    // Attempt to match voice based on language and selection
    const langSearch = language === 'BN' ? 'bn' : 'en';
    const matchedVoice = availableVoices.find(v => 
        v.lang.toLowerCase().includes(langSearch) && 
        (voice.includes('Female') ? (v.name.includes('Female') || v.name.includes('Zira') || v.name.includes('Google')) : true)
    ) || availableVoices[0];
    
    if (matchedVoice) utterance.voice = matchedVoice;
    
    // Map custom pitch (-10 to 10) to Web Speech API pitch (0 to 2, default 1)
    const normalizedPitch = 1 + (pitch / 10);
    
    utterance.rate = speed;
    utterance.pitch = normalizedPitch;
    utterance.volume = volume / 100;

    utterance.onstart = () => {
      setIsPlaying(true);
      let p = 0;
      const interval = setInterval(() => {
        p += 2;
        if (p >= 100 || !synth.speaking) clearInterval(interval);
        setProgress(Math.min(p, 99));
      }, 50);
    };

    utterance.onend = () => {
      setProgress(100);
      setIsGenerating(false);
      setIsPlaying(false);
      showToast("Audio Generated Successfully");
    };

    utterance.onerror = (e) => {
      console.error('Speech error', e);
      setIsGenerating(false);
      setIsPlaying(false);
      if (e.error !== 'interrupted' && e.error !== 'canceled') {
         showToast("Error generating audio", "error");
      }
    };

    currentUtterance.current = utterance;
    synth.cancel();
    synth.speak(utterance);
  };

  const handlePlayPause = () => {
    if (synth.speaking) {
      if (synth.paused) {
        synth.resume();
        setIsPlaying(true);
      } else {
        synth.pause();
        setIsPlaying(false);
      }
    } else {
      // If not speaking, generate and play
      if ((!batchMode && text.trim()) || (batchMode && batchItems.some(i => i.trim()))) {
         handleGenerate();
      }
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#09090b] text-zinc-100 font-sans overflow-hidden">
      
      {/* Top Navigation */}
      <header className="h-14 border-b border-zinc-800/80 bg-[#0c0c0e]/95 backdrop-blur-xl flex items-center justify-between px-6 z-20 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
            <Mic size={18} />
          </div>
          <h1 className="font-bold text-sm tracking-tight">VoxAI Studio</h1>
        </div>
        
        <div className="flex items-center gap-3">
          <button onClick={() => setIsHistoryOpen(true)} className="flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50 transition-colors">
            <History size={14} /> Library
          </button>
          <button className="p-1.5 rounded-md text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50 transition-colors">
            <Bell size={16} />
          </button>
          <button onClick={() => setIsSettingsOpen(true)} className="p-1.5 rounded-md text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50 transition-colors">
            <SettingsIcon size={16} />
          </button>
          <div className="w-8 h-8 rounded-full bg-indigo-500/20 border border-indigo-500/30 overflow-hidden ml-2 cursor-pointer">
            <img src="https://ui-avatars.com/api/?name=User&background=6366f1&color=fff" alt="User" />
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex overflow-hidden relative">
        <div className="flex-1 flex flex-col lg:flex-row p-4 lg:p-6 gap-4 lg:gap-6 overflow-y-auto pb-32">
          
          {/* Left Section: Text Input (60%) */}
          <div className="flex-1 flex flex-col min-w-[50%] lg:max-w-[60%]">
             <TextInput 
                text={text} 
                setText={setText}
                batchMode={batchMode}
                setBatchMode={setBatchMode}
                batchItems={batchItems}
                setBatchItems={setBatchItems}
                language={language}
             />
          </div>

          {/* Right Section: Controls (40%) */}
          <div className="w-full lg:w-[40%] flex flex-col shrink-0">
             <VoiceControls 
                language={language}
                setLanguage={setLanguage}
                voice={voice}
                setVoice={setVoice}
                speed={speed}
                setSpeed={setSpeed}
                pitch={pitch}
                setPitch={setPitch}
                volume={volume}
                setVolume={setVolume}
                isGenerating={isGenerating}
                handleGenerate={handleGenerate}
                text={text}
                batchMode={batchMode}
                availableVoices={availableVoices}
             />
          </div>

        </div>
      </main>

      {/* Bottom Sticky Player */}
      <AudioPlayer 
         isPlaying={isPlaying}
         handlePlayPause={handlePlayPause}
         fileName={fileName}
         voice={voice}
         language={language}
         progress={progress}
         isGenerating={isGenerating}
      />

      {/* Overlays */}
      <HistoryPanel isOpen={isHistoryOpen} onClose={() => setIsHistoryOpen(false)} />
      <Settings isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} uiLanguage={uiLanguage} setUiLanguage={setUiLanguage} />

      {/* Toasts */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 20, x: '-50%' }}
            className={`fixed bottom-32 left-1/2 z-50 px-4 py-3 rounded-xl shadow-2xl border flex items-center gap-3 ${
              toast.type === 'error' 
                ? 'bg-red-500/10 border-red-500/20 text-red-400 backdrop-blur-md' 
                : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 backdrop-blur-md'
            }`}
          >
            {toast.type === 'error' ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
            <span className="text-sm font-medium">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
