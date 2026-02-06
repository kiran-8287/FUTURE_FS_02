import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Plus, X, Filter, ChevronDown, Check } from 'lucide-react';
import { LeadStatus, LeadSource } from '../../types';

export type FilterOperator = 'equals' | 'contains' | 'gt' | 'lt';

export interface FilterRule {
    id: string;
    field: string;
    operator: FilterOperator;
    value: string;
}

interface FilterBuilderProps {
    filters: FilterRule[];
    onChange: (filters: FilterRule[]) => void;
}

const FIELD_OPTIONS = [
    { label: 'Status', value: 'status', type: 'select', options: Object.values(LeadStatus) },
    { label: 'Source', value: 'source', type: 'select', options: Object.values(LeadSource) },
    { label: 'Value', value: 'value', type: 'number' },
    { label: 'Company', value: 'company', type: 'text' },
    { label: 'Name', value: 'name', type: 'text' },
];

const OPERATOR_OPTIONS: Record<string, { label: string; value: FilterOperator }[]> = {
    text: [
        { label: 'Contains', value: 'contains' },
        { label: 'Equals', value: 'equals' },
    ],
    select: [
        { label: 'Is', value: 'equals' },
    ],
    number: [
        { label: 'Greater Than', value: 'gt' },
        { label: 'Less Than', value: 'lt' },
        { label: 'Equals', value: 'equals' },
    ],
};

export const FilterBuilder: React.FC<FilterBuilderProps> = ({ filters, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);

    const addFilter = () => {
        const newFilter: FilterRule = {
            id: Math.random().toString(36).substr(2, 9),
            field: 'status',
            operator: 'equals',
            value: 'New'
        };
        onChange([...filters, newFilter]);
        if (!isOpen) setIsOpen(true);
    };

    const removeFilter = (id: string) => {
        onChange(filters.filter(f => f.id !== id));
    };

    const updateFilter = (id: string, updates: Partial<FilterRule>) => {
        onChange(filters.map(f => {
            if (f.id !== id) return f;

            const updated = { ...f, ...updates };

            // Reset operator/value if field changes to different type
            if (updates.field) {
                const fieldConfig = FIELD_OPTIONS.find(opt => opt.value === updates.field);
                const prevFieldConfig = FIELD_OPTIONS.find(opt => opt.value === f.field);

                if (fieldConfig?.type !== prevFieldConfig?.type) {
                    // Set default operator
                    const ops = OPERATOR_OPTIONS[fieldConfig?.type || 'text'];
                    updated.operator = ops[0].value;
                    updated.value = '';

                    if (fieldConfig?.type === 'select' && fieldConfig.options) {
                        updated.value = fieldConfig.options[0];
                    }
                }
            }
            return updated;
        }));
    };

    return (
        <div className="relative">
            <Button
                variant={filters.length > 0 ? 'primary' : 'secondary'}
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center"
            >
                <Filter size={16} className="mr-2" />
                Filters
                {filters.length > 0 && (
                    <span className="ml-2 bg-white/20 px-1.5 py-0.5 rounded text-xs font-bold">
                        {filters.length}
                    </span>
                )}
            </Button>

            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-10"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="absolute top-full right-0 mt-2 w-full sm:w-[500px] bg-white rounded-xl shadow-xl border border-gray-200 z-20 overflow-hidden animate-in fade-in slide-in-from-top-2">
                        <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                            <h3 className="font-semibold text-gray-900">Filter Leads</h3>
                            <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-gray-700">
                                <X size={16} />
                            </button>
                        </div>

                        <div className="p-4 space-y-4 max-h-[60vh] overflow-y-auto">
                            {filters.length === 0 ? (
                                <div className="text-center py-8 text-gray-500 text-sm">
                                    No active filters. Click "Add Filter" to create one.
                                </div>
                            ) : (
                                filters.map((filter) => {
                                    const fieldConfig = FIELD_OPTIONS.find(opt => opt.value === filter.field);
                                    const operators = OPERATOR_OPTIONS[fieldConfig?.type || 'text'];

                                    return (
                                        <div key={filter.id} className="flex flex-col sm:flex-row gap-2 items-start sm:items-center bg-gray-50 p-3 rounded-lg border border-gray-200">
                                            <select
                                                className="block w-full sm:w-1/3 px-3 py-2 bg-white border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                                                value={filter.field}
                                                onChange={(e) => updateFilter(filter.id, { field: e.target.value })}
                                            >
                                                {FIELD_OPTIONS.map(opt => (
                                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                                ))}
                                            </select>

                                            <select
                                                className="block w-full sm:w-1/3 px-3 py-2 bg-white border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                                                value={filter.operator}
                                                onChange={(e) => updateFilter(filter.id, { operator: e.target.value as FilterOperator })}
                                            >
                                                {operators.map(opt => (
                                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                                ))}
                                            </select>

                                            <div className="flex-1 w-full sm:w-auto min-w-0">
                                                {fieldConfig?.type === 'select' ? (
                                                    <select
                                                        className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                                                        value={filter.value}
                                                        onChange={(e) => updateFilter(filter.id, { value: e.target.value })}
                                                    >
                                                        {fieldConfig.options?.map(opt => (
                                                            <option key={opt} value={opt}>{opt}</option>
                                                        ))}
                                                    </select>
                                                ) : fieldConfig?.type === 'number' ? (
                                                    <input
                                                        type="number"
                                                        className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                                                        value={filter.value}
                                                        onChange={(e) => updateFilter(filter.id, { value: e.target.value })}
                                                        placeholder="Value..."
                                                    />
                                                ) : (
                                                    <input
                                                        type="text"
                                                        className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                                                        value={filter.value}
                                                        onChange={(e) => updateFilter(filter.id, { value: e.target.value })}
                                                        placeholder="Value..."
                                                    />
                                                )}
                                            </div>

                                            <button
                                                onClick={() => removeFilter(filter.id)}
                                                className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                                title="Remove filter"
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    );
                                })
                            )}
                        </div>

                        <div className="p-4 bg-gray-50 border-t border-gray-200">
                            <Button onClick={addFilter} variant="outline" className="w-full border-dashed border-gray-300 hover:border-gray-400 text-gray-600">
                                <Plus size={16} className="mr-2" />
                                Add Filter
                            </Button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};
