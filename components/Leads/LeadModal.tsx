import React, { useState } from 'react';
import { formatIndianCurrency } from '../../utils/formatCurrency';
import { X, Phone, Mail, Building, Calendar, IndianRupee, Send, Trash2, Clock } from 'lucide-react';
import { Lead, LeadStatus } from '../../types';
import { useLeads } from '../../context/LeadContext';
import { Button } from '../ui/Button';
import { format } from 'date-fns';

interface LeadModalProps {
  lead: Lead | null;
  isOpen: boolean;
  onClose: () => void;
}

export const LeadModal: React.FC<LeadModalProps> = ({ lead: initialLead, isOpen, onClose }) => {
  const { leads, updateLeadStatus, deleteLead, addNote } = useLeads();
  const [noteText, setNoteText] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Retrieve the latest lead data from context to ensure reactivity (e.g., when adding notes)
  // Fallback to initialLead if not found (e.g. right before deletion completes)
  const lead = leads.find(l => l.id === initialLead?.id) || initialLead;

  if (!isOpen || !lead) return null;

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateLeadStatus(lead.id, e.target.value as LeadStatus);
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (noteText.trim()) {
      addNote(lead.id, noteText);
      setNoteText('');
    }
  };

  const handleDelete = () => {
    deleteLead(lead.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={onClose}></div>
        </div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          {/* Header */}
          <div className="bg-white border-b border-gray-200 px-4 py-5 sm:px-6 flex justify-between items-start">
            <div className="flex items-start space-x-4">
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg">
                {lead.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-xl leading-6 font-bold text-gray-900">{lead.name}</h3>
                <p className="text-sm text-gray-500">{lead.title} at {lead.company}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <select
                value={lead.status}
                onChange={handleStatusChange}
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                {Object.values(LeadStatus).map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
                <X size={24} />
              </button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row h-[600px] overflow-hidden">
            {/* Left Column: Details */}
            <div className="w-full md:w-1/3 border-r border-gray-200 bg-gray-50 p-6 overflow-y-auto">
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Contact Details</h4>

              <div className="space-y-4">
                <div className="flex items-center text-sm">
                  <Mail className="text-gray-400 w-5 h-5 mr-3" />
                  <a href={`mailto:${lead.email}`} className="text-blue-600 hover:underline">{lead.email}</a>
                </div>
                <div className="flex items-center text-sm">
                  <Phone className="text-gray-400 w-5 h-5 mr-3" />
                  <span className="text-gray-900">{lead.phone}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Building className="text-gray-400 w-5 h-5 mr-3" />
                  <span className="text-gray-900">{lead.company}</span>
                </div>
                <div className="flex items-center text-sm">
                  <IndianRupee className="text-gray-400 w-5 h-5 mr-3" />
                  <span className="text-gray-900 dark:text-white font-medium">{formatIndianCurrency(lead.value || 0)}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Calendar className="text-gray-400 w-5 h-5 mr-3" />
                  <span className="text-gray-600">Added {format(new Date(lead.dateAdded), 'MMM d, yyyy')}</span>
                </div>
              </div>

              <div className="mt-8">
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Message</h4>
                <div className="bg-white p-3 rounded-md border border-gray-200 text-sm text-gray-600 italic">
                  "{lead.message || 'No initial message provided.'}"
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200">
                {!showDeleteConfirm ? (
                  <Button variant="outline" className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200" onClick={() => setShowDeleteConfirm(true)}>
                    <Trash2 size={16} className="mr-2" />
                    Delete Lead
                  </Button>
                ) : (
                  <div className="text-center bg-red-50 p-3 rounded-lg border border-red-100">
                    <p className="text-sm text-red-800 mb-2">Are you sure? This cannot be undone.</p>
                    <div className="flex space-x-2 justify-center">
                      <Button size="sm" variant="danger" onClick={handleDelete}>Confirm</Button>
                      <Button size="sm" variant="secondary" onClick={() => setShowDeleteConfirm(false)}>Cancel</Button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Timeline & Notes */}
            <div className="w-full md:w-2/3 bg-white flex flex-col h-full">
              <div className="p-4 bg-gray-50 border-b border-gray-200">
                <h4 className="text-sm font-medium text-gray-900">Activity Timeline & Notes</h4>
              </div>

              <div className="flex-1 p-6 overflow-y-auto space-y-6">
                {/* Notes List */}
                {lead.notes.length === 0 ? (
                  <div className="text-center py-10 text-gray-500 text-sm">
                    <Clock className="mx-auto h-8 w-8 text-gray-300 mb-2" />
                    No notes yet. Add one below to track interactions.
                  </div>
                ) : (
                  lead.notes.map((note) => (
                    <div key={note.id} className="relative pl-6 pb-2">
                      {/* Timeline line */}
                      <div className="absolute top-0 left-0 h-full w-px bg-gray-200 ml-1"></div>
                      <div className="absolute top-1 left-0 h-2.5 w-2.5 rounded-full bg-blue-400 border-2 border-white ml-[1px]"></div>

                      <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs font-semibold text-gray-700">{note.author}</span>
                          <span className="text-xs text-gray-400">{format(new Date(note.timestamp), 'MMM d, h:mm a')}</span>
                        </div>
                        <p className="text-sm text-gray-600">{note.text}</p>
                      </div>
                    </div>
                  ))
                )}

                {/* Lead Created Event */}
                <div className="relative pl-6">
                  <div className="absolute top-1 left-0 h-2.5 w-2.5 rounded-full bg-gray-300 border-2 border-white ml-[1px]"></div>
                  <div className="text-sm text-gray-500">
                    Lead created on <span className="font-medium text-gray-700">{format(new Date(lead.dateAdded), 'MMMM d, yyyy')}</span> from <span className="font-medium">{lead.source}</span>
                  </div>
                </div>
              </div>

              {/* Add Note Input */}
              <div className="p-4 border-t border-gray-200 bg-gray-50">
                <form onSubmit={handleAddNote} className="flex gap-2">
                  <input
                    type="text"
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    placeholder="Add a note or interaction detail..."
                    className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                  />
                  <Button type="submit" disabled={!noteText.trim()}>
                    <Send size={16} className="mr-2" />
                    Add
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};