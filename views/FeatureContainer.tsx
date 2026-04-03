
import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, Loader2, Info, Book, Brain, Shield, Leaf, Plus, Apple, Mic, Briefcase, 
  RefreshCcw, ChevronRight, Globe 
} from 'lucide-react';
import { geminiService } from '../services/gemini';

interface FeatureContainerProps {
  title: string;
  context: string;
  placeholder: string;
  icon: 'book' | 'brain' | 'shield' | 'leaf' | 'plus' | 'apple' | 'mic' | 'briefcase' | 'globe';
}

const FeatureContainer: React.FC<FeatureContainerProps> = ({ title, context, placeholder, icon }) => {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const getIcon = () => {
    switch (icon) {
      case 'book': return <Book size={32} />;
      case 'brain': return <Brain size={32} />;
      case 'shield': return <Shield size={32} />;
      case 'leaf': return <Leaf size={32} />;
      case 'plus': return <Plus size={32} />;
      case 'apple': return <Apple size={32} />;
      case 'mic': return <Mic size={32} />;
      case 'briefcase': return <Briefcase size={32} />;
      case 'globe': return <Globe size={32} />;
      default: return <Plus size={32} />;
    }
  };

  const getColorClass = () => {
    switch (icon) {
      case 'shield': return 'text-rose-600 bg-rose-50';
      case 'leaf': return 'text-emerald-600 bg-emerald-50';
      case 'plus': return 'text-blue-600 bg-blue-50';
      case 'globe': return 'text-violet-600 bg-violet-50';
      default: return 'text-blue-600 bg-blue-50';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    setIsLoading(true);
    try {
      const response = await geminiService.chat(input, context);
      setResult(response);
    } catch (err) {
      alert("Error reaching MediMind Intelligence. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <div className={`inline-flex p-4 rounded-2xl mb-4 ${getColorClass()}`}>
          {getIcon()}
        </div>
        <h1 className="text-3xl font-bold mb-2">{title}</h1>
        <p className="text-slate-500 max-w-lg mx-auto">AI-powered support specialized for your wellness needs.</p>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden">
        {!result ? (
          <div className="p-8 md:p-12">
            <form onSubmit={handleSubmit}>
              <textarea 
                className="w-full p-8 bg-slate-50 border border-slate-200 rounded-3xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 h-48 resize-none transition-all text-lg text-black font-bold"
                placeholder={placeholder}
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <div className="mt-8 flex justify-end">
                <button 
                  disabled={isLoading || !input.trim()}
                  className="px-10 py-5 bg-blue-600 text-white rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all flex items-center gap-3 disabled:opacity-50"
                >
                  {isLoading ? <Loader2 className="animate-spin" /> : <>Get Insight <ChevronRight size={20} /></>}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="p-8 md:p-12">
            <div className="prose prose-slate max-w-none">
              <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 whitespace-pre-wrap leading-relaxed text-black font-medium text-lg">
                {result}
              </div>
            </div>
            <div className="mt-12 flex justify-between items-center">
              <div className="flex items-center gap-2 text-slate-400 text-sm">
                <Info size={16} /> Specialized MediMind {title} Engine
              </div>
              <button 
                onClick={() => {setResult(null); setInput('');}}
                className="flex items-center gap-2 px-6 py-3 border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-600 font-bold"
              >
                <RefreshCcw size={18} /> Ask Another
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeatureContainer;
