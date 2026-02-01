import { Lead, LeadStatus, LeadSource } from './types';

export const MOCK_LEADS: Lead[] = [
  {
    id: '1',
    name: 'Aarav Patel',
    email: 'aarav.p@techflow.in',
    phone: '+91 98765 43210',
    company: 'TechFlow Solutions',
    title: 'CTO',
    source: LeadSource.Website,
    status: LeadStatus.New,
    message: 'Interested in your enterprise security protocols.',
    value: 1500000,
    dateAdded: '2024-05-10T09:30:00Z',
    lastInteraction: '2024-05-10T11:00:00Z',
    notes: [
      {
        id: 'n1_1',
        text: 'Email sent: Welcome to Lumina - Introduction packet.',
        timestamp: '2024-05-10T11:00:00Z',
        author: 'Admin'
      }
    ]
  },
  {
    id: '2',
    name: 'Vihaan Kumar',
    email: 'vihaan.k@innovate.co.in',
    phone: '+91 98989 89898',
    company: 'Innovate Corp',
    title: 'Software Engineer',
    source: LeadSource.Referral,
    status: LeadStatus.Contacted,
    message: 'Looking for a comprehensive CRM solution.',
    value: 500000,
    dateAdded: '2024-05-08T14:20:00Z',
    lastInteraction: '2024-05-09T10:00:00Z',
    notes: [
      {
        id: 'n1',
        text: 'Email sent: Initial proposal packet attached.',
        timestamp: '2024-05-09T10:00:00Z',
        author: 'Admin'
      },
      {
        id: 'n1_2',
        text: 'Call: Discussed custom integration requirements.',
        timestamp: '2024-05-08T15:30:00Z',
        author: 'Admin'
      }
    ]
  },
  {
    id: '3',
    name: 'Ananya Sharma',
    email: 'ananya@solarsystems.com',
    phone: '+91 99887 76655',
    company: 'Solar Systems Ltd',
    title: 'Operations Manager',
    source: LeadSource.LinkedIn,
    status: LeadStatus.Converted,
    message: 'Urgent consultation needed regarding workflow automation.',
    value: 5000000,
    dateAdded: '2024-04-20T11:00:00Z',
    lastInteraction: '2024-04-25T16:45:00Z',
    notes: [
      {
        id: 'n2',
        text: 'Deal closed. Implementation starts next week.',
        timestamp: '2024-04-25T16:45:00Z',
        author: 'Admin'
      },
      {
        id: 'n2_1',
        text: 'Email received: Signed contract attached.',
        timestamp: '2024-04-25T09:15:00Z',
        author: 'Admin'
      },
      {
        id: 'n2_2',
        text: 'Email sent: Final contract for review.',
        timestamp: '2024-04-24T14:00:00Z',
        author: 'Admin'
      }
    ]
  },
  {
    id: '4',
    name: 'Rohan Gupta',
    email: 'rohan@futuretech.com',
    phone: '+91 91234 56789',
    company: 'Future Tech',
    title: 'CEO',
    source: LeadSource.SocialMedia,
    status: LeadStatus.New,
    message: 'I want to upgrade my existing ERP integration.',
    value: 10000000,
    dateAdded: '2024-05-11T08:15:00Z',
    lastInteraction: '2024-05-11T09:30:00Z',
    notes: [
      {
        id: 'n4_1',
        text: 'Email sent: Thank you for your interest in ERP upgrades.',
        timestamp: '2024-05-11T09:30:00Z',
        author: 'Admin'
      }
    ]
  },
  {
    id: '5',
    name: 'Arjun Reddy',
    email: 'arjun@securecorp.in',
    phone: '+91 95555 44444',
    company: 'Secure Corp',
    title: 'Chairman',
    source: LeadSource.Other,
    status: LeadStatus.Contacted,
    message: 'Need better encryption for our data centers.',
    value: 7500000,
    dateAdded: '2024-05-01T22:00:00Z',
    lastInteraction: '2024-05-05T09:30:00Z',
    notes: [
      {
        id: 'n5_1',
        text: 'Email sent: Meeting scheduled for next Tuesday.',
        timestamp: '2024-05-05T09:30:00Z',
        author: 'Admin'
      },
      {
        id: 'n5_2',
        text: 'Email received: Availability for demo call.',
        timestamp: '2024-05-04T16:20:00Z',
        author: 'Admin'
      }
    ]
  },
  {
    id: '6',
    name: 'Diya Malhotra',
    email: 'diya@creativearts.com',
    phone: '+91 94444 11111',
    company: 'Creative Arts Studio',
    title: 'Curator',
    source: LeadSource.Referral,
    status: LeadStatus.Converted,
    value: 1200000,
    dateAdded: '2024-03-15T10:00:00Z',
    lastInteraction: '2024-03-20T14:00:00Z',
    notes: [
      {
        id: 'n6_1',
        text: 'Email sent: Invoice #4021 generated.',
        timestamp: '2024-03-20T14:00:00Z',
        author: 'Admin'
      }
    ]
  },
  {
    id: '7',
    name: 'Vikram Singh',
    email: 'vikram@chemworks.com',
    phone: '+91 93333 22222',
    company: 'ChemWorks',
    title: 'Chemist',
    source: LeadSource.Website,
    status: LeadStatus.Lost,
    message: 'Need distribution logistics software.',
    value: 2000000,
    dateAdded: '2024-02-10T15:30:00Z',
    lastInteraction: '2024-02-15T09:00:00Z',
    notes: [
      { 
        id: 'n3', 
        text: 'Client uncooperative regarding budget.', 
        timestamp: '2024-02-15T09:00:00Z', 
        author: 'Admin' 
      },
      {
        id: 'n7_1',
        text: 'Email sent: Following up on budget proposal.',
        timestamp: '2024-02-12T10:00:00Z',
        author: 'Admin'
      }
    ]
  },
  {
    id: '8',
    name: 'Rahul Verma',
    email: 'rahul@globallogistics.com',
    phone: '+91 92121 21212',
    company: 'Global Logistics',
    title: 'Senior Manager',
    source: LeadSource.Other,
    status: LeadStatus.New,
    message: 'Tracking shipment efficiency.',
    value: 800000,
    dateAdded: '2024-05-12T07:45:00Z',
    lastInteraction: '2024-05-12T07:45:00Z',
    notes: []
  },
  {
    id: '9',
    name: 'Ishaan Joshi',
    email: 'ishaan@alliance.org',
    phone: '+91 97777 11111',
    company: 'Alliance Group',
    title: 'Director',
    source: LeadSource.Referral,
    status: LeadStatus.Contacted,
    value: 0,
    dateAdded: '2024-05-03T11:20:00Z',
    lastInteraction: '2024-05-04T08:00:00Z',
    notes: [
      {
        id: 'n9_1',
        text: 'Email sent: Partnership opportunities overview.',
        timestamp: '2024-05-04T08:00:00Z',
        author: 'Admin'
      }
    ]
  },
  {
    id: '10',
    name: 'Aditya Mishra',
    email: 'aditya@quantum.io',
    phone: '+91 99999 88888',
    company: 'Quantum Labs',
    title: 'Physicist',
    source: LeadSource.Website,
    status: LeadStatus.New,
    message: 'Looking for data processing capabilities.',
    value: 3000000,
    dateAdded: '2024-05-11T16:00:00Z',
    lastInteraction: '2024-05-11T16:00:00Z',
    notes: [
      {
        id: 'n10_1',
        text: 'Email sent: Automated acknowledgement.',
        timestamp: '2024-05-11T16:05:00Z',
        author: 'System'
      }
    ]
  },
  {
    id: '11',
    name: 'Kavita Iyer',
    email: 'kavita@securenet.io',
    phone: '+91 90222 01999',
    company: 'SecureNet',
    title: 'Security Analyst',
    source: LeadSource.LinkedIn,
    status: LeadStatus.Converted,
    value: 2500000,
    dateAdded: '2024-04-01T09:00:00Z',
    lastInteraction: '2024-04-10T13:30:00Z',
    notes: [
      {
        id: 'n11_1',
        text: 'Email sent: Onboarding credentials.',
        timestamp: '2024-04-10T13:30:00Z',
        author: 'Admin'
      }
    ]
  },
  {
    id: '12',
    name: 'Aryan Nair',
    email: 'aryan@insight.com',
    phone: '+91 90222 01988',
    company: 'Insight Analytics',
    title: 'Data Scientist',
    source: LeadSource.Website,
    status: LeadStatus.Contacted,
    message: 'I want to verify your software accuracy.',
    value: 2500000,
    dateAdded: '2024-04-01T09:05:00Z',
    lastInteraction: '2024-05-01T10:00:00Z',
    notes: [
      {
        id: 'n12_1',
        text: 'Email sent: Case studies and accuracy reports.',
        timestamp: '2024-04-02T11:00:00Z',
        author: 'Admin'
      },
      {
        id: 'n12_2',
        text: 'Email received: Questions about methodology.',
        timestamp: '2024-05-01T09:45:00Z',
        author: 'Admin'
      }
    ]
  },
  {
    id: '13',
    name: 'Karthik Gowda',
    email: 'karthik@bridges.in',
    phone: '+91 95550 00000',
    company: 'Bridges Logistics',
    title: 'Logistics Head',
    source: LeadSource.Other,
    status: LeadStatus.New,
    message: 'Need logistics optimization.',
    value: 4500000,
    dateAdded: '2024-05-12T19:00:00Z',
    lastInteraction: '2024-05-12T19:00:00Z',
    notes: []
  },
  {
    id: '14',
    name: 'Riya Chatterjee',
    email: 'riya@wolfconsulting.com',
    phone: '+91 95556 66777',
    company: 'Wolf Consulting',
    title: 'Consultant',
    source: LeadSource.Referral,
    status: LeadStatus.Lost,
    message: 'Budget constraints.',
    value: 30000,
    dateAdded: '2024-01-20T12:00:00Z',
    lastInteraction: '2024-01-21T09:00:00Z',
    notes: [
      {
        id: 'n14_1',
        text: 'Email sent: Discounted offer for Q1.',
        timestamp: '2024-01-21T09:00:00Z',
        author: 'Admin'
      }
    ]
  },
  {
    id: '15',
    name: 'Sanjay Mehra',
    email: 'sanjay@starenterprise.com',
    phone: '+91 95551 70170',
    company: 'Star Enterprise',
    title: 'Managing Director',
    source: LeadSource.SocialMedia,
    status: LeadStatus.Contacted,
    value: 6000000,
    dateAdded: '2024-05-06T14:00:00Z',
    lastInteraction: '2024-05-07T11:00:00Z',
    notes: [
      {
        id: 'n15_1',
        text: 'Call: Introductory call with Sanjay.',
        timestamp: '2024-05-06T15:00:00Z',
        author: 'Admin'
      },
      {
        id: 'n15_2',
        text: 'Email sent: Meeting summary and next steps.',
        timestamp: '2024-05-07T11:00:00Z',
        author: 'Admin'
      }
    ]
  }
];
