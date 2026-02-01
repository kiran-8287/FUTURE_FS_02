import React, { useState, useMemo, useEffect } from 'react';
import { useLeads } from '../context/LeadContext';
import { useToast } from '../context/ToastContext';
import { LeadTable } from '../components/Leads/LeadTable';
import { LeadModal } from '../components/Leads/LeadModal';
import { AddLeadModal } from '../components/Leads/AddLeadModal';
import { Button } from '../components/ui/Button';
import { Plus, Filter, Download, ChevronLeft, ChevronRight, X, Search, ChevronDown, Layers } from 'lucide-react';
import { Lead, LeadStatus, LeadSource } from '../types';
import { useSearchParams } from 'react-router-dom';
import { KanbanBoard } from '../components/Leads/KanbanBoard';
import { LayoutGrid, List as ListIcon } from 'lucide-react';

export const Leads: React.FC = () => {
  const { leads, updateLeadStatus } = useLeads();
  const { addToast } = useToast();
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter States
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [sourceFilter, setSourceFilter] = useState<string>('All');

  // View State
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list');

  // Search State
  const [searchParams, setSearchParams] = useSearchParams();
  const queryFromUrl = searchParams.get('q') || '';
  const [searchQuery, setSearchQuery] = useState(queryFromUrl);

  // Sync local state when URL changes (e.g. navigation from Navbar)
  useEffect(() => {
    setSearchQuery(queryFromUrl);
  }, [queryFromUrl]);

  // Debounce URL update when search query changes
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchParams(prev => {
        const newParams = new URLSearchParams(prev);
        if (searchQuery) {
          newParams.set('q', searchQuery);
        } else {
          newParams.delete('q');
        }
        // Avoid unnecessary updates if params haven't effectively changed
        if (newParams.toString() !== prev.toString()) {
          return newParams;
        }
        return prev;
      }, { replace: true });
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, setSearchParams]);

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, sourceFilter, searchQuery]);

  const handleLeadClick = (lead: Lead) => {
    setSelectedLead(lead);
    setIsDetailModalOpen(true);
  };

  const handleExport = () => {
    if (leads.length === 0) {
      addToast('No leads to export', 'error');
      return;
    }

    try {
      // Define headers
      const headers = ['ID,Name,Email,Phone,Company,Title,Source,Status,Value,Date Added'];

      // Map data to CSV rows
      const csvContent = leads.map(lead => {
        // Handle potential commas in strings by wrapping in quotes
        const safe = (str: string | undefined) => `"${(str || '').replace(/"/g, '""')}"`;

        return [
          lead.id,
          safe(lead.name),
          safe(lead.email),
          safe(lead.phone),
          safe(lead.company),
          safe(lead.title),
          lead.source,
          lead.status,
          lead.value || 0,
          lead.dateAdded
        ].join(',');
      });

      // Combine headers and data
      const csvString = [headers, ...csvContent].join('\n');

      // Create a blob and download link
      const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);

      link.setAttribute('href', url);
      link.setAttribute('download', `leads_export_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      addToast('Leads exported successfully');
    } catch (error) {
      console.error('Export failed', error);
      addToast('Failed to export leads', 'error');
    }
  };

  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const matchesStatus = statusFilter === 'All' || lead.status === statusFilter;
      const matchesSource = sourceFilter === 'All' || lead.source === sourceFilter;
      const matchesSearch =
        lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.company.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesStatus && matchesSource && matchesSearch;
    });
  }, [leads, statusFilter, sourceFilter, searchQuery]);

  // Pagination Logic
  const totalPages = Math.max(1, Math.ceil(filteredLeads.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedLeads = filteredLeads.slice(startIndex, startIndex + itemsPerPage);
  const endIndex = Math.min(startIndex + itemsPerPage, filteredLeads.length);

  return (
    <div className="space-y-6">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Leads</h1>
          <p className="text-sm text-gray-500">Manage and track your potential clients.</p>
        </div>
        <div className="flex gap-2">
          <div className="flex bg-white p-1 rounded-lg mr-2 border border-gray-200">
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              title="List View"
            >
              <ListIcon size={18} />
            </button>
            <button
              onClick={() => setViewMode('kanban')}
              className={`p-1.5 rounded-md transition-all ${viewMode === 'kanban' ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              title="Kanban View"
            >
              <LayoutGrid size={18} />
            </button>
          </div>
          <Button variant="secondary" size="md" onClick={handleExport}>
            <Download size={16} className="mr-2" />
            Export
          </Button>
          <Button onClick={() => setIsAddModalOpen(true)}>
            <Plus size={18} className="mr-2" />
            Add Lead
          </Button>
        </div>
      </div>

      {/* Filters & Search Bar */}
      <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 flex flex-col lg:flex-row gap-4 lg:items-center justify-between">

        {/* Search */}
        <div className="relative w-full lg:max-w-md group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400 group-focus-within:text-blue-500 transition-colors" />
          </div>
          <input
            type="text"
            placeholder="Search leads by name, email, or company..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-lg leading-5 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 sm:text-sm"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
              title="Clear search"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">

          {/* Status Filter */}
          <div className="relative w-full sm:w-48 group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Filter size={16} className="text-gray-400 group-focus-within:text-blue-500 transition-colors" />
            </div>
            <select
              className="block w-full pl-10 pr-10 py-2.5 text-base border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 sm:text-sm rounded-lg bg-white hover:bg-white focus:bg-white transition-all appearance-none cursor-pointer text-gray-700 font-medium"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Status</option>
              {Object.values(LeadStatus).map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
              <ChevronDown size={16} />
            </div>
          </div>

          {/* Source Filter */}
          <div className="relative w-full sm:w-48 group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Layers size={16} className="text-gray-400 group-focus-within:text-blue-500 transition-colors" />
            </div>
            <select
              className="block w-full pl-10 pr-10 py-2.5 text-base border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 sm:text-sm rounded-lg bg-gray-50 hover:bg-white focus:bg-white transition-all appearance-none cursor-pointer text-gray-700 font-medium"
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
            >
              <option value="All">All Sources</option>
              {Object.values(LeadSource).map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
              <ChevronDown size={16} />
            </div>
          </div>
        </div>
      </div>

      {/* Lead Content */}
      <div className="space-y-4">
        {viewMode === 'list' ? (
          <LeadTable leads={paginatedLeads} onLeadClick={handleLeadClick} />
        ) : (
          <div className="h-[calc(100vh-280px)] overflow-hidden">
            <KanbanBoard
              leads={filteredLeads}
              onStatusChange={(id, status) => {
                // Optimistic UI update could happen here, but context handles it
                const { updateLeadStatus } = useLeads(); // Accessing context inside render is fine, but cleaner to lift useLeads
                updateLeadStatus(id, status);
              }}
            />
          </div>
        )}

        {/* Pagination Controls */}
        {filteredLeads.length > 0 && (
          <div className="flex items-center justify-between bg-white px-4 py-3 rounded-lg border border-gray-200 shadow-sm sm:px-6">
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{startIndex + 1}</span> to <span className="font-medium">{endIndex}</span> of{' '}
                  <span className="font-medium">{filteredLeads.length}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-blue-50'}`}
                  >
                    <span className="sr-only">Previous</span>
                    <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                  </button>
                  <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'}`}
                  >
                    <span className="sr-only">Next</span>
                    <ChevronRight className="h-5 w-5" aria-hidden="true" />
                  </button>
                </nav>
              </div>
            </div>

            {/* Mobile View Pagination */}
            <div className="flex items-center justify-between sm:hidden w-full">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${currentPage === 1 ? 'text-gray-300 bg-gray-50 cursor-not-allowed' : 'text-gray-700 bg-white hover:bg-gray-50'}`}
              >
                Previous
              </button>
              <span className="text-sm text-gray-700">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${currentPage === totalPages ? 'text-gray-300 bg-gray-50 cursor-not-allowed' : 'text-gray-700 bg-white hover:bg-gray-50'}`}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <AddLeadModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />

      <LeadModal
        lead={selectedLead}
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedLead(null);
        }}
      />
    </div>
  );
};