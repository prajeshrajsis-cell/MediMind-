
import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Loader2, Info, RefreshCcw } from 'lucide-react';
import { geminiService } from '../services/gemini';
import { ChatMessage } from '../types';

const CHAT_STORAGE_KEY = 'medimind_chat_history';

const AIChat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem(CHAT_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [
      { role: 'system', parts: [{ text: "Hello! I'm MediMind AI. How can I assist you with your health today?" }] }
    ];
  });
  
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Persist messages whenever they change
  useEffect(() => {
    localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages));
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', parts: [{ text: input }] };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await geminiService.chat(input);
      setMessages(prev => [...prev, { role: 'model', parts: [{ text: response || "I'm sorry, I couldn't process that." }] }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'model', parts: [{ text: "Error: Could not reach AI server. Please check your connection." }] }]);
    } finally {
      setIsLoading(false);
    }
  };

  const startNewChat = () => {
    if (confirm("Are you sure you want to start a new chat? Your current history will be cleared.")) {
      const initialMsg: ChatMessage = { role: 'system', parts: [{ text: "Hello! I'm MediMind AI. How can I assist you with your health today?" }] };
      setMessages([initialMsg]);
      localStorage.removeItem(CHAT_STORAGE_KEY);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex-1 bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-white/5 overflow-hidden flex flex-col relative">
        
        {/* Chat Header */}
        <div className="p-6 border-b border-slate-100 dark:border-white/5 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Bot size={28} />
            </div>
            <div>
              <h3 className="font-black text-slate-900 dark:text-white tracking-tight">MediMind AI</h3>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Intelligence Active</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={startNewChat}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white transition-all text-xs font-bold"
            >
              <RefreshCcw size={16} /> New Chat
            </button>
            <div className="h-4 w-px bg-slate-200 dark:bg-white/10 hidden md:block" />
            <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 hidden md:flex items-center gap-1">
              <Info size={14} /> HIPAA Secure
            </div>
          </div>
        </div>

        {/* Messages Container */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-8 scroll-smooth no-scrollbar">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
              <div className={`flex gap-4 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center shadow-sm ${
                  msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/5'
                }`}>
                  {msg.role === 'user' ? <User size={20} /> : <Bot size={20} />}
                </div>
                <div className={`p-5 rounded-3xl text-sm leading-relaxed whitespace-pre-wrap font-bold ${
                  msg.role === 'user' 
                    ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/10' 
                    : 'bg-white dark:bg-slate-950 text-black dark:text-white border border-slate-100 dark:border-white/5 shadow-sm'
                }`}>
                  {msg.parts[0].text}
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex gap-4 items-center">
                <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center border border-slate-200 dark:border-white/5">
                  <Bot size={20} className="text-slate-400 dark:text-slate-500" />
                </div>
                <div className="flex gap-1.5 p-5 bg-slate-50 dark:bg-slate-950 rounded-3xl border border-slate-100 dark:border-white/5">
                   <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                   <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                   <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-6 border-t border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-slate-950/50 backdrop-blur-sm">
          <form onSubmit={handleSend} className="relative max-w-4xl mx-auto">
            <input 
              type="text"
              placeholder="Query health symptoms, dosage, or wellness data..."
              className="w-full pl-8 pr-16 py-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-[1.5rem] focus:outline-none focus:ring-4 focus:ring-blue-500/10 font-bold text-black dark:text-white shadow-sm placeholder:text-slate-300 dark:placeholder:text-slate-700 transition-all"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
            />
            <button 
              type="submit"
              disabled={!input.trim() || isLoading}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50 active:scale-95 group"
            >
              <Send size={24} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </button>
          </form>
          <div className="flex justify-center gap-6 mt-4">
             <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">End-to-End Encrypted</div>
             <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">Medically Validated AI</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIChat;
