import React from 'react';
import { formatIndianCurrency } from '../../utils/formatCurrency';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Lead } from '../../types';
import { Building, IndianRupee } from 'lucide-react';
import clsx from 'clsx';

interface KanbanCardProps {
    lead: Lead;
    isOverlay?: boolean;
}

export const KanbanCard: React.FC<KanbanCardProps> = ({ lead, isOverlay }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: lead.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className={clsx(
                "bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing group",
                isDragging && "opacity-50",
                isOverlay && "rotate-2 shadow-xl ring-2 ring-blue-500/50 z-50 !opacity-100"
            )}
        >
            <div className="flex justify-between items-start mb-2">
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-sm line-clamp-1 group-hover:text-blue-600 transition-colors">
                    {lead.name}
                </h4>
                <span className="text-[10px] text-gray-400 font-mono">
                    {new Date(lead.dateAdded).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                </span>
            </div>

            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-3">
                <Building size={12} className="mr-1.5" />
                <span className="truncate">{lead.company}</span>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-gray-50 dark:border-gray-700/50">
                <div className="flex items-center text-xs font-medium text-gray-700 dark:text-gray-300">
                    <IndianRupee size={12} className="mr-1" />
                    {formatIndianCurrency(lead.value || 0, { compact: true })}
                </div>

                <div className="h-6 w-6 rounded-full bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-900 dark:to-slate-800 flex items-center justify-center text-[10px] font-bold text-blue-600 dark:text-blue-300 border border-white dark:border-gray-700 shadow-sm">
                    {lead.name.charAt(0)}
                </div>
            </div>
        </div>
    );
};
