
import React from 'react';
import { User, Shield, Lock, Bell, History, Camera, Settings, ArrowLeft, LogOut } from 'lucide-react';
import { User as UserType } from '../types';

interface ProfileProps {
  user: UserType | null;
}

const Profile: React.FC<ProfileProps> = ({ user }) => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 lg:py-24">
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row items-center gap-10 mb-16">
        <div className="relative group">
          <div className="w-32 h-32 rounded-[2.5rem] bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white text-4xl font-black shadow-2xl shadow-violet-500/20">
            {user?.name?.[0].toUpperCase() || 'U'}
          </div>
          <button className="absolute -bottom-2 -right-2 p-3 bg-slate-900 border border-white/10 rounded-2xl text-white shadow-xl hover:bg-violet-600 transition-colors">
            <Camera size={20} />
          </button>
        </div>
        <div className="text-center md:text-left">
          <div className="text-[10px] font-black uppercase tracking-[0.3em] text-violet-500 mb-2">Neural Identity Verified</div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-2">{user?.name}</h1>
          <p className="text-slate-500 font-medium">{user?.email}</p>
          <div className="mt-4 flex items-center justify-center md:justify-start gap-3">
             <div className="px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold tracking-widest uppercase">Protocol Level: Core</div>
             <div className="px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-full text-[10px] font-bold tracking-widest uppercase">Secure Node</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Settings Area */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 px-4">
            <Settings size={20} className="text-violet-500" />
            <h2 className="text-xl font-bold tracking-tight">Identity Settings</h2>
          </div>
          <div className="bg-slate-900/40 border border-white/5 rounded-[2.5rem] overflow-hidden backdrop-blur-xl">
            <ProfileItem icon={<Bell size={18} />} title="Pulse Notifications" value="Optimized" />
            <ProfileItem icon={<Lock size={18} />} title="Post-Quantum MFA" value="Encrypted" />
            <ProfileItem icon={<History size={18} />} title="Terminal Access" value="2 Active" />
          </div>
        </div>

        {/* Security & Health Node Status */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 px-4">
            <Shield size={20} className="text-emerald-500" />
            <h2 className="text-xl font-bold tracking-tight">Security Audit</h2>
          </div>
          <div className="bg-slate-900/40 border border-white/5 rounded-[2.5rem] p-8 backdrop-blur-xl">
             <div className="flex items-center gap-6 mb-8">
                <div className="w-16 h-16 bg-emerald-500/10 text-emerald-500 rounded-3xl flex items-center justify-center">
                  <Shield size={32} />
                </div>
                <div>
                  <h4 className="font-bold text-lg">MediMind Guard</h4>
                  <p className="text-sm opacity-50">Identity protection is active.</p>
                </div>
             </div>
             <p className="text-sm leading-relaxed opacity-60 mb-8 italic">
               "Your biometric signature is isolated from global search registries and only accessible via authenticated clinical endpoints."
             </p>
             <button className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-white/10 transition-colors">
               Rotate Encryption Keys
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProfileItem = ({ icon, title, value }: any) => (
  <div className="flex items-center justify-between p-6 hover:bg-white/5 transition-colors border-b border-white/5 last:border-0">
    <div className="flex items-center gap-4">
      <div className="text-slate-500">{icon}</div>
      <span className="font-bold text-slate-300">{title}</span>
    </div>
    <span className="text-xs font-black uppercase tracking-widest text-violet-500">{value}</span>
  </div>
);

export default Profile;
