
import React, { useState } from 'react';
import { Pill, Search, ShieldAlert, CheckCircle, Info, Loader2, AlertTriangle, AlertCircle, HelpCircle } from 'lucide-react';
import { geminiService } from '../services/gemini';
import { MedicineInfo, MedicineInteraction } from '../types';

const MedDatabase: React.FC = () => {
  const [query, setQuery] = useState('');
  const [medInfo, setMedInfo] = useState<MedicineInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || isLoading) return;

    setIsLoading(true);
    try {
      const data = await geminiService.getMedicineInfo(query);
      setMedInfo(data);
    } catch (err) {
      alert("Medicine not found. Try generic names like 'Ibuprofen'.");
    } finally {
      setIsLoading(false);
    }
  };

  const getSeverityStyles = (severity: string) => {
    switch (severity) {
      case 'High':
        return {
          bg: 'bg-rose-50',
          border: 'border-rose-200',
          text: 'text-rose-700',
          icon: <AlertCircle className="text-rose-500" size={18} />,
          badge: 'bg-rose-100 text-rose-700'
        };
      case 'Moderate':
        return {
          bg: 'bg-amber-50',
          border: 'border-amber-200',
          text: 'text-amber-700',
          icon: <AlertTriangle className="text-amber-500" size={18} />,
          badge: 'bg-amber-100 text-amber-700'
        };
      default:
        return {
          bg: 'bg-blue-50',
          border: 'border-blue-200',
          text: 'text-blue-700',
          icon: <HelpCircle className="text-blue-500" size={18} />,
          badge: 'bg-blue-100 text-blue-700'
        };
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <div className="inline-flex p-3 bg-indigo-50 text-indigo-600 rounded-2xl mb-4">
          <Pill size={32} />
        </div>
        <h1 className="text-3xl font-bold mb-2">Medicine Information</h1>
        <p className="text-slate-500">Check uses, side effects, and warnings for thousands of medicines.</p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-lg border border-slate-100 dark:border-white/5 overflow-hidden">
        <div className="p-8 border-b border-slate-50 dark:border-white/5">
          <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text"
              placeholder="Enter medicine name (e.g. Metformin, Aspirin)..."
              className="w-full pl-12 pr-32 py-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-medium dark:text-white"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button 
              type="submit"
              disabled={isLoading}
              className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="animate-spin" size={20} /> : 'Search'}
            </button>
          </form>
        </div>

        {medInfo ? (
          <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                {medInfo.name} <span className="text-xs px-2 py-1 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-md font-bold uppercase">Verified info</span>
              </h2>
              
              <div>
                <h4 className="font-bold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2"><CheckCircle size={18} className="text-emerald-500" /> Primary Uses</h4>
                <ul className="space-y-2">
                  {medInfo.uses.map((u: string, i: number) => (
                    <li key={i} className="text-slate-600 dark:text-slate-400 text-sm bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-100 dark:border-white/5">{u}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2"><Info size={18} className="text-blue-500" /> Side Effects</h4>
                <div className="flex flex-wrap gap-2">
                  {medInfo.sideEffects.map((s: string, i: number) => (
                    <span key={i} className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-lg text-xs font-medium">{s}</span>
                  ))}
                </div>
              </div>

              <div className="bg-rose-50 dark:bg-rose-500/5 border border-rose-100 dark:border-rose-500/20 rounded-2xl p-6">
                <h4 className="font-bold text-rose-800 dark:text-rose-400 mb-4 flex items-center gap-2"><ShieldAlert size={20} /> Critical Warnings</h4>
                <ul className="space-y-3">
                  {medInfo.warnings.map((w: string, i: number) => (
                    <li key={i} className="text-sm text-rose-700 dark:text-rose-300/80 leading-relaxed">• {w}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-white/5 rounded-2xl p-6">
                <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
                  <AlertTriangle size={20} className="text-amber-500" /> 
                  Drug Interactions
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 font-medium">Potential conflicts with other substances, food, or lifestyle factors.</p>
                
                <div className="space-y-4">
                  {medInfo.interactions.map((interaction: MedicineInteraction, i: number) => {
                    const styles = getSeverityStyles(interaction.severity);
                    return (
                      <div key={i} className={`${styles.bg} dark:bg-opacity-10 ${styles.border} dark:border-opacity-20 border rounded-xl p-4 transition-all hover:shadow-md`}>
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-2">
                            {styles.icon}
                            <span className={`font-bold text-sm ${styles.text} dark:text-white`}>{interaction.substance}</span>
                          </div>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${styles.badge} dark:bg-opacity-20`}>
                            {interaction.severity} Severity
                          </span>
                        </div>
                        
                        <div className="pl-6 space-y-2">
                          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-tight">Type: {interaction.type}</p>
                          <p className="text-sm text-slate-700 dark:text-slate-300 leading-snug"><span className="font-bold">Effect:</span> {interaction.effect}</p>
                          <div className="mt-3 pt-3 border-t border-white/20">
                            <p className={`text-sm font-bold ${styles.text} dark:text-white`}>Advice:</p>
                            <p className="text-sm text-slate-600 dark:text-slate-400 italic">{interaction.advice}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-20 text-center text-slate-400">
            <Pill size={48} className="mx-auto mb-4 opacity-20" />
            <p>Search for a medicine to view detailed clinical data.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MedDatabase;
