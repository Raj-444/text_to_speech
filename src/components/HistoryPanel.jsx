import React from 'react';
import { X, Play, Download, Trash2, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function HistoryPanel({ isOpen, onClose }) {
  // Mock history data
  const historyItems = [
    { id: 1, title: 'Intro Narration', date: 'Just now', duration: '0:15', active: true },
    { id: 2, title: 'Product Pitch', date: '2 hours ago', duration: '1:02', active: false },
    { id: 3, title: 'Bangla Welcome', date: 'Yesterday', duration: '0:45', active: false },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          />
          <motion.div 
            initial={{ x: 400 }}
            animate={{ x: 0 }}
            exit={{ x: 400 }}
            transition={{ type: "spring", bounce: 0, duration: 0.3 }}
            className="fixed right-0 top-0 bottom-24 w-80 bg-[#121214] border-l border-zinc-800/80 z-50 shadow-2xl flex flex-col"
          >
            <div className="flex items-center justify-between p-5 border-b border-zinc-800/50">
              <h2 className="font-semibold text-zinc-100">History Library</h2>
              <button onClick={onClose} className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors">
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {historyItems.map(item => (
                <div 
                  key={item.id} 
                  className={`group p-3 rounded-xl border transition-all ${
                    item.active 
                      ? 'bg-indigo-500/10 border-indigo-500/30' 
                      : 'bg-[#18181b] border-zinc-800/50 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <button className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                        item.active ? 'bg-indigo-500 text-white shadow-md' : 'bg-zinc-800 text-zinc-400 group-hover:bg-zinc-700'
                      }`}>
                        <Play size={14} className="ml-0.5 fill-current" />
                      </button>
                      <div>
                        <h4 className={`text-sm font-medium ${item.active ? 'text-indigo-300' : 'text-zinc-200'}`}>
                          {item.title}
                        </h4>
                        <p className="text-[10px] text-zinc-500 flex items-center gap-1 mt-0.5">
                          <Clock size={10} /> {item.date} • {item.duration}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-1.5 rounded text-zinc-400 hover:text-zinc-100 hover:bg-zinc-700/50 transition-colors">
                      <Download size={14} />
                    </button>
                    <button className="p-1.5 rounded text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-4 border-t border-zinc-800/50">
               <button className="w-full py-2 rounded-lg text-xs font-medium text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors">
                 Clear History
               </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
