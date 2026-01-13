
import React from 'react';
import { Candidate, ElectionEvent, TranslationMap, VotingCenter, VoterDetails, ElectionNotice } from './types';

export const TRANSLATIONS: TranslationMap = {
  appName: { EN: 'Dhaka-17 Election Portal', BN: 'ঢাকা-১৭ নির্বাচনী পোর্টাল' },
  home: { EN: 'Home', BN: 'হোম' },
  candidates: { EN: 'Candidates', BN: 'প্রার্থীগণ' },
  dashboard: { EN: 'Dashboard', BN: 'ড্যাশবোর্ড' },
  login: { EN: 'Login', BN: 'লগইন' },
  logout: { EN: 'Logout', BN: 'লগআউট' },
  searchPlaceholder: { EN: 'Search candidates...', BN: 'প্রার্থী খুঁজুন...' },
  voterRole: { EN: 'Voter', BN: 'ভোটার' },
  candidateRole: { EN: 'Candidate', BN: 'প্রার্থী' },
  adminRole: { EN: 'Admin', BN: 'এডমিন' },
  manifesto: { EN: 'Manifesto', BN: 'ইশতেহার' },
  party: { EN: 'Party', BN: 'দল' },
  events: { EN: 'Campaign & Events', BN: 'নির্বাচনী প্রচার' },
  rsvp: { EN: 'RSVP Now', BN: 'অংশগ্রহণ করুন' },
  rsvped: { EN: 'You are Going', BN: 'আপনি যাচ্ছেন' },
  followed: { EN: 'Following', BN: 'অনুসরণ করছেন' },
  follow: { EN: 'Follow', BN: 'অনুসরণ করুন' },
  aiAssistant: { EN: 'D-17 AI Assistant', BN: 'ডি-১৭ এআই সহকারী' },
  chatWelcome: { EN: 'Hello! Ask me about Dhaka-17 voting centers, candidate manifestos, or neighborhood issues.', BN: 'নমস্কার! ঢাকা-১৭ এর ভোট কেন্দ্র, প্রার্থীর ইশতেহার বা এলাকাভিত্তিক সমস্যা সম্পর্কে জিজ্ঞাসা করুন।' },
  phoneLabel: { EN: 'Phone Number', BN: 'ফোন নম্বর' },
  otpLabel: { EN: 'OTP Code', BN: 'ওটিপি কোড' },
  authTitle: { EN: 'Secure Voter Access', BN: 'নিরাপদ ভোটার অ্যাক্সেস' },
  complianceNote: { EN: 'Compliance with Digital Security Act 2018', BN: 'ডিজিটাল নিরাপত্তা আইন ২০১৮ অনুযায়ী পরিচালিত' },
  votingCenterTitle: { EN: 'Find Your Polling Center', BN: 'আপনার ভোট কেন্দ্র খুঁজুন' },
  votingCenterSearchPlaceholder: { EN: 'Enter Area (e.g. Banani)', BN: 'এলাকা লিখুন (যেমন: বনানী)' },
  centerResults: { EN: 'Polling Center Results', BN: 'ভোট কেন্দ্রের ফলাফল' },
  viewOnMap: { EN: 'View on Google Maps', BN: 'গুগল ম্যাপে দেখুন' },
  voterSearchTitle: { EN: 'Voter Information Portal', BN: 'ভোটার তথ্য পোর্টাল' },
  nidLabel: { EN: 'National ID (NID)', BN: 'জাতীয় পরিচয়পত্র (NID)' },
  dobLabel: { EN: 'Date of Birth', BN: 'জন্ম তারিখ' },
  searchVoter: { EN: 'Search Voter Details', BN: 'ভোটার তথ্য খুঁজুন' },
  voterNotFound: { EN: 'Voter not found. Check NID and DOB.', BN: 'ভোটার তথ্য পাওয়া যায়নি। NID ও জন্ম তারিখ যাচাই করুন।' },
  campaignPortalTitle: { EN: 'Campaign & Center Hub', BN: 'প্রচার ও কেন্দ্র হাব' },
  liveUpdates: { EN: 'Center & Official Notices', BN: 'কেন্দ্র ও দাপ্তরিক নোটিশ' },
  upcomingRallies: { EN: 'Upcoming Rallies & Meetings', BN: 'আসন্ন সমাবেশ ও মিটিং' },
  searchByNid: { EN: 'Find My Center (NID)', BN: 'কেন্দ্র খুঁজুন (NID)' },
  searchByAddress: { EN: 'Find Center by Address', BN: 'ঠিকানা দিয়ে কেন্দ্র খুঁজুন' },
  addressLabel: { EN: 'Enter Address / Area', BN: 'ঠিকানা বা এলাকা লিখুন' },
  noCentersFound: { EN: 'No centers found in this area.', BN: 'এই এলাকায় কোনো কেন্দ্র পাওয়া যায়নি।' },
  backToHome: { EN: 'Back to Home', BN: 'হোমে ফিরে যান' },
  back: { EN: 'Back', BN: 'পেছনে' },
  next: { EN: 'Next', BN: 'পরবর্তী' },
  verify: { EN: 'Verify & Login', BN: 'যাচাই ও লগইন' },
};

