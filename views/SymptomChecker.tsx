
import React, { useState } from 'react';
import { 
  Stethoscope, Send, AlertTriangle, Info, RefreshCcw, 
  ChevronRight, Activity, ShieldAlert, Clock, PhoneCall,
  AlertCircle, CheckCircle2, ChevronDown
} from 'lucide-react';
import { geminiService } from '../services/gemini';
import { SymptomAnalysis } from '../types';

const SymptomChecker: React.FC = () => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<SymptomAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);
    try {
      const response = await geminiService.checkSymptoms(input);
      setResult(response);
    } catch (err) {
      setError('Failed to analyze symptoms. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getUrgencyStyles = (level: string) => {
    switch (level) {
      case 'Emergency': return 'bg-rose-600 text-white border-rose-700';
      case 'High': return 'bg-amber-500 text-white border-amber-600';
      case 'Medium': return 'bg-blue-600 text-white border-blue-700';
      case 'Low': return 'bg-emerald-600 text-white border-emerald-700';
      default: return 'bg-slate-600 text-white';
    }
  };

  const getUrgencyIcon = (level: string) => {
    switch (level) {
      case 'Emergency': return <AlertTriangle size={32} />;
      case 'High': return <Clock size={32} />;
      case 'Medium': return <Activity size={32} />;
      case 'Low': return <CheckCircle2 size={32} />;
      default: return <Info size={32} />;
    }
  };

  const reset = () => {
    setResult(null);
    setInput('');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <div className="inline-flex p-4 bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 rounded-[2rem] mb-6 shadow-sm border border-rose-100 dark:border-rose-500/20">
          <Stethoscope size={40} />
        </div>
        <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-3 tracking-tight">AI Symptom Analysis</h1>
        <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          MediMind's clinical intelligence helps you understand your health. Provide as much detail as possible for accurate triaging.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-8">
          {!result ? (
            <div className="bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl shadow-slate-200 dark:shadow-none border border-slate-100 dark:border-white/5 overflow-hidden">
              <div className="p-8 md:p-12">
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="space-y-4">
                    <label className="flex items-center gap-2 text-sm font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">
                      <Activity size={16} /> Patient Assessment
                    </label>
                    <textarea 
                      className="w-full p-8 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/5 rounded-[2rem] focus:outline-none focus:ring-4 focus:ring-rose-500/10 h-64 resize-none transition-all text-xl leading-relaxed placeholder:text-slate-300 dark:placeholder:text-slate-700 text-black dark:text-white font-bold"
                      placeholder="e.g., I have a persistent dull headache behind my left eye for 2 days. It feels worse when looking at screens and I've felt slightly nauseous this morning..."
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                    />
                  </div>
                  
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-4 text-slate-400 dark:text-slate-500">
                      <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center">
                        <ShieldAlert size={24} />
                      </div>
                      <p className="text-sm font-medium leading-tight">
                        Your data is encrypted <br /> & HIPAA compliant.
                      </p>
                    </div>
                    
                    <button 
                      type="submit"
                      disabled={isLoading || !input.trim()}
                      className="w-full sm:w-auto px-12 py-6 bg-rose-600 text-white rounded-[1.5rem] font-black text-xl hover:bg-rose-700 transition-all shadow-xl shadow-rose-200 disabled:opacity-50 flex items-center justify-center gap-4 group"
                    >
                      {isLoading ? (
                        <>Processing... <RefreshCcw size={24} className="animate-spin" /></>
                      ) : (
                        <>Start Analysis <Send size={24} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /></>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          ) : (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-10 duration-700">
              <div className={`rounded-[3rem] p-8 md:p-12 flex flex-col md:flex-row items-center gap-8 border-b-8 ${getUrgencyStyles(result.urgency)} shadow-2xl`}>
                <div className="shrink-0 p-6 bg-white/20 rounded-[2rem] backdrop-blur-md">
                  {getUrgencyIcon(result.urgency)}
                </div>
                <div className="text-center md:text-left">
                  <div className="text-sm font-black uppercase tracking-[0.3em] mb-2 opacity-80">Urgency Level</div>
                  <h2 className="text-4xl md:text-5xl font-black mb-4">{result.urgency}</h2>
                  <p className="text-xl font-medium opacity-90 leading-relaxed max-w-2xl">{result.urgencyExplanation}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-100 dark:border-white/5 shadow-xl">
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-8 flex items-center gap-3">
                    <AlertCircle className="text-blue-500" />
                    Potential Causes
                  </h3>
                  <div className="space-y-6">
                    {result.potentialConditions.map((condition, idx) => (
                      <div key={idx} className="group p-6 bg-slate-50 dark:bg-slate-950 rounded-3xl border border-slate-100 dark:border-white/5 hover:border-blue-200 dark:hover:border-blue-500/30 transition-all">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-black text-slate-800 dark:text-slate-200 text-lg">{condition.name}</h4>
                          <span className="text-[10px] font-black uppercase tracking-widest px-2 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-lg text-slate-500 dark:text-slate-400">
                            {condition.likelihood}
                          </span>
                        </div>
                        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{condition.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-900 text-white rounded-[2.5rem] p-8 shadow-2xl overflow-hidden relative">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -mr-20 -mt-20" />
                  <h3 className="text-2xl font-black mb-8 flex items-center gap-3 relative z-10">
                    <Activity className="text-rose-400" />
                    Plan of Care
                  </h3>
                  <div className="space-y-4 relative z-10">
                    {result.recommendedActions.map((action, idx) => (
                      <div key={idx} className="flex gap-4 items-start bg-white/5 p-4 rounded-2xl border border-white/10">
                        <div className="w-8 h-8 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0 font-black">
                          {idx + 1}
                        </div>
                        <p className="font-medium text-slate-300">{action}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-12 p-6 bg-white/10 rounded-2xl border border-white/10 relative z-10">
                    <div className="text-xs font-black uppercase tracking-widest mb-2 text-rose-300 flex items-center gap-2">
                      <ShieldAlert size={14} /> Medical Note
                    </div>
                    <p className="text-sm text-slate-400 leading-relaxed italic">
                      "{result.disclaimer}"
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-center pt-8">
                <button 
                  onClick={reset}
                  className="flex items-center gap-3 px-12 py-6 bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-white/5 rounded-[2rem] hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-200 dark:hover:border-white/10 text-slate-800 dark:text-white font-black text-xl transition-all shadow-lg"
                >
                  <RefreshCcw size={24} /> New Assessment
                </button>
              </div>
            </div>
          )}

          <div className="bg-amber-50 dark:bg-amber-500/5 border-2 border-amber-100 dark:border-amber-500/20 rounded-[2.5rem] p-8 flex gap-6">
            <div className="shrink-0 p-3 bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 rounded-2xl h-fit">
              <AlertTriangle size={32} />
            </div>
            <div>
              <h4 className="text-lg font-black text-amber-900 dark:text-amber-200 mb-1">Important Safety Information</h4>
              <p className="text-amber-800/80 dark:text-amber-400/80 leading-relaxed text-sm">
                MediMind AI provides informational support. It is not a clinical diagnosis. If you have severe symptoms, go to the nearest ER immediately.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-slate-900 text-white rounded-[2rem] p-8 shadow-xl">
            <h4 className="font-black text-xs uppercase tracking-[0.2em] text-slate-400 mb-4">Emergency Support</h4>
            <div className="space-y-4">
              <a href="tel:911" className="flex items-center justify-between p-4 bg-rose-600 rounded-2xl hover:bg-rose-700 transition-colors">
                <span className="font-bold">Call 911</span>
                <PhoneCall size={18} />
              </a>
              <button className="w-full flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-colors">
                <span className="font-bold text-sm">Nearby ERs</span>
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SymptomChecker;
