
import React from 'react';
import { Link } from 'react-router-dom';
import { Candidate, Language } from '../types';
import { TRANSLATIONS } from '../constants';

interface CandidateCardProps {
  candidate: Candidate;
  lang: Language;
  onFollow?: (id: string) => void;
  isFollowing: boolean;
}

export const CandidateCard: React.FC<CandidateCardProps> = ({ candidate, lang, onFollow, isFollowing }) => {
  const t = (key: string) => TRANSLATIONS[key][lang];

  return (
    <div className="bg-white rounded-3xl shadow-sm overflow-hidden hover:shadow-xl transition-all border border-gray-100 group">
      <Link to={`/candidates/${candidate.id}`} className="block relative h-56 overflow-hidden">
        <img 
          src={candidate.imageUrl} 
          alt={candidate.name} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-4 right-4 bg-white/95 backdrop-blur px-3 py-1 rounded-2xl text-2xl shadow-lg">
          {candidate.symbol}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
          <span className="text-white font-black text-sm uppercase tracking-widest">
            {lang === Language.BN ? 'প্রোফাইল দেখুন' : 'View Profile'} →
          </span>
        </div>
      </Link>
      <div className="p-6">
        <div className="mb-4">
          <Link to={`/candidates/${candidate.id}`} className="text-xl font-black text-gray-900 hover:text-green-700 transition-colors inline-block">
            {lang === Language.BN ? candidate.nameBn : candidate.name}
          </Link>
          <p className="text-green-600 font-black uppercase tracking-widest text-[10px] mt-1">
            {lang === Language.BN ? candidate.partyBn : candidate.party}
          </p>
        </div>
        
        <div className="mb-6">
          <p className="text-gray-500 text-sm font-medium line-clamp-2 leading-relaxed">
            {lang === Language.BN ? candidate.manifestoBn : candidate.manifesto}
          </p>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-6">
          {candidate.focusIssues.slice(0, 2).map((issue) => (
            <span key={issue} className="px-2 py-0.5 bg-gray-50 text-gray-400 text-[9px] rounded uppercase font-black border border-gray-100">
              {issue}
            </span>
          ))}
          {candidate.focusIssues.length > 2 && (
            <span className="px-2 py-0.5 text-gray-300 text-[9px] font-black uppercase">
              +{candidate.focusIssues.length - 2}
            </span>
          )}
        </div>

        <button
          onClick={(e) => {
            e.preventDefault();
            onFollow?.(candidate.id);
          }}
          className={`w-full py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${
            isFollowing 
            ? 'bg-gray-100 text-gray-400 border border-gray-200' 
            : 'bg-green-700 text-white hover:bg-green-800 shadow-lg shadow-green-100'
          }`}
        >
          {isFollowing ? t('followed') : t('follow')}
        </button>
      </div>
    </div>
  );
};
