import React, { useState, useEffect } from 'react';
import { UserProfile, ViewState, Scheme } from './types'; // Removed SchemeType
import { INDIAN_STATES, MOCK_SCHEMES } from './constants';
import { fetchLiveSchemes, fetchSchemeDetails, chatWithGemini } from './geminiService';
import Button from './Button';
import Input from './Input';
import SchemeCard from './SchemeCard';
import ChatBot from './ChatBot';
import { 
  MapPin, 
  Bell, 
  User, 
  Search, 
  ChevronLeft, 
  Briefcase, 
  CheckCircle2, 
  Info,
  LogOut,
  Sparkles,
  Bot,
  Wifi,
  Filter,
  RefreshCw
} from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('ONBOARDING');
  const [user, setUser] = useState<UserProfile>({
    name: '',
    age: 0,
    location: '',
    notificationsEnabled: false,
    isLoggedIn: false
  });
  
  // Changed activeTab to string to avoid SchemeType crash
  const [activeTab, setActiveTab] = useState('All');
  const [selectedScheme, setSelectedScheme] = useState<Scheme | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  
  // Data State
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [loadingSchemes, setLoadingSchemes] = useState(false);
  const [usingLive, setUsingLive] = useState(false);
  const [isEnriching, setIsEnriching] = useState(false);

  // Onboarding Logic with Live Fetch
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (user.name && user.location && user.age > 0) {
      setUser(prev => ({ ...prev, isLoggedIn: true }));
      setLoadingSchemes(true);
      setView('DASHBOARD');

      try {
        const liveData = await fetchLiveSchemes({ ...user, isLoggedIn: true, notificationsEnabled: user.notificationsEnabled });
        
        if (liveData && liveData.length > 0) {
          setSchemes(liveData);
          setUsingLive(true);
        } else {
          setSchemes(MOCK_SCHEMES);
          setUsingLive(false);
        }
      } catch (error) {
        console.error("Failed to fetch live schemes, using backup.", error);
        setSchemes(MOCK_SCHEMES);
        setUsingLive(false);
      } finally {
        setLoadingSchemes(false);
      }
    }
  };

  const toggleNotifications = () => {
    setUser(prev => ({ ...prev, notificationsEnabled: !prev.notificationsEnabled }));
  };

  // Derive available tags (Safe version)
  const availableTags = React.useMemo(() => {
    const visibleSchemes = schemes.filter(scheme => 
      activeTab === 'All' 
        ? true 
        : activeTab === 'State' 
          ? (scheme.provider?.includes('State') || scheme.provider?.includes(user.location))
          : scheme.provider?.includes('Central')
    );
    // Safety: If tags are missing, use the type as a tag
    return Array.from(new Set(visibleSchemes.flatMap(s => s.tags || [s.type]))).sort();
  }, [schemes, activeTab, user.location]);

  // Reset selected tag when tab changes
  useEffect(() => {
    setSelectedTag(null);
  }, [activeTab]);

  // Enrich details when selectedScheme changes
  useEffect(() => {
    const enrichDetails = async () => {
      if (view === 'SCHEME_DETAILS' && selectedScheme && usingLive) {
        // Only enrich if details look sparse
        const needsEnrichment = !selectedScheme.benefits || selectedScheme.benefits.length === 0;
        
        if (needsEnrichment) {
            setIsEnriching(true);
            try {
                // Fetch a summary description using the new function
                const enrichedDesc = await fetchSchemeDetails(selectedScheme);
                const enrichedScheme = { 
                    ...selectedScheme, 
                    description: enrichedDesc,
                    // Add dummy arrays if missing to prevent crashes
                    benefits: selectedScheme.benefits || ["View official portal for details"],
                    eligibility: selectedScheme.eligibility || ["Check official guidelines"],
                    applicationProcess: selectedScheme.applicationProcess || ["Visit the official website"]
                };
                
                setSelectedScheme(enrichedScheme);
                setSchemes(prev => prev.map(s => s.id === enrichedScheme.id ? enrichedScheme : s));
            } catch (err) {
                console.error("Failed to enrich scheme details", err);
            } finally {
                setIsEnriching(false);
            }
        }
      }
    };

    enrichDetails();
  }, [selectedScheme?.id, view, usingLive]);

  // Filter Logic
  const filteredSchemes = schemes.filter(scheme => {
    // 1. Tab/Provider Filter (Fixed logic)
    const matchesTab = activeTab === 'All' 
      ? true 
      : activeTab === 'State' 
        ? (scheme.provider?.includes('State') || scheme.provider?.includes(user.location) || scheme.provider?.includes('Odisha'))
        : (scheme.provider?.includes('Central') || scheme.provider?.includes('India'));
    
    // 2. Search Filter
    const matchesSearch = scheme.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (scheme.description && scheme.description.toLowerCase().includes(searchTerm.toLowerCase()));

    // 3. Age Filter
    const matchesAge = (!scheme.minAge || user.age >= scheme.minAge) && 
                       (!scheme.maxAge || user.age <= scheme.maxAge);
    
    // 4. Tag Filter
    const matchesTag = selectedTag ? (scheme.tags?.includes(selectedTag) || scheme.type === selectedTag) : true;
    
    return matchesTab && matchesSearch && matchesAge && matchesTag;
  });

  // Views
  if (view === 'ONBOARDING') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 border border-slate-100 relative overflow-hidden">
           <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 rounded-full bg-brand-100 blur-2xl opacity-60"></div>
           <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-32 h-32 rounded-full bg-blue-100 blur-2xl opacity-60"></div>

          <div className="relative z-10">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-brand-50 mb-4 shadow-sm">
                <span className="text-3xl">🇮🇳</span>
              </div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">Awsar Setu</h1>
              <p className="text-slate-500">Bridge to Opportunities</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <Input 
                label="Full Name" 
                placeholder="e.g. Rahul Sharma"
                value={user.name}
                onChange={(e) => setUser({...user, name: e.target.value})}
                required
              />
              
              <Input 
                label="Age" 
                type="number"
                placeholder="e.g. 24"
                value={user.age || ''}
                onChange={(e) => setUser({...user, age: parseInt(e.target.value) || 0})}
                required
              />

              <div className="w-full">
                <label className="block text-sm font-medium text-slate-700 mb-1.5 ml-1">Location (State)</label>
                <div className="relative">
                  <select 
                    className="w-full px-4 py-3 rounded-xl bg-white border-2 border-slate-100 focus:border-brand-500 focus:ring-0 outline-none appearance-none text-slate-900"
                    value={user.location}
                    onChange={(e) => setUser({...user, location: e.target.value})}
                    required
                  >
                    <option value="">Select State</option>
                    {INDIAN_STATES.map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                  <MapPin className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                </div>
              </div>

              <div 
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between ${user.notificationsEnabled ? 'border-brand-500 bg-brand-50' : 'border-slate-100 bg-slate-50 hover:border-brand-200'}`}
                onClick={toggleNotifications}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${user.notificationsEnabled ? 'bg-brand-500 text-white' : 'bg-white text-slate-400'}`}>
                    <Bell size={18} />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-bold text-slate-800">Get Notifications</p>
                    <p className="text-xs text-slate-500">New schemes alerts</p>
                  </div>
                </div>
                {user.notificationsEnabled && <CheckCircle2 className="text-brand-600" size={20} />}
              </div>

              <Button type="submit" className="mt-4 group">
                Find Schemes 
                <span className="group-hover:translate-x-1 transition-transform">🚀</span>
              </Button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Scheme Details View
  if (view === 'SCHEME_DETAILS' && selectedScheme) {
    return (
      <div className="min-h-screen bg-slate-50 relative">
        <div className="max-w-5xl mx-auto p-4 md:p-8 pb-32">
             <div className="flex justify-between items-center mb-6">
                <button 
                    onClick={() => {
                    setView('DASHBOARD');
                    setIsChatOpen(false);
                    }}
                    className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors bg-white px-4 py-2 rounded-full shadow-sm w-fit"
                >
                    <ChevronLeft size={18} /> Back to Dashboard
                </button>
                {isEnriching && (
                    <div className="flex items-center gap-2 bg-brand-50 text-brand-700 px-4 py-2 rounded-full text-sm font-medium animate-pulse border border-brand-100">
                        <RefreshCw size={14} className="animate-spin" />
                        Updating with Official Data...
                    </div>
                )}
             </div>

             <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden mb-6 animate-[fadeIn_0.4s_ease-out]">
                <div className="h-2 bg-gradient-to-r from-brand-500 to-brand-600"></div>
                <div className="p-6 md:p-10">
                  <div className="flex flex-wrap gap-2 mb-4">
                     <span className="px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-bold uppercase tracking-wider">
                       {selectedScheme.type}
                     </span>
                     {selectedScheme.provider && (
                       <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider">
                         {selectedScheme.provider}
                       </span>
                     )}
                  </div>
                  
                  <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 leading-tight">{selectedScheme.title}</h1>
                  <p className="text-slate-600 leading-relaxed text-lg mb-10">{selectedScheme.description}</p>

                  <div className="grid md:grid-cols-2 gap-10">
                    <div>
                      <h3 className="flex items-center gap-3 font-bold text-slate-900 mb-5 text-xl">
                        <span className="w-10 h-10 rounded-xl bg-green-100 text-green-600 flex items-center justify-center shadow-sm"><Sparkles size={20}/></span>
                        Benefits
                      </h3>
                      {selectedScheme.benefits && selectedScheme.benefits.length > 0 ? (
                        <ul className="space-y-4">
                            {selectedScheme.benefits.map((benefit, idx) => (
                            <li key={idx} className="flex items-start gap-3 text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100">
                                <CheckCircle2 size={20} className="text-green-500 mt-0.5 shrink-0" />
                                <span>{benefit}</span>
                            </li>
                            ))}
                        </ul>
                      ) : (
                          <div className="text-slate-400 italic bg-slate-50 p-4 rounded-xl">Fetching details...</div>
                      )}
                    </div>

                    <div>
                      <h3 className="flex items-center gap-3 font-bold text-slate-900 mb-5 text-xl">
                         <span className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shadow-sm"><User size={20}/></span>
                         Eligibility
                      </h3>
                       {selectedScheme.eligibility && selectedScheme.eligibility.length > 0 ? (
                        <ul className="space-y-4">
                            {selectedScheme.eligibility.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-3 text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100">
                                <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 shrink-0"></div>
                                <span>{item}</span>
                            </li>
                            ))}
                        </ul>
                       ) : (
                           <div className="text-slate-400 italic bg-slate-50 p-4 rounded-xl">Fetching details...</div>
                       )}
                    </div>
                  </div>

                  <div className="mt-12 pt-10 border-t border-slate-100">
                     <h3 className="flex items-center gap-3 font-bold text-slate-900 mb-6 text-xl">
                         <span className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center shadow-sm"><Briefcase size={20}/></span>
                         How to Apply
                      </h3>
                      {selectedScheme.applicationProcess && selectedScheme.applicationProcess.length > 0 ? (
                        <div className="space-y-6">
                            {selectedScheme.applicationProcess.map((step, idx) => (
                            <div key={idx} className="flex gap-6 relative">
                                <div className="flex flex-col items-center">
                                <div className="w-10 h-10 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center text-sm shadow-lg shadow-slate-200 z-10">
                                    {idx + 1}
                                </div>
                                {idx !== selectedScheme.applicationProcess.length - 1 && (
                                    <div className="w-0.5 h-full bg-slate-200 absolute top-10 left-5 -translate-x-1/2 -z-0"></div>
                                )}
                                </div>
                                <p className="text-slate-700 pt-2 text-lg font-medium">{step}</p>
                            </div>
                            ))}
                        </div>
                      ) : (
                          <div className="text-slate-400 italic bg-slate-50 p-4 rounded-xl">Check official portal.</div>
                      )}
                  </div>
                </div>
             </div>
        </div>

        {/* Floating Chat Toggle */}
        {!isChatOpen && (
          <button 
            onClick={() => setIsChatOpen(true)}
            className="fixed bottom-6 right-6 md:bottom-10 md:right-10 w-16 h-16 rounded-full bg-gradient-to-r from-brand-500 to-brand-600 text-white shadow-2xl shadow-brand-500/40 flex items-center justify-center hover:scale-110 transition-transform z-40 group"
          >
            <Bot size={32} className="group-hover:animate-bounce" />
            <span className="absolute -top-12 right-0 bg-slate-900 text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              Ask AI Sahayak
            </span>
          </button>
        )}

        {/* Chat Modal */}
        {isChatOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/30 backdrop-blur-sm p-0 sm:p-4 animate-[fadeIn_0.2s_ease-out]">
             <div className="w-full sm:max-w-lg h-[85vh] sm:h-[700px] bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-[slideUp_0.3s_ease-out]">
                <ChatBot scheme={selectedScheme} onClose={() => setIsChatOpen(false)} />
             </div>
          </div>
        )}
      </div>
    );
  }

  // Dashboard View
  return (
    <div className="min-h-screen bg-slate-50 pb-20 relative">
      {/* Loading Overlay */}
      {loadingSchemes && (
        <div className="fixed inset-0 z-50 bg-white flex flex-col items-center justify-center p-8 text-center animate-[fadeIn_0.3s_ease-out]">
           <div className="relative w-24 h-24 mb-6">
             <div className="absolute inset-0 border-4 border-slate-100 rounded-full"></div>
             <div className="absolute inset-0 border-4 border-brand-500 rounded-full border-t-transparent animate-spin"></div>
             <div className="absolute inset-0 flex items-center justify-center">
               <span className="text-3xl">🏛️</span>
             </div>
           </div>
           <h2 className="text-xl font-bold text-slate-900 mb-2">Connecting to Official Databases...</h2>
           <p className="text-slate-500 max-w-xs mx-auto">Searching for live schemes in <span className="font-semibold text-brand-600">{user.location}</span> matching age <span className="font-semibold text-brand-600">{user.age}</span>.</p>
        </div>
      )}

      {/* Sticky Header */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-50 rounded-full flex items-center justify-center text-xl shadow-sm border border-brand-100">🇮🇳</div>
            <div>
              <h1 className="font-bold text-slate-900 text-lg leading-tight">Awsar Setu</h1>
              <div className="flex items-center gap-2">
                 <p className="text-xs text-slate-500 flex items-center gap-1">
                   <MapPin size={10} /> {user.location}
                 </p>
                 {usingLive && !loadingSchemes && (
                   <span className="flex items-center gap-1 bg-green-50 text-green-700 border border-green-200 text-[10px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider animate-pulse">
                     <Wifi size={8} /> Live Data
                   </span>
                 )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 text-slate-400 hover:text-brand-600 bg-slate-50 rounded-full">
              <Bell size={20} />
            </button>
            <button 
              onClick={() => setView('ONBOARDING')}
              className="p-2 text-slate-400 hover:text-red-500 bg-slate-50 rounded-full"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 pt-6">
        {/* Welcome Section */}
        <div className="mb-8">
           <h2 className="text-2xl font-bold text-slate-900 mb-1">Namaste, {user.name.split(' ')[0]} 👋</h2>
           <p className="text-slate-500">
             Found <span className="font-bold text-slate-900">{filteredSchemes.length}</span> schemes based on your profile.
           </p>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <input 
            type="text"
            placeholder="Search schemes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
        </div>

        {/* Tabs (Government Type) */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-2 scrollbar-hide">
          {['All', 'Central', 'State'].map((tab) => (
             <button
               key={tab}
               onClick={() => setActiveTab(tab)}
               className={`px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
                 activeTab === tab 
                   ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20' 
                   : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
               }`}
             >
               {tab === 'All' ? 'All Schemes' : tab === 'Central' ? 'Central Govt' : `${user.location} Govt`}
             </button>
          ))}
        </div>

        {/* Categories / Tags Filter */}
        {availableTags.length > 0 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-4 scrollbar-hide">
             <div className="flex-shrink-0 text-slate-400 px-2">
               <Filter size={16} />
             </div>
             <button
               onClick={() => setSelectedTag(null)}
               className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-all whitespace-nowrap flex-shrink-0 ${
                 selectedTag === null
                   ? 'bg-brand-500 text-white border-brand-500 shadow-md shadow-brand-500/20'
                   : 'bg-white text-slate-600 border-slate-200 hover:border-brand-300'
               }`}
             >
               All Topics
             </button>
             {availableTags.map(tag => (
               <button
                 key={tag}
                 onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
                 className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-all whitespace-nowrap flex-shrink-0 ${
                   selectedTag === tag
                     ? 'bg-brand-500 text-white border-brand-500 shadow-md shadow-brand-500/20'
                     : 'bg-white text-slate-600 border-slate-200 hover:border-brand-300'
                 }`}
               >
                 {tag}
               </button>
             ))}
          </div>
        )}

        {/* Cards Grid */}
        {filteredSchemes.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-4 animate-[slideUp_0.5s_ease-out]">
            {filteredSchemes.map(scheme => (
              <SchemeCard 
                key={scheme.id} 
                scheme={scheme} 
                onClick={(s) => {
                  setSelectedScheme(s);
                  setView('SCHEME_DETAILS');
                  setIsChatOpen(false);
                }} 
              />
            ))}
          </div>
        ) : (
          !loadingSchemes && (
            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
               <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                 <Info size={32} />
               </div>
               <p className="text-slate-500 font-medium">No schemes found matching your criteria.</p>
               <button onClick={() => {setActiveTab('All'); setSearchTerm(''); setSelectedTag(null);}} className="text-brand-600 text-sm font-semibold mt-2 hover:underline">Clear Filters</button>
            </div>
          )
        )}
      </main>
    </div>
  );
};

export default App;
