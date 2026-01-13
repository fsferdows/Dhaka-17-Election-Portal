
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link, useNavigate, useParams } from 'react-router-dom';
import { Language, UserRole, User, Candidate, ElectionEvent, VotingCenter, VoterDetails, ElectionNotice } from './types';
import { TRANSLATIONS, MOCK_CANDIDATES, MOCK_EVENTS, MOCK_VOTING_CENTERS, MOCK_VOTER_DB, MOCK_NOTICES } from './constants';
import { LanguageToggle } from './components/LanguageToggle';
import { CandidateCard } from './components/CandidateCard';
import { ChatBot } from './components/ChatBot';

const Navbar: React.FC<{ 
  lang: Language; 
  setLang: (l: Language) => void; 
  user: User | null;
  onLogout: () => void;
}> = ({ lang, setLang, user, onLogout }) => {
  const t = (key: string) => TRANSLATIONS[key][lang];

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-40 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-green-700 rounded-lg flex items-center justify-center text-white font-bold text-xl">
            17
          </div>
          <span className="font-bold text-gray-800 hidden sm:inline tracking-tight">
            {t('appName')}
          </span>
        </Link>

        <div className="flex items-center gap-4 sm:gap-6">
          <div className="hidden md:flex gap-6 text-sm font-semibold text-gray-500">
            <Link to="/" className="hover:text-green-700 transition-colors">{t('home')}</Link>
            <Link to="/candidates" className="hover:text-green-700 transition-colors">{t('candidates')}</Link>
            <Link to="/campaign" className="hover:text-green-700 transition-colors">{t('events')}</Link>
            {user && user.role === UserRole.VOTER && <Link to="/dashboard" className="hover:text-green-700 transition-colors">{t('dashboard')}</Link>}
            {user && user.role === UserRole.ADMIN && <Link to="/admin" className="hover:text-green-700 transition-colors">Admin</Link>}
          </div>

          <LanguageToggle current={lang} onToggle={setLang} />

          {user ? (
            <button 
              onClick={onLogout}
              className="text-sm font-bold text-red-600 hover:text-red-700 transition-colors"
            >
              {t('logout')}
            </button>
          ) : (
            <Link 
              to="/auth" 
              className="bg-green-700 text-white px-5 py-2 rounded-lg text-sm font-bold hover:bg-green-800 transition-all shadow-md shadow-green-100"
            >
              {t('login')}
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

const Home: React.FC<{ lang: Language }> = ({ lang }) => {
  const t = (key: string) => TRANSLATIONS[key][lang];

  return (
    <div className="space-y-16 pb-20">
      <header className="relative py-20 sm:py-32 bg-green-950 overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <img 
            src="https://images.unsplash.com/photo-1590333746431-1850e5763aec?q=80&w=1600&h=900&auto=format&fit=crop" 
            className="w-full h-full object-cover grayscale"
            alt="Dhaka Cityscape"
          />
        </div>
        <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
          <div className="inline-block px-4 py-1.5 bg-green-500/20 backdrop-blur-md rounded-full text-green-400 text-xs font-bold mb-6 border border-green-500/30 uppercase tracking-widest">
            Constituency No. 190
          </div>
          <h1 className="text-5xl sm:text-7xl font-black text-white mb-6 tracking-tighter">
            {t('appName')}
          </h1>
          <p className="text-xl text-green-100/80 max-w-3xl mx-auto mb-12 leading-relaxed font-medium">
            {lang === Language.BN 
              ? 'গুলশান, বনানী, বারিধারা এবং ঢাকা ক্যান্টনমেন্টের ভবিষ্যৎ নির্ধারণে আপনার মতামত দিন। ঢাকা-১৭ সংসদীয় আসনের নির্ভরযোগ্য নির্বাচনী তথ্যের একমাত্র ঠিকানা।'
              : 'Decide the future of Gulshan, Banani, Baridhara, and Dhaka Cantonment. Your trusted source for authenticated Dhaka-17 election data.'}
          </p>
          <div className="flex flex-wrap justify-center gap-5">
            <Link to="/voter-search" className="bg-white text-green-950 px-10 py-4 rounded-xl font-black hover:bg-green-50 transition-all shadow-2xl hover:-translate-y-1">
              {lang === Language.BN ? 'ভোটার তথ্য অনুসন্ধান' : 'Voter Search'}
            </Link>
            <Link to="/campaign" className="bg-green-600 text-white px-10 py-4 rounded-xl font-black border border-green-500 hover:bg-green-700 transition-all shadow-xl hover:-translate-y-1">
              {t('events')}
            </Link>
          </div>
        </div>
      </header>

      {/* New Calling Feature Banner */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="bg-gradient-to-r from-green-700 to-green-900 rounded-[40px] p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl shadow-green-900/20">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full text-[10px] font-black uppercase tracking-widest">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span> {lang === Language.BN ? 'লাইভ সাপোর্ট' : 'Live Support'}
            </div>
            <h2 className="text-3xl sm:text-4xl font-black leading-tight">
              {lang === Language.BN ? 'নির্বাচন নিয়ে কথা বলুন আমাদের এআই সহকারীর সাথে' : 'Talk to our AI Assistant about the Election'}
            </h2>
            <p className="text-green-100/70 font-medium text-lg max-w-xl leading-relaxed">
              {lang === Language.BN 
                ? 'টাইপ করার ঝামেলা ছাড়াই সরাসরি কথা বলে জানুন প্রার্থী, ভোটার এলাকা এবং ভোট কেন্দ্রের বিস্তারিত তথ্য।'
                : 'Skip the typing. Talk directly to get details about candidates, voting areas, and polling centers.'}
            </p>
          </div>
          <button 
            onClick={() => {
              const event = new CustomEvent('open-ai-call');
              window.dispatchEvent(event);
            }}
            className="whitespace-nowrap bg-white text-green-900 px-10 py-5 rounded-2xl font-black text-xl hover:scale-105 transition-all shadow-xl"
          >
            {lang === Language.BN ? 'কল শুরু করুন' : 'Start Voice Call'} 📞
          </button>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 grid md:grid-cols-3 gap-10">
        <Link to="/voter-search" className="group bg-white p-10 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-green-200 transition-all text-left">
          <div className="w-16 h-16 bg-green-50 text-green-700 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">🗳️</div>
          <h3 className="text-2xl font-black mb-4 text-gray-800">{lang === Language.BN ? 'ভোটের তথ্য' : 'Voter Info'}</h3>
          <p className="text-gray-600 leading-relaxed font-medium">
            {lang === Language.BN 
              ? 'আপনার এনআইডি নম্বর দিয়ে ভোটার এলাকা ও কেন্দ্র খুঁজে বের করুন সরাসরি আমাদের ডাটাবেস থেকে।'
              : 'Search your voter area and center directly from our database using your NID number.'}
          </p>
        </Link>
        <Link to="/candidates" className="group bg-white p-10 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-green-200 transition-all text-left">
          <div className="w-16 h-16 bg-blue-50 text-blue-700 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">📢</div>
          <h3 className="text-2xl font-black mb-4 text-gray-800">{lang === Language.BN ? 'প্রার্থীদের প্রোফাইল' : 'Candidate Profiles'}</h3>
          <p className="text-gray-600 leading-relaxed font-medium">
            {lang === Language.BN 
              ? 'ঢাকা-১৭ আসনের প্রতিদ্বন্দ্বী প্রার্থীদের শিক্ষা, সম্পদ এবং ভবিষ্যত পরিকল্পনা যাচাই করুন।'
              : 'Analyze the educational background, assets, and future visions of all Dhaka-17 candidates.'}
          </p>
        </Link>
        <Link to="/campaign" className="group bg-white p-10 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-green-200 transition-all text-left">
          <div className="w-16 h-16 bg-purple-50 text-purple-700 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">📅</div>
          <h3 className="text-2xl font-black mb-4 text-gray-800">{lang === Language.BN ? 'নির্বাচনী প্রচার' : 'Campaign Events'}</h3>
          <p className="text-gray-600 leading-relaxed font-medium">
            {lang === Language.BN 
              ? 'আপনার এলাকায় কখন এবং কোথায় নির্বাচনী সভা হচ্ছে তা জানুন এবং প্রশ্ন করার সুযোগ পান।'
              : 'Track when and where campaign rallies are happening in your neighborhood and get a chance to ask questions.'}
          </p>
        </Link>
      </section>
    </div>
  );
};

const CampaignPortal: React.FC<{ lang: Language; user: User | null; setUser: (u: User) => void }> = ({ lang, user, setUser }) => {
  const t = (key: string) => TRANSLATIONS[key][lang];
  const navigate = useNavigate();
  
  // Real-time state simulation for event counts
  const [events, setEvents] = useState<ElectionEvent[]>(MOCK_EVENTS);

  const handleRsvp = (eventId: string) => {
    if (!user) {
      alert(lang === Language.BN ? 'অনুগ্রহ করে প্রথমে লগইন করুন।' : 'Please login first.');
      navigate('/auth');
      return;
    }

    const isRsvped = user.rsvpedEvents.includes(eventId);
    const updatedUser = {
      ...user,
      rsvpedEvents: isRsvped 
        ? user.rsvpedEvents.filter(id => id !== eventId)
        : [...user.rsvpedEvents, eventId]
    };
    setUser(updatedUser);
    localStorage.setItem('election_user', JSON.stringify(updatedUser));

    // Update real-time simulated count
    setEvents(prev => prev.map(e => {
      if (e.id === eventId) {
        return { ...e, attendanceCount: isRsvped ? e.attendanceCount - 1 : e.attendanceCount + 1 };
      }
      return e;
    }));
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="mb-16">
        <h2 className="text-4xl font-black text-gray-900 mb-4">{t('campaignPortalTitle')}</h2>
        <p className="text-gray-500 font-medium">
          {lang === Language.BN 
            ? 'ঢাকা-১৭ সংসদীয় আসনের নির্বাচনী প্রচার এবং কেন্দ্র ভিত্তিক সর্বশেষ আপডেট।' 
            : 'Latest campaign updates and official center notices for the Dhaka-17 constituency.'}
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-16">
        {/* Left: Live Feed of Notices */}
        <div className="lg:col-span-1 space-y-8">
          <div className="flex items-center gap-3 mb-6">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
            <h3 className="text-xl font-black uppercase tracking-wider text-gray-800">{t('liveUpdates')}</h3>
          </div>
          
          <div className="space-y-6">
            {MOCK_NOTICES.map(notice => (
              <div key={notice.id} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 border-l-4 border-l-green-600 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-black text-white bg-green-600 px-2 py-0.5 rounded uppercase tracking-widest">
                    {notice.category}
                  </span>
                  <span className="text-xs text-gray-400 font-bold">
                    {notice.date}
                  </span>
                </div>
                <h4 className="font-black text-gray-900 mb-2">{lang === Language.BN ? notice.titleBn : notice.title}</h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {lang === Language.BN ? notice.contentBn : notice.content}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Rallies and Events */}
        <div className="lg:col-span-2 space-y-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-black uppercase tracking-wider text-gray-800">{t('upcomingRallies')}</h3>
            <div className="flex items-center gap-2 text-xs font-black text-green-600 bg-green-50 px-3 py-1 rounded-full border border-green-100 uppercase tracking-widest animate-pulse">
              ● {lang === Language.BN ? 'লাইভ ডেটা সক্রিয়' : 'Live Data Active'}
            </div>
          </div>
          
          <div className="grid md:grid-cols-1 gap-8">
            {events.map(event => {
              const candidate = MOCK_CANDIDATES.find(c => c.id === event.candidateId);
              const isRsvped = user?.rsvpedEvents.includes(event.id);

              return (
                <div key={event.id} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col md:flex-row hover:border-green-100 transition-all group">
                  <div className="md:w-48 bg-gray-50 flex flex-col items-center justify-center p-8 border-r border-gray-50">
                    <div className="text-3xl font-black text-green-700 mb-1">
                      {new Date(event.date).getDate()}
                    </div>
                    <div className="text-xs font-black text-gray-400 uppercase tracking-widest">
                      {new Date(event.date).toLocaleString(lang === Language.BN ? 'bn-BD' : 'en-US', { month: 'short' })}
                    </div>
                    <div className="mt-4 px-3 py-1 bg-white rounded-full text-[10px] font-black border border-gray-100 text-gray-500 uppercase">
                      {event.type}
                    </div>
                  </div>
                  
                  <div className="flex-1 p-8">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <img src={candidate?.imageUrl} className="w-8 h-8 rounded-lg object-cover" />
                        <span className="text-sm font-black text-green-600 uppercase tracking-wide">
                          {lang === Language.BN ? candidate?.nameBn : candidate?.name}
                        </span>
                      </div>
                      <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                        <span className="text-green-500">👥</span> 
                        {event.attendanceCount.toLocaleString()} {lang === Language.BN ? 'জন অংশগ্রহণকারী' : 'People Going'}
                      </div>
                    </div>
                    
                    <h4 className="text-2xl font-black text-gray-900 mb-4 group-hover:text-green-700 transition-colors">
                      {lang === Language.BN ? event.titleBn : event.title}
                    </h4>
                    
                    <p className="text-gray-500 font-medium leading-relaxed mb-6">
                      {lang === Language.BN ? event.descriptionBn : event.description}
                    </p>
                    
                    <div className="flex flex-wrap items-center gap-6">
                      <div className="flex items-center gap-2 text-sm text-gray-700 font-bold">
                        <span className="text-xl">📍</span> {lang === Language.BN ? event.locationBn : event.location}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-700 font-bold">
                        <span className="text-xl">⏰</span> {new Date(event.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </div>
                      <button 
                        onClick={() => handleRsvp(event.id)}
                        className={`ml-auto px-6 py-2 rounded-xl font-black text-sm transition-all shadow-md active:scale-95 flex items-center gap-2 ${
                          isRsvped 
                          ? 'bg-green-50 text-green-700 border border-green-200' 
                          : 'bg-green-700 text-white hover:bg-green-800'
                        }`}
                      >
                        {isRsvped ? (
                          <><span>✓</span> {t('rsvped')}</>
                        ) : (
                          t('rsvp')
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

const CandidatePortal: React.FC<{ lang: Language, user: User | null, setUser: (u: User) => void }> = ({ lang, user, setUser }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const candidate = MOCK_CANDIDATES.find(c => c.id === id);
  const events = MOCK_EVENTS.filter(e => e.candidateId === id);
  const t = (key: string) => TRANSLATIONS[key][lang];

  if (!candidate) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-black text-gray-400">Candidate Not Found</h2>
        <button onClick={() => navigate('/candidates')} className="mt-4 text-green-700 font-bold">Back to Candidates</button>
      </div>
    );
  }

  const handleFollow = () => {
    if (!user) {
      alert(lang === Language.BN ? 'অনুগ্রহ করে প্রথমে লগইন করুন।' : 'Please login first.');
      navigate('/auth');
      return;
    }
    const isFollowing = user.followedCandidates.includes(candidate.id);
    const updated = {
      ...user,
      followedCandidates: isFollowing 
        ? user.followedCandidates.filter(cid => cid !== candidate.id)
        : [...user.followedCandidates, candidate.id]
    };
    setUser(updated);
    localStorage.setItem('election_user', JSON.stringify(updated));
  };

  const isFollowing = user?.followedCandidates.includes(candidate.id) || false;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <button onClick={() => navigate('/candidates')} className="flex items-center gap-2 text-gray-700 font-black text-xs uppercase tracking-widest mb-8 hover:text-green-700 transition-colors">
        ← {lang === Language.BN ? 'তালিকায় ফিরে যান' : 'Back to Candidates'}
      </button>

      <div className="grid lg:grid-cols-3 gap-12">
        {/* Sidebar Info */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden sticky top-24">
            <div className="relative">
              <img src={candidate.imageUrl} className="w-full aspect-square object-cover" />
              <div className="absolute top-4 right-4 bg-white/95 backdrop-blur px-4 py-2 rounded-2xl text-4xl shadow-xl">
                {candidate.symbol}
              </div>
            </div>
            <div className="p-8 space-y-6">
              <div>
                <h1 className="text-3xl font-black text-gray-900 mb-1">{lang === Language.BN ? candidate.nameBn : candidate.name}</h1>
                <p className="text-green-600 font-black uppercase tracking-widest text-sm">{lang === Language.BN ? candidate.partyBn : candidate.party}</p>
              </div>
              
              <button 
                onClick={handleFollow}
                className={`w-full py-4 rounded-2xl font-black text-lg shadow-xl transition-all ${
                  isFollowing ? 'bg-gray-100 text-gray-500 border border-gray-200' : 'bg-green-700 text-white hover:bg-green-800'
                }`}
              >
                {isFollowing ? t('followed') : t('follow')}
              </button>

              <div className="pt-6 border-t border-gray-100">
                <h3 className="text-xs font-black text-gray-700 uppercase tracking-widest mb-4">{lang === Language.BN ? 'মূল ইস্যুগুলো' : 'Focus Issues'}</h3>
                <div className="flex flex-wrap gap-2">
                  {candidate.focusIssues.map(issue => (
                    <span key={issue} className="px-3 py-1 bg-green-50 text-green-700 text-[10px] font-black uppercase rounded-lg border border-green-100">
                      {issue}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-12">
          {/* Manifesto Section */}
          <section className="bg-white p-10 rounded-[40px] shadow-sm border border-gray-100">
            <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-4">
              <span className="text-3xl">📜</span> {t('manifesto')}
            </h2>
            <div className="prose prose-lg max-w-none text-gray-600 font-medium leading-relaxed">
              <p className="whitespace-pre-line">
                {lang === Language.BN ? candidate.manifestoBn : candidate.manifesto}
              </p>
            </div>
          </section>

          {/* Events Section */}
          <section>
            <h2 className="text-2xl font-black text-gray-900 mb-8 flex items-center gap-4">
              <span className="text-3xl">📅</span> {lang === Language.BN ? 'প্রচারণা কর্মসূচি' : 'Campaign Schedule'}
            </h2>
            {events.length > 0 ? (
              <div className="grid gap-6">
                {events.map(event => (
                  <div key={event.id} className="bg-white p-8 rounded-[32px] border border-gray-100 flex items-start gap-8 hover:border-green-100 transition-all">
                    <div className="text-center min-w-[60px]">
                      <div className="text-3xl font-black text-green-700">{new Date(event.date).getDate()}</div>
                      <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{new Date(event.date).toLocaleString(lang === Language.BN ? 'bn-BD' : 'en-US', { month: 'short' })}</div>
                    </div>
                    <div className="flex-1 space-y-2">
                      <h4 className="text-xl font-black text-gray-900">{lang === Language.BN ? event.titleBn : event.title}</h4>
                      <p className="text-gray-500 font-medium">{lang === Language.BN ? event.descriptionBn : event.description}</p>
                      <div className="pt-4 flex items-center gap-6 text-xs font-bold text-gray-700 uppercase tracking-widest">
                        <span>📍 {lang === Language.BN ? event.locationBn : event.location}</span>
                        <span>⏰ {new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-10 bg-gray-50 border-2 border-dashed border-gray-200 rounded-[40px] text-center text-gray-400 font-black italic">
                {lang === Language.BN ? 'কোনো আসন্ন কর্মসূচি পাওয়া যায়নি।' : 'No upcoming events scheduled.'}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

const VoterSearchPortal: React.FC<{ lang: Language, votingCenters: VotingCenter[] }> = ({ lang, votingCenters }) => {
  const t = (key: string) => TRANSLATIONS[key][lang];
  const [activeTab, setActiveTab] = useState<'NID' | 'ADDRESS'>('NID');
  
  // NID Search state
  const [nid, setNid] = useState('');
  const [dob, setDob] = useState('');
  const [voterResult, setVoterResult] = useState<VoterDetails | null>(null);
  
  // Address Search state
  const [addressQuery, setAddressQuery] = useState('');
  const [centerResults, setCenterResults] = useState<VotingCenter[]>([]);
  
  const [error, setError] = useState(false);

  const handleNidSearch = () => {
    setError(false);
    const voter = MOCK_VOTER_DB.find(v => v.nid === nid && v.dob === dob);
    if (voter) {
      setVoterResult(voter);
    } else {
      setVoterResult(null);
      setError(true);
    }
  };

  const handleAddressSearch = () => {
    setError(false);
    if (!addressQuery.trim()) return;
    const results = votingCenters.filter(c => 
      c.area.toLowerCase().includes(addressQuery.toLowerCase()) || 
      c.name.toLowerCase().includes(addressQuery.toLowerCase()) ||
      c.address.toLowerCase().includes(addressQuery.toLowerCase()) ||
      c.nameBn.includes(addressQuery) ||
      c.addressBn.includes(addressQuery)
    );
    setCenterResults(results);
    if (results.length === 0) setError(true);
  };

  const voterCenter = voterResult ? votingCenters.find(c => c.id === voterResult.votingCenterId) : null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="bg-white p-6 sm:p-10 rounded-[40px] shadow-2xl border border-gray-100">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black text-gray-900 mb-4">{t('voterSearchTitle')}</h2>
          <div className="flex justify-center gap-2 bg-gray-50 p-1.5 rounded-2xl w-fit mx-auto mb-6">
            <button 
              onClick={() => { setActiveTab('NID'); setError(false); }}
              className={`px-6 py-2.5 rounded-xl text-sm font-black uppercase tracking-widest transition-all ${activeTab === 'NID' ? 'bg-white text-green-700 shadow-md shadow-gray-200/50' : 'text-gray-400 hover:text-gray-600'}`}
            >
              {t('searchByNid')}
            </button>
            <button 
              onClick={() => { setActiveTab('ADDRESS'); setError(false); }}
              className={`px-6 py-2.5 rounded-xl text-sm font-black uppercase tracking-widest transition-all ${activeTab === 'ADDRESS' ? 'bg-white text-green-700 shadow-md shadow-gray-200/50' : 'text-gray-400 hover:text-gray-600'}`}
            >
              {t('searchByAddress')}
            </button>
          </div>
        </div>

        {activeTab === 'NID' ? (
          <div className="space-y-8 animate-in fade-in slide-in-from-top-2">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-700 uppercase tracking-widest">{t('nidLabel')}</label>
                <input 
                  type="text" 
                  placeholder="e.g. 19902692500001"
                  value={nid}
                  onChange={(e) => setNid(e.target.value)}
                  className="w-full !bg-white !text-gray-900 border-2 border-gray-300 rounded-2xl px-6 py-4 focus:ring-4 focus:ring-green-500/10 focus:border-green-500 outline-none transition-all font-bold text-lg"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-700 uppercase tracking-widest">{t('dobLabel')}</label>
                <input 
                  type="date" 
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full !bg-white !text-gray-900 border-2 border-gray-300 rounded-2xl px-6 py-4 focus:ring-4 focus:ring-green-500/10 focus:border-green-500 outline-none transition-all font-bold text-lg"
                />
              </div>
            </div>
            <button 
              onClick={handleNidSearch}
              className="w-full bg-green-700 text-white py-5 rounded-2xl font-black text-xl hover:bg-green-800 transition-all shadow-xl shadow-green-100"
            >
              {t('searchVoter')}
            </button>
          </div>
        ) : (
          <div className="space-y-8 animate-in fade-in slide-in-from-top-2">
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-700 uppercase tracking-widest">{t('addressLabel')}</label>
              <div className="relative">
                <input 
                  type="text" 
                  placeholder={t('votingCenterSearchPlaceholder')}
                  value={addressQuery}
                  onChange={(e) => setAddressQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddressSearch()}
                  className="w-full !bg-white !text-gray-900 border-2 border-gray-300 rounded-2xl px-6 py-4 pr-16 focus:ring-4 focus:ring-green-500/10 focus:border-green-500 outline-none transition-all font-bold text-lg"
                />
                <button 
                  onClick={handleAddressSearch}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-green-700 text-white w-10 h-10 rounded-xl flex items-center justify-center shadow-lg hover:bg-green-800 transition-colors"
                >
                  🔍
                </button>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="mt-10 p-6 bg-red-50 text-red-600 rounded-2xl text-center font-black border border-red-100 animate-in fade-in slide-in-from-top-4">
            {activeTab === 'NID' ? t('voterNotFound') : t('noCentersFound')}
          </div>
        )}

        {activeTab === 'NID' && voterResult && (
          <div className="mt-10 bg-green-50/50 p-8 rounded-[32px] border border-green-100 space-y-8 animate-in zoom-in-95">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <p className="text-xs font-black text-green-600 uppercase tracking-widest mb-1">{lang === Language.BN ? 'নাম' : 'Name'}</p>
                <p className="text-xl font-black text-gray-800">{lang === Language.BN ? voterResult.nameBn : voterResult.name}</p>
              </div>
              <div>
                <p className="text-xs font-black text-green-600 uppercase tracking-widest mb-1">{lang === Language.BN ? 'ভোটের এলাকা' : 'Voter Area'}</p>
                <p className="text-xl font-black text-gray-800">{voterCenter?.area}</p>
              </div>
            </div>

            <div className="pt-6 border-t border-green-200">
              <h4 className="text-sm font-black text-green-700 uppercase tracking-widest mb-4">{lang === Language.BN ? 'আপনার নির্ধারিত ভোট কেন্দ্র' : 'Your Assigned Voting Center'}</h4>
              <div className="bg-white p-6 rounded-2xl border border-green-100">
                <p className="text-lg font-black text-gray-900 mb-1">{lang === Language.BN ? voterCenter?.nameBn : voterCenter?.name}</p>
                <p className="text-gray-500 font-medium mb-4">{lang === Language.BN ? voterCenter?.addressBn : voterCenter?.address}</p>
                
                <div className="flex flex-wrap gap-4 text-sm font-bold">
                  <div className="bg-gray-50 px-4 py-2 rounded-lg">
                    <span className="text-gray-400 mr-2">{lang === Language.BN ? 'ক্রমিক নং:' : 'Serial No:'}</span>
                    <span className="text-green-700">{voterResult.serialNo}</span>
                  </div>
                  <div className="bg-gray-50 px-4 py-2 rounded-lg">
                    <span className="text-gray-400 mr-2">{lang === Language.BN ? 'ভোটার নম্বর:' : 'Voter No:'}</span>
                    <span className="text-green-700">{voterResult.voterNo}</span>
                  </div>
                </div>

                <a 
                  href={voterCenter?.mapUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex items-center gap-2 bg-green-700 text-white px-6 py-3 rounded-xl font-black text-sm hover:bg-green-800 transition-all shadow-md"
                >
                  📍 {t('viewOnMap')}
                </a>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'ADDRESS' && centerResults.length > 0 && (
          <div className="mt-10 space-y-6 animate-in fade-in slide-in-from-top-4">
            <h4 className="text-sm font-black text-gray-400 uppercase tracking-widest">{t('centerResults')}</h4>
            {centerResults.map(center => (
              <div key={center.id} className="bg-white p-6 rounded-[28px] border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                <div className="space-y-1">
                  <p className="text-xl font-black text-gray-900">{lang === Language.BN ? center.nameBn : center.name}</p>
                  <p className="text-gray-500 font-medium text-sm">{lang === Language.BN ? center.addressBn : center.address}</p>
                  <div className="mt-2 inline-block px-2 py-0.5 bg-green-50 text-green-700 text-[10px] font-black uppercase rounded tracking-wider border border-green-100">
                    {center.area}
                  </div>
                </div>
                <a 
                  href={center.mapUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-green-50 text-green-700 px-6 py-3 rounded-xl font-black text-sm hover:bg-green-700 hover:text-white transition-all shadow-sm border border-green-100 whitespace-nowrap"
                >
                  📍 {t('viewOnMap')}
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const CandidatesList: React.FC<{ lang: Language, user: User | null, setUser: (u: User) => void }> = ({ lang, user, setUser }) => {
  const [search, setSearch] = useState('');
  const t = (key: string) => TRANSLATIONS[key][lang];

  const filtered = MOCK_CANDIDATES.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.nameBn.includes(search) ||
    c.party.toLowerCase().includes(search.toLowerCase()) ||
    c.partyBn.includes(search)
  );

  const handleFollow = (id: string) => {
    if (!user) {
      alert(lang === Language.BN ? 'অনুগ্রহ করে প্রথমে লগইন করুন।' : 'Please login first.');
      return;
    }
    const isFollowing = user.followedCandidates.includes(id);
    const updated = {
      ...user,
      followedCandidates: isFollowing 
        ? user.followedCandidates.filter(cid => cid !== id)
        : [...user.followedCandidates, id]
    };
    setUser(updated);
    localStorage.setItem('election_user', JSON.stringify(updated));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
        <div className="space-y-2">
          <h2 className="text-4xl font-black text-gray-900 tracking-tight">{t('candidates')}</h2>
          <p className="text-gray-500 font-medium">{lang === Language.BN ? 'ঢাকা-১৭ আসনের সকল বৈধ প্রার্থী ও তাদের প্রতীক' : 'All validated candidates and symbols for Dhaka-17'}</p>
        </div>
        <div className="relative w-full md:w-[400px]">
          <input 
            type="text" 
            placeholder={t('searchPlaceholder')}
            className="w-full !bg-white !text-gray-900 border-2 border-gray-300 rounded-2xl px-6 py-4 pl-14 focus:ring-4 focus:ring-green-500/10 focus:border-green-500 outline-none transition-all shadow-sm font-medium"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <span className="absolute left-6 top-1/2 -translate-y-1/2 text-xl text-gray-400">🔍</span>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {filtered.map(c => (
          <CandidateCard 
            key={c.id} 
            candidate={c} 
            lang={lang} 
            onFollow={handleFollow}
            isFollowing={user?.followedCandidates.includes(c.id) || false}
          />
        ))}
      </div>
    </div>
  );
};

const Auth: React.FC<{ lang: Language; onLogin: (u: User) => void }> = ({ lang, onLogin }) => {
  const [phone, setPhone] = useState('');
  const [nid, setNid] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const t = (key: string) => TRANSLATIONS[key][lang];

  const handleNext = () => {
    if (phone.length >= 10 && nid.length >= 5) {
      setStep(2);
    } else {
      alert(lang === Language.BN ? 'সঠিক এনআইডি এবং ফোন নম্বর দিন।' : 'Enter valid NID and Phone number.');
    }
  };

  const handleVerify = (role: UserRole = UserRole.VOTER) => {
    if (otp === '1234' || otp === 'admin') { 
      const selectedRole = otp === 'admin' ? UserRole.ADMIN : role;
      onLogin({
        id: 'user_' + Date.now(),
        phone,
        role: selectedRole,
        followedCandidates: [],
        rsvpedEvents: []
      });
      navigate(selectedRole === UserRole.ADMIN ? '/admin' : '/dashboard');
    } else {
      alert(lang === Language.BN ? 'ভুল ওটিপি!' : 'Invalid OTP!');
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="bg-white w-full max-w-md rounded-[32px] shadow-2xl shadow-gray-200/50 border border-gray-100 p-10">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-green-50 text-green-700 rounded-3xl flex items-center justify-center text-4xl mx-auto mb-6 shadow-sm">🔐</div>
          <h2 className="text-3xl font-black text-gray-900 mb-2">{t('authTitle')}</h2>
          <p className="text-gray-500 font-bold text-sm uppercase tracking-widest">{t('complianceNote')}</p>
        </div>

        {step === 1 ? (
          <div className="space-y-8 animate-in fade-in slide-in-from-left-4">
            <div>
              <label className="block text-xs font-black text-gray-700 uppercase tracking-widest mb-3">{t('nidLabel')}</label>
              <input 
                type="text" 
                value={nid}
                onChange={(e) => setNid(e.target.value)}
                placeholder="NID Number"
                className="w-full !bg-white !text-gray-900 border-2 border-gray-300 rounded-2xl py-4 px-6 focus:ring-4 focus:ring-green-500/10 focus:border-green-500 outline-none transition-all font-black text-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-black text-gray-700 uppercase tracking-widest mb-3">{t('phoneLabel')}</label>
              <div className="relative">
                <span className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 font-black">+88</span>
                <input 
                  type="tel" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="01XXXXXXXXX"
                  className="w-full !bg-white !text-gray-900 border-2 border-gray-300 rounded-2xl py-4 pl-16 pr-6 focus:ring-4 focus:ring-green-500/10 focus:border-green-500 outline-none transition-all font-black text-lg"
                />
              </div>
            </div>
            
            <div className="flex gap-4">
              <button 
                onClick={() => navigate('/')}
                className="flex-1 border-2 border-gray-300 text-gray-700 py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
              >
                <span>←</span> {t('back')}
              </button>
              <button 
                onClick={handleNext}
                className="flex-[2] bg-green-700 text-white py-5 rounded-2xl font-black text-lg hover:bg-green-800 transition-all shadow-xl shadow-green-100 flex items-center justify-center gap-2"
              >
                {t('next')} <span>→</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
            <div>
              <label className="block text-xs font-black text-gray-700 uppercase tracking-widest mb-3">{t('otpLabel')}</label>
              <input 
                type="text" 
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="____"
                className="w-full !bg-white !text-gray-900 border-2 border-gray-300 rounded-2xl py-5 text-center text-4xl font-black tracking-normal focus:ring-4 focus:ring-green-500/10 focus:border-green-500 outline-none transition-all"
              />
              <p className="text-sm font-bold text-green-600 mt-4 text-center">
                {lang === Language.BN ? '৪ সংখ্যার কোডটি টাইপ করুন (Test: 1234)' : 'Enter the 4-digit code (Test: 1234)'}
              </p>
            </div>
            
            <div className="flex gap-4">
              <button 
                onClick={() => setStep(1)}
                className="flex-1 border-2 border-gray-300 text-gray-700 py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
              >
                <span>←</span> {t('back')}
              </button>
              <button 
                onClick={() => handleVerify()}
                className="flex-[2] bg-green-700 text-white py-5 rounded-2xl font-black text-lg hover:bg-green-800 transition-all shadow-xl"
              >
                {t('verify')}
              </button>
            </div>
          </div>
        )}
        
        <button 
          onClick={() => navigate('/')}
          className="mt-8 text-xs text-gray-400 font-black hover:text-green-700 transition-colors uppercase tracking-widest mx-auto block"
        >
          {t('backToHome')}
        </button>
      </div>
    </div>
  );
};

const Dashboard: React.FC<{ lang: Language; user: User; setUser: (u: User) => void, votingCenters: VotingCenter[] }> = ({ lang, user, setUser, votingCenters }) => {
  const t = (key: string) => TRANSLATIONS[key][lang];
  const followedCandidates = MOCK_CANDIDATES.filter(c => user.followedCandidates.includes(c.id));
  const candidateEvents = MOCK_EVENTS.filter(e => user.followedCandidates.includes(e.candidateId));

  const [centerSearch, setCenterSearch] = useState('');
  const [centerResults, setCenterResults] = useState<VotingCenter[]>([]);

  const handleRsvp = (eventId: string) => {
    const isRsvped = user.rsvpedEvents.includes(eventId);
    const updated = {
      ...user,
      rsvpedEvents: isRsvped 
        ? user.rsvpedEvents.filter(id => id !== eventId)
        : [...user.rsvpedEvents, eventId]
    };
    setUser(updated);
    localStorage.setItem('election_user', JSON.stringify(updated));
  };

  const handleCenterSearch = () => {
    if (!centerSearch.trim()) {
      setCenterResults([]);
      return;
    }
    const results = votingCenters.filter(c => 
      c.area.toLowerCase().includes(centerSearch.toLowerCase()) || 
      c.name.toLowerCase().includes(centerSearch.toLowerCase()) ||
      c.nameBn.includes(centerSearch)
    );
    setCenterResults(results);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="bg-white p-10 rounded-[40px] shadow-sm border border-gray-100 mb-16 flex flex-col sm:flex-row items-center justify-between gap-10">
        <div className="flex items-center gap-8">
          <div className="w-24 h-24 bg-green-100 text-green-700 rounded-[32px] flex items-center justify-center text-4xl font-black shadow-inner">
            {user.phone.slice(-2)}
          </div>
          <div className="space-y-1">
            <h1 className="text-3xl font-black text-gray-900">{lang === Language.BN ? 'শুভেচ্ছা, সম্মানিত ভোটার!' : 'Welcome, Honored Voter!'}</h1>
            <p className="text-gray-400 font-bold uppercase tracking-widest">Phone: +88 {user.phone}</p>
          </div>
        </div>
        <div className="bg-green-50 px-6 py-3 rounded-2xl text-green-700 font-black text-sm uppercase tracking-widest border border-green-100">
          {t('voterRole')}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-16">
        <div className="lg:col-span-2 space-y-20">
          <section className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-xl shadow-gray-200/30">
            <h3 className="text-2xl font-black mb-6 flex items-center gap-4">
              <span className="text-3xl">📍</span> {t('votingCenterTitle')}
            </h3>
            <div className="flex gap-4 mb-8">
              <input 
                type="text" 
                value={centerSearch}
                onChange={(e) => setCenterSearch(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleCenterSearch()}
                placeholder={t('votingCenterSearchPlaceholder')}
                className="flex-1 !bg-white !text-gray-900 border-2 border-gray-300 rounded-2xl px-6 py-4 focus:ring-4 focus:ring-green-500/10 focus:border-green-500 outline-none transition-all font-medium"
              />
              <button 
                onClick={handleCenterSearch}
                className="bg-green-700 text-white px-8 py-4 rounded-2xl font-black hover:bg-green-800 transition-all shadow-lg"
              >
                {lang === Language.BN ? 'খুঁজুন' : 'Search'}
              </button>
            </div>

            {centerResults.length > 0 && (
              <div className="space-y-6">
                <h4 className="text-sm font-black text-gray-700 uppercase tracking-widest">{t('centerResults')}</h4>
                {centerResults.map(center => (
                  <div key={center.id} className="p-6 rounded-3xl border border-green-100 bg-green-50/30 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 animate-in fade-in slide-in-from-top-2">
                    <div className="space-y-1">
                      <h5 className="text-xl font-black text-gray-900">{lang === Language.BN ? center.nameBn : center.name}</h5>
                      <p className="text-gray-600 font-medium">{lang === Language.BN ? center.addressBn : center.address}</p>
                    </div>
                    <a 
                      href={center.mapUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="whitespace-nowrap bg-white text-green-700 border-2 border-green-100 px-6 py-2 rounded-xl font-black text-sm hover:bg-green-700 hover:text-white transition-all shadow-sm"
                    >
                      {t('viewOnMap')}
                    </a>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section>
            <h3 className="text-2xl font-black mb-8 flex items-center gap-4">
              <span className="text-3xl">🤝</span> {lang === Language.BN ? 'আপনার পছন্দের প্রার্থীগণ' : 'Candidates You Follow'}
            </h3>
            {followedCandidates.length > 0 ? (
              <div className="grid sm:grid-cols-2 gap-8">
                {followedCandidates.map(c => (
                  <div key={c.id} className="bg-white p-6 rounded-3xl border border-gray-100 flex items-center gap-6 shadow-sm hover:shadow-md transition-shadow">
                    <img src={c.imageUrl} className="w-20 h-20 rounded-2xl object-cover shadow-sm" />
                    <div>
                      <h4 className="font-black text-lg">{lang === Language.BN ? c.nameBn : c.name}</h4>
                      <p className="text-xs text-green-600 font-black uppercase tracking-wider">{lang === Language.BN ? c.partyBn : c.party}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-[32px] p-12 text-center text-gray-400 font-bold italic">
                {lang === Language.BN ? 'আপনি এখনো কোনো প্রার্থী অনুসরণ করেননি।' : "You haven't followed any candidates yet."}
              </div>
            )}
          </section>
        </div>

        <div className="space-y-10">
          <div className="bg-green-950 p-10 rounded-[40px] text-white shadow-2xl">
            <h3 className="text-2xl font-black mb-8">{lang === Language.BN ? 'নির্বাচনী ক্যালেন্ডার' : 'Election Hub'}</h3>
            <div className="space-y-6 text-sm">
              <div className="flex justify-between items-center border-b border-white/10 pb-4">
                <span className="font-bold opacity-70">{lang === Language.BN ? 'ভোটের দিন' : 'Election Day'}</span>
                <span className="font-black text-green-400">May 30, 2025</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const AdminDashboard: React.FC<{ lang: Language; votingCenters: VotingCenter[]; setVotingCenters: React.Dispatch<React.SetStateAction<VotingCenter[]>> }> = ({ lang, votingCenters, setVotingCenters }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<VotingCenter>>({});

  const handleDelete = (id: string) => {
    if (confirm(lang === Language.BN ? 'আপনি কি নিশ্চিত?' : 'Are you sure?')) {
      setVotingCenters(prev => prev.filter(c => c.id !== id));
    }
  };

  const handleEdit = (center: VotingCenter) => {
    setEditingId(center.id);
    setFormData(center);
  };

  const handleAddNew = () => {
    setEditingId('new');
    setFormData({ id: 'vc_' + Date.now(), name: '', nameBn: '', address: '', addressBn: '', area: '', mapUrl: '' });
  };

  const handleSave = () => {
    if (!formData.name || !formData.nameBn) return alert('Name is required');
    
    if (editingId === 'new') {
      setVotingCenters(prev => [...prev, formData as VotingCenter]);
    } else {
      setVotingCenters(prev => prev.map(c => c.id === editingId ? { ...c, ...formData } : c));
    }
    setEditingId(null);
    setFormData({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-3xl font-black text-gray-900">Admin Panel</h1>
          <p className="text-gray-500 font-bold uppercase tracking-widest mt-1">Manage Polling Centers</p>
        </div>
        <button 
          onClick={handleAddNew}
          className="bg-green-700 text-white px-8 py-3 rounded-xl font-black hover:bg-green-800 transition-all shadow-lg"
        >
          Add New Center
        </button>
      </div>

      <div className="grid gap-6">
        {votingCenters.map(center => (
          <div key={center.id} className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-3">
                <h3 className="text-xl font-black text-gray-900">{center.name}</h3>
                <span className="text-xs font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded">ID: {center.id}</span>
              </div>
              <p className="text-sm font-medium text-gray-500">{center.nameBn}</p>
              <div className="text-sm text-gray-400 font-bold mt-2">
                📍 {center.address} / {center.area}
              </div>
            </div>
            <div className="flex gap-4">
              <button 
                onClick={() => handleEdit(center)}
                className="bg-blue-50 text-blue-700 px-6 py-2 rounded-xl font-black text-sm hover:bg-blue-100 transition-all"
              >
                Edit
              </button>
              <button 
                onClick={() => handleDelete(center.id)}
                className="bg-red-50 text-red-700 px-6 py-2 rounded-xl font-black text-sm hover:bg-red-100 transition-all"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {editingId && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-[40px] p-10 shadow-2xl animate-in zoom-in-95 duration-200 overflow-y-auto max-h-[90vh]">
            <h2 className="text-2xl font-black mb-8">{editingId === 'new' ? 'Add New Center' : 'Edit Center'}</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-700 uppercase tracking-widest">Name (English)</label>
                <input 
                  className="w-full !bg-white !text-gray-900 border-2 border-gray-300 rounded-xl px-4 py-3 font-bold" 
                  value={formData.name || ''} 
                  onChange={e => setFormData({ ...formData, name: e.target.value })} 
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-700 uppercase tracking-widest">Name (Bengali)</label>
                <input 
                  className="w-full !bg-white !text-gray-900 border-2 border-gray-300 rounded-xl px-4 py-3 font-bold" 
                  value={formData.nameBn || ''} 
                  onChange={e => setFormData({ ...formData, nameBn: e.target.value })} 
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-700 uppercase tracking-widest">Address (English)</label>
                <input 
                  className="w-full !bg-white !text-gray-900 border-2 border-gray-300 rounded-xl px-4 py-3 font-bold" 
                  value={formData.address || ''} 
                  onChange={e => setFormData({ ...formData, address: e.target.value })} 
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-700 uppercase tracking-widest">Address (Bengali)</label>
                <input 
                  className="w-full !bg-white !text-gray-900 border-2 border-gray-300 rounded-xl px-4 py-3 font-bold" 
                  value={formData.addressBn || ''} 
                  onChange={e => setFormData({ ...formData, addressBn: e.target.value })} 
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-700 uppercase tracking-widest">Area</label>
                <input 
                  className="w-full !bg-white !text-gray-900 border-2 border-gray-300 rounded-xl px-4 py-3 font-bold" 
                  value={formData.area || ''} 
                  onChange={e => setFormData({ ...formData, area: e.target.value })} 
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-700 uppercase tracking-widest">Google Maps URL</label>
                <input 
                  className="w-full !bg-white !text-gray-900 border-2 border-gray-300 rounded-xl px-4 py-3 font-bold" 
                  value={formData.mapUrl || ''} 
                  onChange={e => setFormData({ ...formData, mapUrl: e.target.value })} 
                />
              </div>
            </div>
            <div className="flex gap-4 mt-10">
              <button 
                onClick={handleSave}
                className="flex-1 bg-green-700 text-white py-4 rounded-2xl font-black hover:bg-green-800 transition-all shadow-xl"
              >
                Save Changes
              </button>
              <button 
                onClick={() => setEditingId(null)}
                className="flex-1 bg-gray-100 text-gray-500 py-4 rounded-2xl font-black hover:bg-gray-200 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default function App() {
  const [lang, setLang] = useState<Language>(Language.BN);
  const [user, setUser] = useState<User | null>(null);
  const [votingCenters, setVotingCenters] = useState<VotingCenter[]>(MOCK_VOTING_CENTERS);

  useEffect(() => {
    const saved = localStorage.getItem('election_user');
    if (saved) setUser(JSON.parse(saved));
  }, []);

  const handleLogin = (u: User) => {
    setUser(u);
    localStorage.setItem('election_user', JSON.stringify(u));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('election_user');
  };

  return (
    <Router>
      <div className={`min-h-screen bg-[#FDFDFD] text-gray-900 selection:bg-green-100 selection:text-green-900 ${lang === Language.BN ? 'font-hind-siliguri' : 'font-inter'}`}>
        <Navbar lang={lang} setLang={setLang} user={user} onLogout={handleLogout} />
        
        <main>
          <Routes>
            <Route path="/" element={<Home lang={lang} />} />
            <Route path="/candidates" element={<CandidatesList lang={lang} user={user} setUser={setUser} />} />
            <Route path="/candidates/:id" element={<CandidatePortal lang={lang} user={user} setUser={setUser} />} />
            <Route path="/voter-search" element={<VoterSearchPortal lang={lang} votingCenters={votingCenters} />} />
            <Route path="/campaign" element={<CampaignPortal lang={lang} user={user} setUser={handleLogin} />} />
            <Route path="/auth" element={<Auth lang={lang} onLogin={handleLogin} />} />
            <Route path="/dashboard" element={user && user.role === UserRole.VOTER ? <Dashboard lang={lang} user={user} setUser={handleLogin} votingCenters={votingCenters} /> : <Auth lang={lang} onLogin={handleLogin} />} />
            <Route path="/admin" element={user && user.role === UserRole.ADMIN ? <AdminDashboard lang={lang} votingCenters={votingCenters} setVotingCenters={setVotingCenters} /> : <Auth lang={lang} onLogin={handleLogin} />} />
          </Routes>
        </main>

        <ChatBot lang={lang} />
      </div>
    </Router>
  );
}