export const MOCK_CANDIDATES: Candidate[] = [
  {
    id: '1',
    name: 'Prof. Dr. Mohammad A. Arafat',
    nameBn: 'অধ্যাপক মোহাম্মদ এ. আরাফাত',
    party: 'Bangladesh Awami League',
    partyBn: 'বাংলাদেশ আওয়ামী লীগ',
    manifesto: 'Vision 2041 implementation in Dhaka-17, focusing on smart governance, Gulshan-Banani drainage modernization, and high-tech urban parks.',
    manifestoBn: 'স্মার্ট ঢাকা-১৭ বিনির্মাণে স্মার্ট গভর্নেন্স, গুলশান-বনানীর ড্রেনেজ ব্যবস্থার আধুনিকায়ন এবং হাই-টেক আরবান পার্ক তৈরি করাই আমার মূল লক্ষ্য।',
    focusIssues: ['Smart Governance', 'Infrastructure', 'Youth Employment'],
    imageUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=400&h=400&auto=format&fit=crop',
    symbol: '🚢'
  },
  {
    id: '2',
    name: 'Andaleeve Rahman Partha',
    nameBn: 'আন্দালিব রহমান পার্থ',
    party: 'Bangladesh Jatiya Party (BJP)',
    partyBn: 'বাংলাদেশ জাতীয় পার্টি (বিজেপি)',
    manifesto: 'Institutionalizing accountability in public services, ensuring democratic rights for all residents, and solving the Bhashantek housing crisis.',
    manifestoBn: 'সরকারি সেবায় জবাবদিহিতা নিশ্চিত করা, সকল নাগরিকের গণতান্ত্রিক অধিকার রক্ষা এবং ভাষানটেকের আবাসন সমস্যার স্থায়ী সমাধান করাই আমার অঙ্গীকার।',
    focusIssues: ['Accountability', 'Housing Rights', 'Education'],
    imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400&h=400&auto=format&fit=crop',
    symbol: '🚜'
  },
  {
    id: '3',
    name: 'Barrister Shahjahan Omar',
    nameBn: 'ব্যারিস্টার শাহজাহান ওমর',
    party: 'Independent',
    partyBn: 'স্বতন্ত্র',
    manifesto: 'Focusing on legal reform at the local level, community policing for better security in Baridhara, and lake restoration.',
    manifestoBn: 'স্থানীয় পর্যায়ে আইনি সংস্কার, বারিধারার নিরাপত্তা বৃদ্ধিতে কমিউনিটি পুলিশিং এবং লেক পুনরুদ্ধারের ওপর গুরুত্বারোপ করব।',
    focusIssues: ['Legal Reform', 'Security', 'Environment'],
    imageUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=400&h=400&auto=format&fit=crop',
    symbol: '🏠'
  }
];

export const MOCK_EVENTS: ElectionEvent[] = [
  {
    id: 'e1',
    candidateId: '1',
    title: 'Gulshan-Banani Town Hall',
    titleBn: 'গুলশান-বনানী টাউন হল মিটিং',
    description: 'A direct dialogue on the digitalization of Dhaka-17 civic services.',
    descriptionBn: 'ঢাকা-১৭ এর নাগরিক সেবা ডিজিটালাইজেশন নিয়ে সরাসরি সংলাপ।',
    date: '2025-05-15T10:00:00',
    location: 'Gulshan Youth Club Ground',
    locationBn: 'গুলশান ইয়ুথ ক্লাব মাঠ',
    type: 'Meeting',
    attendanceCount: 1240
  },
  {
    id: 'e2',
    candidateId: '2',
    title: 'Bhashantek Upliftment Rally',
    titleBn: 'ভাষানটেক উন্নয়ন সমাবেশ',
    description: 'Presenting the plan for modern housing in the Bhashantek area.',
    descriptionBn: 'ভাষানটেক এলাকায় আধুনিক আবাসন পরিকল্পনা উপস্থাপন।',
    date: '2025-05-18T16:00:00',
    location: 'Bhashantek High School Field',
    locationBn: 'ভাষানটেক হাই স্কুল মাঠ',
    type: 'Rally',
    attendanceCount: 4500
  },
  {
    id: 'e3',
    candidateId: '3',
    title: 'Baridhara Security Seminar',
    titleBn: 'বারিধারা নিরাপত্তা সেমিনার',
    description: 'Discussing integrated community security for Baridhara DOHS.',
    descriptionBn: 'বারিধারা ডিওএইচএস-এর জন্য সমন্বিত নিরাপত্তা আলোচনা।',
    date: '2025-05-20T11:00:00',
    location: 'Baridhara Society Park',
    locationBn: 'বারিধারা সোসাইটি পার্ক',
    type: 'Seminar',
    attendanceCount: 620
  }
];

