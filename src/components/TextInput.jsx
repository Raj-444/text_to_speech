import React, { useRef, useEffect } from 'react';
import { Layers, Trash2, Plus, X } from 'lucide-react';

export default function TextInput({
  text,
  setText,
  batchMode,
  setBatchMode,
  batchItems,
  setBatchItems,
  language
}) {
  const textareaRef = useRef(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current && !batchMode) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [text, batchMode]);

  const handleClear = () => {
    if (batchMode) {
      setBatchItems(['']);
    } else {
      setText('');
    }
  };

  const handlePaste = async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      if (batchMode) {
        // Simple heuristic: split by newlines for batch if they paste a block
        const lines = clipboardText.split('\n').filter(l => l.trim() !== '');
        if (lines.length > 0) {
          const newItems = [...batchItems];
          newItems[newItems.length - 1] += clipboardText; // Paste into current or add new logic
          setBatchItems(newItems);
        }
      } else {
        setText(text + clipboardText);
      }
    } catch (err) {
      console.error('Failed to read clipboard contents: ', err);
    }
  };

  const placeholder = language === 'BN' 
    ? "এখানে আপনার টেক্সট লিখুন (Example: নমস্কার, আমি একটি এআই ভয়েস...)" 
    : "Enter your script here (Example: Hello, welcome to the future of voice generation...)";

  return (
    <div className="flex-1 flex flex-col h-full bg-[#18181b] rounded-2xl border border-zinc-800/50 shadow-sm overflow-hidden flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-zinc-800/50 bg-[#121214]">
        <div className="flex items-center gap-3">
          <h3 className="font-semibold text-zinc-100 flex items-center gap-2">
            Text Editor
            {batchMode && <span className="bg-indigo-500/20 text-indigo-400 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Batch Mode</span>}
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setBatchMode(!batchMode)} 
            className={`text-xs font-medium flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${batchMode ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800'}`}
          >
            <Layers size={14} /> {batchMode ? "Single Mode" : "Batch Mode"}
          </button>
          <div className="h-4 w-[1px] bg-zinc-700/50 mx-1"></div>
          <button onClick={handlePaste} className="text-xs font-medium text-zinc-400 hover:text-zinc-100 px-3 py-1.5 rounded-lg hover:bg-zinc-800 transition-colors">
            Paste
          </button>
          <button onClick={handleClear} className="text-xs font-medium text-zinc-400 hover:text-red-400 flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-red-500/10 transition-colors group">
            <Trash2 size={14} className="group-hover:text-red-400" /> Clear
          </button>
        </div>
      </div>

      {/* Editor Area */}
      <div className="flex-1 overflow-y-auto p-4 bg-[#121214]/50 relative group">
        {!batchMode ? (
          <div className="h-full relative flex flex-col">
             <textarea 
                ref={textareaRef}
                placeholder={placeholder} 
                value={text} 
                onChange={(e) => setText(e.target.value)}
                className="w-full flex-1 bg-transparent border-none text-[15px] leading-relaxed focus:outline-none focus:ring-0 text-zinc-200 resize-none min-h-[300px] placeholder:text-zinc-600" 
              />
              <div className="absolute bottom-2 right-2 px-3 py-1 rounded-md bg-[#18181b] border border-zinc-800 text-[11px] font-medium text-zinc-500">
                {text.length} <span className="opacity-50">/ 5000</span>
              </div>
          </div>
        ) : (
          <div className="space-y-4 pb-10">
            {batchItems.map((item, idx) => (
              <div key={idx} className="relative flex gap-4 items-start group/item">
                <div className="w-8 h-8 rounded-xl bg-zinc-800/50 border border-zinc-700/50 flex-shrink-0 flex items-center justify-center text-xs font-bold text-zinc-400 mt-1 shadow-sm">
                  {idx+1}
                </div>
                <div className="flex-1 relative">
                  <textarea 
                    value={item} 
                    onChange={(e) => { 
                      const n = [...batchItems]; 
                      n[idx] = e.target.value; 
                      setBatchItems(n); 
                    }} 
                    placeholder={`Segment ${idx + 1}...`}
                    className="w-full bg-[#18181b] border border-zinc-800/80 rounded-xl p-4 min-h-[100px] focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-all resize-y text-sm text-zinc-200 placeholder:text-zinc-600" 
                  />
                  {batchItems.length > 1 && (
                    <button 
                      onClick={() => setBatchItems(batchItems.filter((_, i) => i !== idx))} 
                      className="absolute top-3 right-3 p-1.5 rounded-lg bg-[#27272a] text-zinc-400 hover:text-red-400 opacity-0 group-hover/item:opacity-100 transition-all shadow-sm border border-zinc-700/50 hover:border-red-500/20 hover:bg-red-500/10"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
              </div>
            ))}
            <button 
              onClick={() => setBatchItems([...batchItems, ''])} 
              className="w-full py-4 border border-dashed border-zinc-700 rounded-xl text-zinc-400 hover:text-indigo-400 hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all flex items-center justify-center gap-2 text-sm font-medium"
            >
              <Plus size={16} /> Add New Segment
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
