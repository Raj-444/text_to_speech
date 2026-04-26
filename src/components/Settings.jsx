import React from 'react';
import { X, Moon, Sun, Globe, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Settings({ isOpen, onClose, uiLanguage, setUiLanguage }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md bg-[#18181b] rounded-2xl shadow-2xl border border-zinc-800/80 overflow-hidden"
          >
            <div className="flex items-center justify-between p-5 border-b border-zinc-800/50 bg-[#121214]">
              <h2 className="font-semibold text-zinc-100">Preferences</h2>
              <button onClick={onClose} className="text-zinc-400 hover:text-zinc-100 transition-colors">
                <X size={18} />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="space-y-4">
                <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Appearance</h3>
                <div className="flex items-center justify-between p-3 rounded-xl bg-[#121214] border border-zinc-800/50">
                  <div className="flex items-center gap-3 text-zinc-300">
                    <Moon size={18} />
                    <span className="text-sm font-medium">Dark Mode</span>
                  </div>
                  <div className="w-10 h-6 bg-indigo-500 rounded-full relative cursor-pointer opacity-80">
                    <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Interface</h3>
                <div className="flex items-center justify-between p-3 rounded-xl bg-[#121214] border border-zinc-800/50">
                  <div className="flex items-center gap-3 text-zinc-300">
                    <Globe size={18} />
                    <span className="text-sm font-medium">UI Language</span>
                  </div>
                  <select 
                    value={uiLanguage}
                    onChange={(e) => setUiLanguage(e.target.value)}
                    className="bg-zinc-800 border border-zinc-700 rounded-lg px-2 py-1 text-sm text-zinc-200 outline-none"
                  >
                    <option value="EN">English</option>
                    <option value="BN">Bangla</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Workflow</h3>
                <div className="flex items-center justify-between p-3 rounded-xl bg-[#121214] border border-zinc-800/50">
                  <div className="flex items-center gap-3 text-zinc-300">
                    <Save size={18} />
                    <span className="text-sm font-medium">Auto-save drafts</span>
                  </div>
                  <div className="w-10 h-6 bg-indigo-500 rounded-full relative cursor-pointer opacity-80">
                    <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
