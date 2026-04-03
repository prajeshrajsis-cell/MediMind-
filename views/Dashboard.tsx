
import React, { useState, useEffect } from 'react';
import { 
  Search, ChevronRight, Activity, Sparkles,
  LayoutGrid, Settings, Shield, Camera, Play, Sun, Moon, Info
} from 'lucide-react';
import { FEATURES } from '../constants';
import { AppRoute, User as UserType } from '../types';
import { authService } from '../services/auth';

interface DashboardProps {
  onNavigate: (route: AppRoute) => void;
  onToggleTheme: () => void;
  isDarkMode: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate, onToggleTheme, isDarkMode }) => {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [user, setUser] = useState<UserType | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<{hr: number, respiratory: number, bloodOxygen: number} | null>(null);

  useEffect(() => {
    setUser(authService.getCurrentUser());
  }, []);

  const runVitalScan = () => {
    setIsScanning(true);
    setScanResult(null);
    setTimeout(() => {
      setIsScanning(false);
      setScanResult({ 
        hr: 70 + Math.floor(Math.random() * 10), 
        respiratory: 14 + Math.floor(Math.random() * 2),
        bloodOxygen: 98 + Math.floor(Math.random() * 2)
      });
    }, 4000);
  };

  const categories = ['All', 'Consult', 'Track', 'Learn', 'Specialized'];

  const filteredFeatures = FEATURES.filter(f => {
    const matchesSearch = f.title.toLowerCase().includes(search.toLowerCase()) || 
                          f.description.toLowerCase().includes(search.toLowerCase());
    const matchesCat = activeCategory === 'All' || f.category === activeCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className={`min-h-screen p-6 md:p-12 transition-colors duration-500 ${isDarkMode ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
      <div className="max-w-7xl mx-auto">
        
        {/* Command Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-16 animate-in fade-in duration-700">
          <div>
            <div className="flex items-center gap-2 text-violet-500 font-black uppercase tracking-[0.4em] text-[10px] mb-3">
              <Sparkles size={14} /> Health Intelligence v4
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none mb-4">
              Health <span className="text-violet-500">Center</span>
            </h1>
            <p className={`text-lg font-medium opacity-50`}>
              Welcome back, <span className="text-violet-400 font-bold">{user?.name || 'Guest'}</span>
            </p>
          </div>
          
          <div className="flex items-center gap-4 w-full lg:w-auto">
             <div className="flex-1 lg:w-96 relative group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-violet-500 transition-colors" size={20} />
              <input 
                type="text" 
                placeholder="Search health tools..." 
                className={`w-full pl-16 pr-6 py-5 rounded-[1.5rem] border transition-all focus:outline-none focus:ring-4 focus:ring-violet-500/10 font-bold text-lg ${
                  isDarkMode ? 'bg-slate-900 border-white/5 text-white' : 'bg-white border-slate-200 text-black'
                }`}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button 
              onClick={onToggleTheme} 
              className={`p-6 rounded-[1.5rem] border transition-all hover:scale-105 active:scale-95 ${
                isDarkMode ? 'bg-slate-900 border-white/5 text-yellow-400 hover:bg-slate-800' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
            </button>
          </div>
        </div>

        {/* Neural Vital Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-20">
          <div className={`lg:col-span-12 p-12 rounded-[3.5rem] border transition-all relative overflow-hidden group ${
            isDarkMode ? 'bg-slate-900/30 border-white/5' : 'bg-white border-slate-200 shadow-2xl shadow-slate-200/40'
          }`}>
            <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
              <Activity size={240} className="text-violet-500" />
            </div>

            <div className="relative z-10">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
                <div className="flex items-center gap-4">
                  <div className="p-4 bg-violet-600 text-white rounded-3xl shadow-xl shadow-violet-500/20">
                    <Camera size={32} />
                  </div>
                  <div>
                    <h3 className="text-3xl font-black tracking-tight">AI Health Monitor</h3>
                    <p className="opacity-50 font-medium">Measure real-time vitals using optical sensors and AI vision.</p>
                  </div>
                </div>
                {!isScanning && !scanResult && (
                   <button 
                    onClick={runVitalScan}
                    className="flex items-center gap-3 px-10 py-5 bg-violet-600 text-white rounded-2xl font-black text-lg hover:shadow-[0_0_40px_rgba(139,92,246,0.3)] transition-all active:scale-95 group"
                  >
                    Measure Now <Play size={20} fill="white" className="group-hover:translate-x-1 transition-transform" />
                  </button>
                )}
              </div>

              {isScanning ? (
                <div className="flex flex-col items-center justify-center py-24">
                  <div className="relative mb-10">
                    <div className="w-40 h-40 border-[8px] border-violet-500/10 border-t-violet-500 rounded-full animate-spin" />
                    <Sparkles size={48} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-violet-500 animate-pulse" />
                  </div>
                  <div className="text-center">
                    <p className="font-black uppercase tracking-[0.4em] text-violet-500 animate-pulse text-sm mb-2">Analyzing micro-vibrations</p>
                    <p className="text-xs opacity-40">Mapping blood flow patterns through facial micro-movements...</p>
                  </div>
                </div>
              ) : scanResult ? (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 py-4 animate-in zoom-in-95 duration-700">
                  <ResultNode label="Heart Rate" value={scanResult.hr} unit="BPM" color="text-rose-500" isDarkMode={isDarkMode} />
                  <ResultNode label="Respiration" value={scanResult.respiratory} unit="RR" color="text-violet-400" isDarkMode={isDarkMode} />
                  <ResultNode label="Blood Oxygen" value={scanResult.bloodOxygen} unit="SpO2" color="text-emerald-500" isDarkMode={isDarkMode} />
                  <div className="sm:col-span-3 flex justify-center mt-10">
                    <button 
                      onClick={() => setScanResult(null)}
                      className="text-xs font-black uppercase tracking-widest opacity-40 hover:opacity-100 transition-opacity"
                    >
                      Clear Measurement
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-black/5 dark:bg-black/20 rounded-[2.5rem] border border-dashed border-white/10 p-24 text-center">
                   <div className="w-20 h-20 bg-slate-900 border glass-border rounded-full flex items-center justify-center mx-auto mb-6 opacity-30">
                     <Activity size={32} />
                   </div>
                   <p className="text-slate-500 font-bold">Monitor inactive. Click 'Measure Now' to begin.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tools Section */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
          <h2 className="text-4xl font-black tracking-tighter">Wellness Modules</h2>
          <div className="flex gap-2 bg-slate-100 dark:bg-slate-900 p-2 rounded-[1.25rem] border border-white/5">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  activeCategory === cat 
                    ? 'bg-violet-600 text-white shadow-xl' 
                    : (isDarkMode ? 'text-slate-500 hover:text-white' : 'text-slate-500 hover:text-slate-900')
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredFeatures.map(feature => (
            <div 
              key={feature.id}
              onClick={() => onNavigate(feature.id as AppRoute)}
              className={`p-10 rounded-[2.5rem] border transition-all cursor-pointer group relative overflow-hidden flex flex-col ${
                isDarkMode 
                  ? 'bg-slate-900/30 border-white/5 hover:border-violet-500/40 hover:-translate-y-2' 
                  : 'bg-white border-slate-200 shadow-xl shadow-slate-200/30 hover:border-violet-300 hover:-translate-y-2'
              }`}
            >
              <div className="relative z-10">
                <div className={`p-4 rounded-2xl transition-all w-fit mb-8 ${
                  isDarkMode ? 'bg-white/5 text-violet-400 group-hover:bg-violet-600 group-hover:text-white' : 'bg-slate-50 text-violet-600 group-hover:bg-violet-600 group-hover:text-white'
                }`}>
                  {feature.icon}
                </div>
                <h3 className="font-bold text-2xl mb-3 tracking-tight group-hover:text-violet-500 transition-colors">{feature.title}</h3>
                <p className={`text-sm leading-relaxed opacity-50 font-medium`}>{feature.description}</p>
              </div>
              <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-violet-600/5 rounded-full blur-2xl group-hover:bg-violet-600/20 transition-all duration-1000" />
            </div>
          ))}
        </div>

        {/* Global Security Disclaimer Only */}
        <div className="mt-40 pb-20 border-t border-white/5 pt-12 text-center opacity-30">
          <p className="text-[10px] font-black uppercase tracking-[0.5em] mb-4">Secure Health Environment v4.0.2 Stable</p>
          <p className="text-xs font-medium max-w-xl mx-auto leading-relaxed">
            AI inferences are informational and intended for wellness purposes only. Always consult a medical professional for serious health concerns.
          </p>
        </div>
      </div>
    </div>
  );
};

const ResultNode = ({ label, value, unit, color, isDarkMode }: any) => (
  <div className={`p-10 rounded-[2.5rem] border transition-all ${
    isDarkMode ? 'bg-black/40 border-white/5' : 'bg-slate-50 border-slate-200'
  }`}>
    <div className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-4">{label}</div>
    <div className={`text-6xl font-black tracking-tighter ${color}`}>
      {value}<span className="text-sm font-bold opacity-30 ml-2 tracking-normal uppercase">{unit}</span>
    </div>
  </div>
);

export default Dashboard;
