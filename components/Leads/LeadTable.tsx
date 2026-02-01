import React from 'react';
import { Lead } from '../../types';
import { Badge } from '../ui/Badge';
import { MoreHorizontal, Phone, Mail, Calendar } from 'lucide-react';
import { format } from 'date-fns';

interface LeadTableProps {
  leads: Lead[];
  onLeadClick: (lead: Lead) => void;
}

export const LeadTable: React.FC<LeadTableProps> = ({ leads, onLeadClick }) => {
  if (leads.length === 0) {
    return (
      <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="mx-auto h-12 w-12 text-gray-400">
          <UsersIcon />
        </div>
        <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">No leads found</h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Get started by creating a new lead.</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-white dark:bg-gray-900/50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Name / Company
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden sm:table-cell">
                Contact Info
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden md:table-cell">
                Source
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden lg:table-cell">
                Added
              </th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Edit</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {leads.map((lead) => (
              <tr
                key={lead.id}
                className="hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-colors cursor-pointer group"
                onClick={() => onLeadClick(lead)}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-sm">
                      {lead.name.charAt(0)}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {lead.name}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{lead.company}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <Mail size={14} className="mr-2 text-gray-400" />
                      {lead.email}
                    </div>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <Phone size={14} className="mr-2 text-gray-400" />
                      {lead.phone}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                  <span className="text-sm text-gray-600 dark:text-gray-300">{lead.source}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge status={lead.status} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 hidden lg:table-cell">
                  <div className="flex items-center">
                    <Calendar size={14} className="mr-2 text-gray-400" />
                    {format(new Date(lead.dateAdded), 'MMM d, yyyy')}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button className="text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    <MoreHorizontal size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Helper component for empty state
const UsersIcon = () => (
  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);
