import React, { useMemo, useState } from 'react';
import { useLeads } from '../context/LeadContext';
import { Mail, Phone, MessageSquare, Clock, Search, Send, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '../components/ui/Button';
import { ComposeEmailModal } from '../components/Communications/ComposeEmailModal';

export const Communications: React.FC = () => {
  const { leads } = useLeads();
  const [searchQuery, setSearchQuery] = useState('');
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'email' | 'note'>('all');

  // Aggregate all interactions from leads
  const activities = useMemo(() => {
    const allNotes = leads.flatMap(lead =>
      lead.notes.map(note => ({
        ...note,
        leadId: lead.id,
        leadName: lead.name,
        leadCompany: lead.company,
        leadEmail: lead.email,
        type: note.text.toLowerCase().includes('email') ? 'email' : 'note'
      }))
    );

    // Sort by timestamp descending (newest first)
    return allNotes.sort((a, b) =>
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }, [leads]);

  const filteredActivities = useMemo(() => {
    return activities.filter(activity => {
      const matchesSearch =
        activity.leadName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        activity.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
        activity.leadCompany.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesFilter = filterType === 'all' || activity.type === filterType;

      return matchesSearch && matchesFilter;
    });
  }, [activities, searchQuery, filterType]);

  const getIcon = (text: string) => {
    const lowerText = text.toLowerCase();
    if (lowerText.includes('email')) return <Mail size={16} className="text-blue-500" />;
    if (lowerText.includes('call') || lowerText.includes('phone')) return <Phone size={16} className="text-green-500" />;
    return <FileText size={16} className="text-gray-500" />;
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Communications</h1>
          <p className="text-sm text-gray-500">Track client interactions and send messages.</p>
        </div>
        <Button onClick={() => setIsComposeOpen(true)}>
          <Send size={16} className="mr-2" />
          New Message
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">

        {/* Main Feed Column */}
        <div className="lg:col-span-2 flex flex-col gap-4">

          {/* Search and Filters */}
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={16} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search interactions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 text-gray-900 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setFilterType('all')}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${filterType === 'all'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterType('email')}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${filterType === 'email'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
              >
                Emails
              </button>
              <button
                onClick={() => setFilterType('note')}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${filterType === 'note'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
              >
                Notes
              </button>
            </div>
          </div>

          {/* Activity Timeline */}
          <div className="bg-white shadow-sm rounded-lg border border-gray-200 flex-1 overflow-hidden flex flex-col">
            <div className="p-4 border-b border-gray-200 bg-white">
              <h2 className="font-semibold text-gray-900">Recent Interactions</h2>
            </div>
            <div className="p-0 overflow-y-auto max-h-[600px]">
              {filteredActivities.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <MessageSquare className="mx-auto h-12 w-12 text-gray-300 mb-2" />
                  <p>No interactions found matching your criteria.</p>
                </div>
              ) : (
                <ul className="divide-y divide-gray-100">
                  {filteredActivities.map((activity) => (
                    <li key={`${activity.leadId}-${activity.id}`} className="p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex space-x-3">
                        <div className="flex-shrink-0 mt-1">
                          <div className={`h-8 w-8 rounded-full flex items-center justify-center ${activity.type === 'email' ? 'bg-blue-100' : 'bg-gray-100'
                            }`}>
                            {getIcon(activity.text)}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                            <p className="text-sm font-medium text-gray-900">
                              {activity.leadName}
                              <span className="text-gray-500 font-normal"> • {activity.leadCompany}</span>
                            </p>
                            <span className="text-xs text-gray-500 flex items-center whitespace-nowrap ml-2">
                              <Clock size={12} className="mr-1" />
                              {format(new Date(activity.timestamp), 'MMM d, h:mm a')}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1 line-clamp-3">
                            {activity.text}
                          </p>
                          <div className="mt-2 flex items-center text-xs text-gray-500">
                            <span className="font-medium mr-2">By: {activity.author}</span>
                            {activity.type === 'email' && (
                              <span className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-600 border border-blue-100">
                                Email Sent
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Info (Optional) */}
        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-5">
            <h3 className="text-blue-800 font-semibold mb-2">Communication Tips</h3>
            <ul className="text-sm text-blue-700 space-y-2 list-disc list-inside">
              <li>Respond to new leads within 1 hour for highest conversion.</li>
              <li>Keep emails concise and personalized.</li>
              <li>Log every phone call to maintain a complete history.</li>
            </ul>
          </div>

          <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-5">
            <h3 className="font-semibold text-gray-900 mb-4">Summary Today</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Emails Sent</span>
                <span className="font-bold text-gray-900">
                  {activities.filter(a => a.type === 'email' && new Date(a.timestamp).toDateString() === new Date().toDateString()).length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Notes Added</span>
                <span className="font-bold text-gray-900">
                  {activities.filter(a => a.type === 'note' && new Date(a.timestamp).toDateString() === new Date().toDateString()).length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ComposeEmailModal isOpen={isComposeOpen} onClose={() => setIsComposeOpen(false)} />
    </div>
  );
};