
export enum Language {
  BN = 'BN',
  EN = 'EN'
}

export enum UserRole {
  VOTER = 'VOTER',
  CANDIDATE = 'CANDIDATE',
  ADMIN = 'ADMIN'
}

export interface Candidate {
  id: string;
  name: string;
  nameBn: string;
  party: string;
  partyBn: string;
  manifesto: string;
  manifestoBn: string;
  focusIssues: string[];
  imageUrl: string;
  symbol: string;
}

export interface ElectionEvent {
  id: string;
  candidateId: string;
  title: string;
  titleBn: string;
  description: string;
  descriptionBn: string;
  date: string;
  location: string;
  locationBn: string;
  type: 'Rally' | 'Meeting' | 'Seminar';
  attendanceCount: number; // Added for real-time simulation
}

export interface ElectionNotice {
  id: string;
  title: string;
  titleBn: string;
  content: string;
  contentBn: string;
  date: string;
  category: 'Security' | 'Logistics' | 'Center Update';
}

export interface VotingCenter {
  id: string;
  name: string;
  nameBn: string;
  address: string;
  addressBn: string;
  mapUrl: string;
  area: string;
}

export interface VoterDetails {
  nid: string;
  dob: string;
  name: string;
  nameBn: string;
  fatherNameBn: string;
  motherNameBn: string;
  votingCenterId: string;
  serialNo: string;
  voterNo: string;
}

export interface User {
  id: string;
  phone: string;
  role: UserRole;
  name?: string;
  followedCandidates: string[];
  rsvpedEvents: string[];
}

export type TranslationMap = Record<string, { [key in Language]: string }>;
