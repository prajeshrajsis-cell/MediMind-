
import React from 'react';
import { AlertTriangle, Phone, MapPin, ShieldAlert, Heart, Siren } from 'lucide-react';

const EmergencyAlert: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="bg-rose-600 rounded-[2.5rem] p-8 md:p-12 text-white shadow-2xl shadow-rose-200 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-8">
            <div className="bg-white/20 p-4 rounded-3xl backdrop-blur-md">
              <ShieldAlert size={48} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-5xl font-extrabold mb-2">Emergency Hub</h1>
              <p className="text-rose-100 text-lg">Immediate triage and life-saving assistance.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <a href="tel:911" className="bg-white text-rose-600 p-8 rounded-[2rem] flex items-center justify-between group hover:bg-rose-50 transition-colors">
              <div>
                <div className="text-sm font-bold uppercase tracking-widest mb-1 opacity-60">Call Emergency</div>
                <div className="text-4xl font-black">911</div>
              </div>
              <Phone size={40} className="group-hover:scale-110 transition-transform" />
            </a>
            
            <div className="bg-rose-700/50 p-8 rounded-[2rem] border border-white/10 flex items-center justify-between">
              <div>
                <div className="text-sm font-bold uppercase tracking-widest mb-1 opacity-60">Nearest ER</div>
                <div className="text-xl font-bold">City General Hospital</div>
                <div className="text-sm text-rose-200">1.2 miles • 4 min away</div>
              </div>
              <MapPin size={40} className="text-rose-300" />
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl font-bold border-b border-white/20 pb-4">Check for Critical Red Flags</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <RedFlag text="Chest pain or pressure" />
              <RedFlag text="Difficulty breathing" />
              <RedFlag text="Sudden numbness or weakness" />
              <RedFlag text="Severe allergic reaction" />
              <RedFlag text="Uncontrollable bleeding" />
              <RedFlag text="Loss of consciousness" />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        <EmergencyCard icon={<Siren size={24} />} title="Ambulance" desc="Request transport for immobile patients." />
        <EmergencyCard icon={<Heart size={24} />} title="CPR Guide" desc="Instant visual steps for resuscitation." />
        <EmergencyCard icon={<Phone size={24} />} title="Poison Control" desc="Direct line for toxin emergencies." />
      </div>
    </div>
  );
};

const RedFlag = ({ text }: { text: string }) => (
  <div className="flex items-center gap-3 bg-white/10 p-4 rounded-2xl">
    <AlertTriangle size={20} className="text-rose-300 shrink-0" />
    <span className="font-medium">{text}</span>
  </div>
);

const EmergencyCard = ({ icon, title, desc }: any) => (
  <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all cursor-pointer">
    <div className="text-rose-600 mb-4">{icon}</div>
    <h3 className="font-bold mb-2">{title}</h3>
    <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
  </div>
);

export default EmergencyAlert;