export const MOCK_NOTICES: ElectionNotice[] = [
  {
    id: 'n1',
    title: 'CCTV Installation Complete',
    titleBn: 'সিসিটিভি ক্যামেরা স্থাপন সম্পন্ন',
    content: 'All polling centers in Gulshan 2 have been equipped with 24/7 CCTV surveillance for enhanced security.',
    contentBn: 'গুলশান ২ এর সকল ভোট কেন্দ্রে নিরাপত্তা বৃদ্ধিতে ২৪ ঘণ্টা সিসিটিভি নজরদারি নিশ্চিত করা হয়েছে।',
    date: '2025-05-10',
    category: 'Security'
  },
  {
    id: 'n2',
    title: 'Center Relocation Notice',
    titleBn: 'কেন্দ্র স্থানান্তর বিজ্ঞপ্তি',
    content: 'Center #104 has been moved from Banani Model School to Banani Community Center due to renovation.',
    contentBn: 'সংস্কার কাজের জন্য ১০৪ নং কেন্দ্রটি বনানী মডেল স্কুল থেকে বনানী কমিউনিটি সেন্টারে স্থানান্তর করা হয়েছে।',
    date: '2025-05-12',
    category: 'Center Update'
  },
  {
    id: 'n3',
    title: 'Mock Voting Scheduled',
    titleBn: 'মক ভোটিং এর সময়সূচী',
    content: 'Mock voting will be held on May 25th in all Dhaka-17 centers to familiarize voters with EVMs.',
    contentBn: 'ভোটারদের ইভিএম সম্পর্কে ধারণা দিতে ২৫ মে ঢাকা-১৭ এর সকল কেন্দ্রে মক ভোটিং অনুষ্ঠিত হবে।',
    date: '2025-05-14',
    category: 'Logistics'
  }
];

export const MOCK_VOTING_CENTERS: VotingCenter[] = [
  {
    id: 'vc1',
    name: 'Gulshan Model High School and College',
    nameBn: 'গুলশান মডেল হাই স্কুল এন্ড কলেজ',
    address: 'Road No. 90, Gulshan 2, Dhaka',
    addressBn: 'রোড নং ৯০, গুলশান ২, ঢাকা',
    mapUrl: 'https://maps.google.com/?q=Gulshan+Model+High+School+and+College',
    area: 'Gulshan'
  },
  {
    id: 'vc2',
    name: 'Banani Vidyaniketan School and College',
    nameBn: 'বনানী বিদ্যানিকেতন স্কুল এন্ড কলেজ',
    address: 'Road No. 7, Block E, Banani, Dhaka',
    addressBn: 'রোড নং ৭, ব্লক ই, বনানী, ঢাকা',
    mapUrl: 'https://maps.google.com/?q=Banani+Vidyaniketan+School+and+College',
    area: 'Banani'
  },
  {
    id: 'vc3',
    name: 'Baridhara High School',
    nameBn: 'বারিধারা হাই স্কুল',
    address: 'Baridhara, Dhaka',
    addressBn: 'বারিধারা, ঢাকা',
    mapUrl: 'https://maps.google.com/?q=Baridhara+High+School',
    area: 'Baridhara'
  }
];

export const MOCK_VOTER_DB: VoterDetails[] = [
  {
    nid: '19902692500001',
    dob: '1990-01-01',
    name: 'Rahim Ahmed',
    nameBn: 'রহিম আহমেদ',
    fatherNameBn: 'করিম আহমেদ',
    motherNameBn: 'সোহেলী বেগম',
    votingCenterId: 'vc1',
    serialNo: '452',
    voterNo: '190-05-0452'
  },
  {
    nid: '19852692500002',
    dob: '1985-05-10',
    name: 'Fatema Khatun',
    nameBn: 'ফাতেমা খাতুন',
    fatherNameBn: 'আলি আকবর',
    motherNameBn: 'মরিয়ম বিবি',
    votingCenterId: 'vc2',
    serialNo: '128',
    voterNo: '190-02-0128'
  },
  {
    nid: '19952692500003',
    dob: '1995-12-25',
    name: 'Sagor Hossain',
    nameBn: 'সাগর হোসেন',
    fatherNameBn: 'বেলায়েত হোসেন',
    motherNameBn: 'নাজমা আক্তার',
    votingCenterId: 'vc3',
    serialNo: '891',
    voterNo: '190-08-0891'
  }
];
