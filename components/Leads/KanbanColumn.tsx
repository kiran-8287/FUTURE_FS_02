import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Lead, LeadStatus } from '../../types';
import { KanbanCard } from './KanbanCard';
import clsx from 'clsx';

interface KanbanColumnProps {
    status: LeadStatus;
    leads: Lead[];
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({ status, leads }) => {
    const { setNodeRef, isOver } = useDroppable({
        id: status,
    });

    const getStatusColor = (s: LeadStatus) => {
        switch (s) {
            case LeadStatus.New: return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300';
            case LeadStatus.Contacted: return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300';
            case LeadStatus.Converted: return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300';
            case LeadStatus.Lost: return 'bg-white border border-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
        }
    };

    return (
        <div className="flex flex-col w-80 shrink-0">
            <div className="flex items-center justify-between mb-4 px-2">
                <div className={clsx("px-3 py-1 rounded-full text-sm font-medium", getStatusColor(status))}>
                    {status}
                </div>
                <span className="text-sm text-gray-500 font-medium">{leads.length}</span>
            </div>

            <div
                ref={setNodeRef}
                className={clsx(
                    "flex-1 bg-white dark:bg-gray-900/50 rounded-xl p-2 border border-dashed border-gray-200 dark:border-gray-800 min-h-[500px] transition-colors",
                    isOver && "bg-blue-50/50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800"
                )}
            >
                <SortableContext items={leads.map(l => l.id)} strategy={verticalListSortingStrategy}>
                    <div className="space-y-3">
                        {leads.map(lead => (
                            <KanbanCard key={lead.id} lead={lead} />
                        ))}
                    </div>
                </SortableContext>
            </div>
        </div>
    );
};
