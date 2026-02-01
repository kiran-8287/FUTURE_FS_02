export enum LeadStatus {
  New = 'New',
  Contacted = 'Contacted',
  Converted = 'Converted',
  Lost = 'Lost'
}

export enum LeadSource {
  Website = 'Website',
  Referral = 'Referral',
  SocialMedia = 'Social Media',
  LinkedIn = 'LinkedIn',
  Other = 'Other'
}

export interface Note {
  id: string;
  text: string;
  timestamp: string;
  author: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  title?: string;
  source: LeadSource;
  status: LeadStatus;
  message?: string;
  value?: number; // Potential deal value
  dateAdded: string;
  lastInteraction: string;
  notes: Note[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  avatar?: string;
}

export type SortField = 'dateAdded' | 'name' | 'status' | 'value';
export type SortOrder = 'asc' | 'desc';
