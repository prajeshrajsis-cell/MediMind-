
import React, { useState, useEffect } from 'react';
import { 
  User as UserIcon, Menu, X, Sun, Moon, Sparkles, LogOut
} from 'lucide-react';
import { AppRoute, User as UserType } from './types';
import { authService } from './services/auth';

// Views
import Auth from './views/Auth';
import Dashboard from './views/Dashboard';
import SymptomChecker from './views/SymptomChecker';
import HealthTracker from './views/HealthTracker';
import AIChat from './views/AIChat';
import LabAnalyzer from './views/LabAnalyzer';
import MedDatabase from './views/MedDatabase';
import EmergencyAlert from './views/EmergencyAlert';
import FeatureContainer from './views/FeatureContainer';
import MedicalRecords from './views/MedicalRecords';
import Profile from './views/Profile';

const App: React.FC = () => {
  const [route, setRoute] = useState<AppRoute | null>(null);
  const [user, setUser] = useState<UserType | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [hasApiKey, setHasApiKey] = useState<boolean>(true);

  useEffect(() => {
    const checkApiKey = async () => {
      if (window.aistudio && typeof window.aistudio.hasSelectedApiKey === 'function') {
        const has = await window.aistudio.hasSelectedApiKey();
        setHasApiKey(has);
      }
    };
    checkApiKey();
  }, []);

  const handleConnectKey = async () => {
    if (window.aistudio && typeof window.aistudio.openSelectKey === 'function') {
      await window.aistudio.openSelectKey();
      setHasApiKey(true);
    }
  };

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      // Hide landing page if user is already logged in
      const landingUi = document.getElementById('landing-ui');
      if (landingUi) landingUi.classList.add('hidden-ui');
      setRoute(AppRoute.DASHBOARD);
    }
  }, []);

  useEffect(() => {
    // Listen for launch events from static index.html
    const handleLaunch = (e: any) => {
      const mode = e.detail.mode;
      if (mode === 'login') setRoute(AppRoute.LOGIN);
      else if (mode === 'signup') setRoute(AppRoute.SIGNUP);
      else setRoute(AppRoute.DASHBOARD);
    };

    window.addEventListener('medimind:launch', handleLaunch);
    return () => window.removeEventListener('medimind:launch', handleLaunch);
  }, []);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  const handleAuthSuccess = (authenticatedUser: UserType) => {
    setUser(authenticatedUser);
    setRoute(AppRoute.DASHBOARD);
  };

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    setRoute(null);
    setIsMenuOpen(false);
    setIsDarkMode(true);
    // Show static landing page again
    window.dispatchEvent(new CustomEvent('medimind:reset'));
  };

  const navigate = (newRoute: AppRoute) => {
    if (!user && ![AppRoute.LOGIN, AppRoute.SIGNUP, AppRoute.FORGOT_PASSWORD].includes(newRoute)) {
      setRoute(AppRoute.LOGIN);
      return;
    }
    setRoute(newRoute);
    setIsMenuOpen(false);
    window.scrollTo(0, 0);
  };

  const renderContent = () => {
    if (!route) return null; // Static HTML is visible

    const publicRoutes = [AppRoute.LOGIN, AppRoute.SIGNUP, AppRoute.FORGOT_PASSWORD];
    if (!user && !publicRoutes.includes(route)) {
      return <Auth initialMode="login" onAuthSuccess={handleAuthSuccess} onNavigate={navigate} />;
    }

    switch (route) {
      case AppRoute.LOGIN:
        return <Auth initialMode="login" onAuthSuccess={handleAuthSuccess} onNavigate={navigate} />;
      case AppRoute.SIGNUP:
        return <Auth initialMode="signup" onAuthSuccess={handleAuthSuccess} onNavigate={navigate} />;
      case AppRoute.DASHBOARD:
        return <Dashboard onNavigate={navigate} onToggleTheme={toggleTheme} isDarkMode={isDarkMode} />;
      case AppRoute.SYMPTOM_CHECKER:
        return <SymptomChecker />;
      case AppRoute.HEALTH_TRACKER:
        return <HealthTracker />;
      case AppRoute.AI_CHAT:
        return <AIChat />;
      case AppRoute.LAB_ANALYZER:
        return <LabAnalyzer />;
      case AppRoute.MED_INFO:
        return <MedDatabase />;
      case AppRoute.EMERGENCY:
        return <EmergencyAlert />;
      case AppRoute.PROFILE:
        return <Profile user={user} />;
      
      // Feature Mappings
      case AppRoute.DISEASE_EDU:
        return <FeatureContainer icon="book" title="Disease Library" context="Provide detailed medical education on specific diseases." placeholder="Enter a condition name..." />;
      case AppRoute.MENTAL_HEALTH:
        return <FeatureContainer icon="brain" title="Mental Wellness" context="Provide compassionate mental health support." placeholder="How are you feeling today?" />;
      case AppRoute.RECORDS:
        return <MedicalRecords />;
      case AppRoute.INTERACTIONS:
        return <FeatureContainer icon="shield" title="Drug Interactions" context="Identify interactions." placeholder="List medications..." />;
      case AppRoute.VAX_TRACKER:
        return <FeatureContainer icon="plus" title="Vax Tracker" context="Immunization schedules." placeholder="Ask about vaccines..." />;
      case AppRoute.LIFESTYLE:
        return <FeatureContainer icon="leaf" title="Lifestyle Tips" context="Wellness recommendations." placeholder="Ask about daily habits..." />;
      case AppRoute.BOOKING:
        return <FeatureContainer icon="plus" title="Appointments" context="Appointment preparation." placeholder="Preparing for a visit?" />;
      case AppRoute.VOICE_CONSULT:
        return <FeatureContainer icon="mic" title="Voice Consultation" context="Voice assistant." placeholder="Listening..." />;
      case AppRoute.IMAGE_ANALYSIS:
        return <LabAnalyzer mode="rash" title="Rash Analysis" subtitle="AI visual skin evaluation." />;
      case AppRoute.HEALTH_INSIGHTS:
        return <FeatureContainer icon="plus" title="Health Insights" context="Analyze trends." placeholder="Describe health trends..." />;
      case AppRoute.CHRONIC_CARE:
        return <FeatureContainer icon="plus" title="Chronic Care" context="Long-term management." placeholder="Chronic management query..." />;
      case AppRoute.FAMILY_CARE:
        return <FeatureContainer icon="plus" title="Family Care" context="Pediatric or elderly care." placeholder="Family care concern..." />;
      case AppRoute.WOMENS_HEALTH:
        return <FeatureContainer icon="plus" title="Women's Health" context="Wellness for women." placeholder="Women's health query..." />;
      case AppRoute.FIRST_AID:
        return <FeatureContainer icon="plus" title="First Aid Guide" context="Immediate instructions." placeholder="Describe minor injury..." />;
      case AppRoute.NUTRITION:
        return <FeatureContainer icon="apple" title="AI Nutritionist" context="Dietary advice." placeholder="Describe diet goals..." />;
      case AppRoute.FITNESS_COACH:
        return <FeatureContainer icon="plus" title="Fitness Coach" context="Exercise recommendations." placeholder="Fitness level and goals..." />;
      case AppRoute.PRIVACY_VAULT:
        return <FeatureContainer icon="shield" title="Data Privacy" context="Security protocols." placeholder="Security query..." />;
      case AppRoute.DOCTOR_MODE:
        return <FeatureContainer icon="briefcase" title="Professional Mode" context="Clinical terminology." placeholder="Advanced query..." />;
      case AppRoute.MULTILINGUAL:
        return <FeatureContainer icon="globe" title="Global Language Support" context="Medical polyglot mode." placeholder="Language of choice..." />;
      
      default:
        return <Dashboard onNavigate={navigate} onToggleTheme={toggleTheme} isDarkMode={isDarkMode} />;
    }
  };

  const isAppActive = route !== null;

  return (
    <div className={`min-h-screen transition-colors duration-500 ${isDarkMode ? 'bg-slate-950 text-white dark' : 'bg-slate-50 text-slate-900'}`}>
      {isAppActive && (
        <>
          {!hasApiKey && (
            <div className="bg-violet-600 text-white px-6 py-3 flex flex-col md:flex-row items-center justify-between gap-4 text-sm font-bold animate-in slide-in-from-top duration-500">
              <div className="flex items-center gap-3">
                <Sparkles size={18} className="animate-pulse" />
                <span>AI features require a connected API key for deployed environments.</span>
              </div>
              <button 
                onClick={handleConnectKey}
                className="bg-white text-violet-600 px-6 py-2 rounded-xl hover:bg-violet-50 transition-all active:scale-95 shadow-lg"
              >
                Connect AI Key
              </button>
            </div>
          )}
          <nav className={`sticky top-0 z-50 border-b backdrop-blur-xl transition-all duration-300 ${
          isDarkMode ? 'bg-slate-950/80 border-white/5' : 'bg-white/80 border-slate-200'
        }`}>
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="flex justify-between h-20 items-center">
              <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate(user ? AppRoute.DASHBOARD : AppRoute.LOGIN)}>
                <div className="bg-violet-600 p-2 rounded-xl text-white shadow-[0_0_20px_rgba(139,92,246,0.3)] group-hover:scale-110 transition-all">
                  <Sparkles size={20} />
                </div>
                <span className={`text-xl font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                  MediMind
                </span>
              </div>
              
              <div className="hidden md:flex items-center gap-8">
                {user ? (
                  <>
                    <NavButton onClick={() => navigate(AppRoute.DASHBOARD)} active={route === AppRoute.DASHBOARD} isDarkMode={isDarkMode}>Health Portal</NavButton>
                    <NavButton onClick={() => navigate(AppRoute.SYMPTOM_CHECKER)} active={route === AppRoute.SYMPTOM_CHECKER} isDarkMode={isDarkMode}>Symptom Checker</NavButton>
                    <NavButton onClick={() => navigate(AppRoute.AI_CHAT)} active={route === AppRoute.AI_CHAT} isDarkMode={isDarkMode}>AI Assistant</NavButton>
                    
                    <div className={`h-6 w-px ${isDarkMode ? 'bg-white/10' : 'bg-slate-200'} mx-2`} />
                    
                    <button onClick={toggleTheme} className={`p-3 rounded-2xl transition-all hover:scale-105 ${isDarkMode ? 'bg-white/5 text-yellow-400 hover:bg-white/10' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                      {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
                    </button>

                    <div className="flex items-center gap-4 pl-4 border-l border-white/10">
                      <button onClick={() => navigate(AppRoute.PROFILE)} className="w-10 h-10 rounded-xl bg-violet-600 flex items-center justify-center text-white shadow-xl shadow-violet-500/10 hover:scale-105 transition-all">
                        <UserIcon size={20} />
                      </button>
                      <button onClick={handleLogout} className="text-rose-500 hover:text-rose-400 p-2 rounded-xl hover:bg-rose-500/10 transition-colors">
                        <LogOut size={18} />
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="flex gap-4">
                    <button onClick={() => {
                        const landingUi = document.getElementById('landing-ui');
                        if (landingUi) landingUi.classList.remove('hidden-ui');
                        setRoute(null);
                    }} className={`px-5 py-2.5 rounded-xl font-bold transition-all ${isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-violet-600'}`}>Back to Home</button>
                  </div>
                )}
              </div>
              
              <button className="md:hidden p-3 text-slate-500" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className={`md:hidden p-6 space-y-4 border-t animate-in slide-in-from-top-4 duration-300 ${isDarkMode ? 'bg-slate-950 border-white/5' : 'bg-white border-slate-200'}`}>
              <button onClick={() => navigate(AppRoute.DASHBOARD)} className="block w-full text-left p-4 rounded-2xl bg-white/5 font-bold">Health Portal</button>
              <button onClick={handleLogout} className="block w-full text-left p-4 rounded-2xl text-rose-500 font-bold">Sign Out</button>
            </div>
          )}
        </nav>
      </>
      )}
      
      <main className="flex-1 animate-in fade-in duration-700">
        {renderContent()}
      </main>
    </div>
  );
};

const NavButton = ({ children, active, onClick, isDarkMode }: any) => (
  <button 
    onClick={onClick} 
    className={`text-xs font-black uppercase tracking-widest transition-all duration-300 relative py-2 ${
      active 
        ? (isDarkMode ? 'text-violet-400' : 'text-violet-600') 
        : (isDarkMode ? 'text-slate-500 hover:text-slate-300' : 'text-slate-500 hover:text-slate-900')
    }`}
  >
    {children}
    {active && <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-1 bg-violet-500 rounded-full" />}
  </button>
);

export default App;
