import React, { useState, useMemo, useEffect } from 'react';
import { useLeads } from '../context/LeadContext';
import { useToast } from '../context/ToastContext';
import { LeadTable } from '../components/Leads/LeadTable';
import { LeadModal } from '../components/Leads/LeadModal';
import { AddLeadModal } from '../components/Leads/AddLeadModal';
import { Button } from '../components/ui/Button';
import { Plus, Filter, Download, Upload, ChevronLeft, ChevronRight, X, Search, ChevronDown, Layers } from 'lucide-react';
import { Lead, LeadStatus, LeadSource } from '../types';
import { useSearchParams } from 'react-router-dom';
import { KanbanBoard } from '../components/Leads/KanbanBoard';
import { LayoutGrid, List as ListIcon } from 'lucide-react';
import { FilterBuilder, FilterRule } from '../components/Leads/FilterBuilder';
import { SavedViews } from '../components/Leads/SavedViews';
import { ImportLeadsModal } from '../components/Leads/ImportLeadsModal';

export const Leads: React.FC = () => {
  const { leads, updateLeadStatus, deleteLead, addLead } = useLeads();
  const { addToast } = useToast();
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter States
  // const [statusFilter, setStatusFilter] = useState<string>('All');
  const [searchParams, setSearchParams] = useSearchParams();
  // const [sourceFilter, setSourceFilter] = useState<string>(searchParams.get('source') || 'All');
  const [filters, setFilters] = useState<FilterRule[]>([]);

  // Initialize filters from URL params if present (legacy support optional)
  useEffect(() => {
    const source = searchParams.get('source');
    if (source && source !== 'All') {
      if (!filters.some(f => f.field === 'source')) {
        setFilters(prev => [...prev, { id: 'init-source', field: 'source', operator: 'equals', value: source }]);
      }
    }
  }, [searchParams]);

  // View State
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list');

  // Search State
  // Search State
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
  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters, searchQuery]);

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
      // Search Filter
      const matchesSearch =
        lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.company.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      // Advanced Filters
      if (filters.length === 0) return true;

      return filters.every(filter => {
        const itemValue = (lead as any)[filter.field]; // Simple access, might need refinement for nested/types

        if (filter.operator === 'equals') {
          return String(itemValue).toLowerCase() === String(filter.value).toLowerCase();
        }
        if (filter.operator === 'contains') {
          return String(itemValue).toLowerCase().includes(String(filter.value).toLowerCase());
        }
        if (filter.operator === 'gt') {
          return Number(itemValue) > Number(filter.value);
        }
        if (filter.operator === 'lt') {
          return Number(itemValue) < Number(filter.value);
        }
        return true;
      });
    });
  }, [leads, filters, searchQuery]);

  // Pagination Logic
  const totalPages = Math.max(1, Math.ceil(filteredLeads.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedLeads = filteredLeads.slice(startIndex, startIndex + itemsPerPage);
  const endIndex = Math.min(startIndex + itemsPerPage, filteredLeads.length);


  // Bulk Selection State
  const [selectedLeadIds, setSelectedLeadIds] = useState<Set<string>>(new Set());

  const handleToggleSelect = (id: string) => {
    const newSelected = new Set(selectedLeadIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedLeadIds(newSelected);
  };

  const handleToggleAll = (checked: boolean) => {
    if (checked) {
      const allIds = filteredLeads.map(l => l.id);
      setSelectedLeadIds(new Set(allIds));
    } else {
      setSelectedLeadIds(new Set());
    }
  };

  const handleBulkStatusUpdate = (status: LeadStatus) => {
    selectedLeadIds.forEach(id => updateLeadStatus(id, status));
    addToast(`Updated ${selectedLeadIds.size} leads to ${status}`);
    setSelectedLeadIds(new Set());
  };

  const handleBulkDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${selectedLeadIds.size} leads?`)) {
      const deletedLeadIds = Array.from(selectedLeadIds);
      const deletedLeads = leads.filter(l => deletedLeadIds.includes(l.id));

      // Delete the leads
      const deletePromises = deletedLeadIds.map(id => deleteLead(id));
      await Promise.all(deletePromises);

      // Show toast with undo action
      addToast(
        `Deleted ${deletedLeadIds.length} lead${deletedLeadIds.length > 1 ? 's' : ''}`,
        'success',
        {
          label: 'Undo',
          callback: () => {
            // Restore deleted leads
            deletedLeads.forEach(lead => {
              addLead(lead);
            });
            addToast('Leads restored', 'info');
          }
        }
      );

      setSelectedLeadIds(new Set());
    }
  };

  return (
    <div className="space-y-6 relative">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Leads</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Manage and track your potential clients.</p>
        </div>
        <div className="flex gap-2">
          {/* ... existing buttons ... */}
          <div className="flex bg-white dark:bg-gray-800 p-1 rounded-lg mr-2 border border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-white dark:bg-gray-700 shadow text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
              title="List View"
            >
              <ListIcon size={18} />
            </button>
            <button
              onClick={() => setViewMode('kanban')}
              className={`p-1.5 rounded-md transition-all ${viewMode === 'kanban' ? 'bg-white dark:bg-gray-700 shadow text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
              title="Kanban View"
            >
              <LayoutGrid size={18} />
            </button>
          </div>
          <Button variant="secondary" size="md" onClick={() => setIsImportModalOpen(true)} className="mr-2">
            <Upload size={16} className="mr-2" />
            Import
          </Button>
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

      {/* Bulk Action Bar */}
      {selectedLeadIds.size > 0 && (
        <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between bg-blue-600 text-white p-4 rounded-lg shadow-lg animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center space-x-4">
            <span className="font-semibold">{selectedLeadIds.size} Selected</span>
            <div className="h-4 w-px bg-blue-400"></div>
            <button onClick={() => setSelectedLeadIds(new Set())} className="text-sm hover:text-blue-100">
              Cancel
            </button>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleBulkDelete}
              className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-xs font-medium transition-colors border border-red-500 mr-2"
            >
              Delete
            </button>
            <span className="text-sm mr-2 pl-2 border-l border-blue-500">Mark as:</span>
            {Object.values(LeadStatus).map(status => (
              <button
                key={status}
                onClick={() => handleBulkStatusUpdate(status)}
                className="px-3 py-1 bg-blue-700 hover:bg-blue-500 rounded text-xs font-medium transition-colors border border-blue-500"
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Filters & Search Bar */}
      {/* ... (keep existing) ... */}
      <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col lg:flex-row gap-4 lg:items-center justify-between">
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
            className="block w-full pl-10 pr-10 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:bg-white dark:focus:bg-gray-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 sm:text-sm"
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
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          <SavedViews currentFilters={filters} onLoadFilters={setFilters} />
          <FilterBuilder filters={filters} onChange={setFilters} />
        </div>
      </div>

      {/* Lead Content */}
      <div className="space-y-4">
        {viewMode === 'list' ? (
          <LeadTable
            leads={paginatedLeads}
            onLeadClick={handleLeadClick}
            selectedIds={Array.from(selectedLeadIds)}
            onToggleSelect={handleToggleSelect}
            onToggleAll={handleToggleAll}
          />
        ) : (
          <div className="h-[calc(100vh-280px)] overflow-hidden">
            <KanbanBoard
              leads={filteredLeads}
              onStatusChange={(id, status) => {
                updateLeadStatus(id, status);
              }}
            />
          </div>
        )}


        {/* Pagination Controls */}
        {filteredLeads.length > 0 && (
          <div className="flex items-center justify-between bg-white dark:bg-gray-800 px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm sm:px-6">
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Showing <span className="font-medium">{startIndex + 1}</span> to <span className="font-medium">{endIndex}</span> of{' '}
                  <span className="font-medium">{filteredLeads.length}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium ${currentPage === 1 ? 'text-gray-300 dark:text-gray-500 cursor-not-allowed' : 'text-gray-500 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-600'}`}
                  >
                    <span className="sr-only">Previous</span>
                    <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                  </button>
                  <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium ${currentPage === totalPages ? 'text-gray-300 dark:text-gray-500 cursor-not-allowed' : 'text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'}`}
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
      <ImportLeadsModal isOpen={isImportModalOpen} onClose={() => setIsImportModalOpen(false)} />

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