import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Lead, LeadStatus, Note } from '../types';
import { useToast } from './ToastContext';
import { useNotifications } from './NotificationContext';
import { useAuth } from './AuthContext';

const API_URL = 'http://localhost:5001/api';

interface LeadContextType {
  leads: Lead[];
  loading: boolean;
  addLead: (lead: Omit<Lead, 'id' | 'dateAdded' | 'lastInteraction' | 'notes'>) => Promise<void>;
  updateLeadStatus: (id: string, status: LeadStatus) => Promise<void>;
  updateLead: (id: string, updates: Partial<Lead>) => Promise<void>;
  deleteLead: (id: string) => Promise<void>;
  addNote: (leadId: string, noteText: string) => Promise<void>;
  getLeadStats: (leadsToProcess?: Lead[]) => { total: number; new: number; contacted: number; converted: number; lost: number; value: number };
  refreshLeads: () => Promise<void>;
}

const LeadContext = createContext<LeadContextType | undefined>(undefined);

export const LeadProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();
  const { addNotification } = useNotifications();
  const { token } = useAuth();

  // Fetch leads from backend
  const fetchLeads = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/leads`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Failed to fetch leads');

      const data = await response.json();

      // Transform backend data to match frontend Lead type
      const transformedLeads: Lead[] = data.map((lead: any) => ({
        id: lead.id.toString(),
        name: lead.name,
        email: lead.email,
        phone: lead.phone || '',
        company: lead.company || '',
        title: '', // Backend doesn't have title field
        source: lead.source || 'Website',
        status: (lead.status ? lead.status.charAt(0).toUpperCase() + lead.status.slice(1) : 'New') as LeadStatus,
        message: lead.message || '',
        value: Number(lead.value) || 0, // Read value from backend
        dateAdded: lead.created_at,
        lastInteraction: lead.created_at,
        notes: [] // Notes are fetched separately
      }));

      setLeads(transformedLeads);
    } catch (error) {
      console.error('Error fetching leads:', error);
      addToast('Failed to load leads', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Refresh leads
  const refreshLeads = async () => {
    await fetchLeads();
  };

  // Load leads on mount and when token changes
  useEffect(() => {
    if (token) {
      fetchLeads();
    }
  }, [token]);

  // Add new lead
  const addLead = async (newLeadData: Omit<Lead, 'id' | 'dateAdded' | 'lastInteraction' | 'notes'>) => {
    try {
      const response = await fetch(`${API_URL}/leads`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newLeadData.name,
          email: newLeadData.email,
          phone: newLeadData.phone,
          company: newLeadData.company,
          source: newLeadData.source,
          message: newLeadData.message
        })
      });

      if (!response.ok) throw new Error('Failed to add lead');

      const createdLead = await response.json();

      // Transform and add to local state
      const newLead: Lead = {
        id: createdLead.id.toString(),
        name: createdLead.name,
        email: createdLead.email,
        phone: createdLead.phone || '',
        company: createdLead.company || '',
        title: newLeadData.title || '',
        source: createdLead.source,
        status: createdLead.status,
        message: createdLead.message || '',
        value: newLeadData.value || 0,
        dateAdded: createdLead.created_at,
        lastInteraction: createdLead.created_at,
        notes: []
      };

      setLeads((prev) => [newLead, ...prev]);
      addToast('Lead added successfully');

      addNotification({
        title: 'New Lead Added',
        message: `${newLead.name} from ${newLead.company} has been added to the pipeline.`,
        type: 'success'
      });
    } catch (error) {
      console.error('Error adding lead:', error);
      addToast('Failed to add lead', 'error');
    }
  };

  // Update lead status
  const updateLeadStatus = async (id: string, status: LeadStatus) => {
    try {
      const response = await fetch(`${API_URL}/leads/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });

      if (!response.ok) throw new Error('Failed to update lead status');

      const updatedLead = await response.json();

      let leadName = '';
      setLeads((prev) =>
        prev.map((lead) => {
          if (lead.id === id) {
            leadName = lead.name;
            return { ...lead, status, lastInteraction: new Date().toISOString() };
          }
          return lead;
        })
      );

      addToast(`Lead status updated to ${status}`);

      if (status === LeadStatus.Converted) {
        addNotification({
          title: 'Lead Converted!',
          message: `Great job! ${leadName} has been marked as converted.`,
          type: 'success'
        });
      } else if (status === LeadStatus.Lost) {
        addNotification({
          title: 'Lead Lost',
          message: `${leadName} has been marked as lost.`,
          type: 'warning'
        });
      }
    } catch (error) {
      console.error('Error updating lead status:', error);
      addToast('Failed to update lead status', 'error');
    }
  };

  // Update lead details
  const updateLead = async (id: string, updates: Partial<Lead>) => {
    try {
      const response = await fetch(`${API_URL}/leads/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: updates.name,
          email: updates.email,
          phone: updates.phone,
          company: updates.company,
          source: updates.source,
          message: updates.message
        })
      });

      if (!response.ok) throw new Error('Failed to update lead');

      const updatedLead = await response.json();

      setLeads((prev) =>
        prev.map((lead) =>
          lead.id === id ? { ...lead, ...updates, lastInteraction: new Date().toISOString() } : lead
        )
      );

      addToast('Lead updated successfully');
    } catch (error) {
      console.error('Error updating lead:', error);
      addToast('Failed to update lead', 'error');
    }
  };

  // Delete lead
  const deleteLead = async (id: string) => {
    try {
      const response = await fetch(`${API_URL}/leads/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Failed to delete lead');

      setLeads((prev) => prev.filter((lead) => lead.id !== id));
      addToast('Lead deleted', 'info');
    } catch (error) {
      console.error('Error deleting lead:', error);
      addToast('Failed to delete lead', 'error');
    }
  };

  // Add note to lead
  const addNote = async (leadId: string, noteText: string) => {
    try {
      const response = await fetch(`${API_URL}/notes/lead/${leadId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ note_text: noteText })
      });

      if (!response.ok) throw new Error('Failed to add note');

      const createdNote = await response.json();

      const newNote: Note = {
        id: createdNote.id.toString(),
        text: createdNote.note_text,
        timestamp: createdNote.created_at,
        author: 'Admin'
      };

      setLeads((prev) =>
        prev.map((lead) =>
          lead.id === leadId
            ? {
              ...lead,
              lastInteraction: new Date().toISOString(),
              notes: [newNote, ...lead.notes]
            }
            : lead
        )
      );

      addToast('Note added');
    } catch (error) {
      console.error('Error adding note:', error);
      addToast('Failed to add note', 'error');
    }
  };

  // Get lead statistics
  const getLeadStats = (leadsToProcess?: Lead[]) => {
    const targetLeads = leadsToProcess || leads;
    return {
      total: targetLeads.length,
      new: targetLeads.filter((l) => l.status === LeadStatus.New).length,
      contacted: targetLeads.filter((l) => l.status === LeadStatus.Contacted).length,
      converted: targetLeads.filter((l) => l.status === LeadStatus.Converted).length,
      lost: targetLeads.filter((l) => l.status === LeadStatus.Lost).length,
      value: targetLeads.reduce((acc, curr) => acc + (curr.value || 0), 0)
    };
  };

  return (
    <LeadContext.Provider value={{
      leads,
      loading,
      addLead,
      updateLeadStatus,
      updateLead,
      deleteLead,
      addNote,
      getLeadStats,
      refreshLeads
    }}>
      {children}
    </LeadContext.Provider>
  );
};

export const useLeads = () => {
  const context = useContext(LeadContext);
  if (!context) throw new Error('useLeads must be used within a LeadProvider');
  return context;
};