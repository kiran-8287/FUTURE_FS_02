import React, { useMemo } from 'react';
import {
    DndContext,
    DragOverlay,
    closestCorners,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragStartEvent,
    DragOverEvent,
    DragEndEvent
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { Lead, LeadStatus } from '../../types';
import { KanbanColumn } from './KanbanColumn';
import { KanbanCard } from './KanbanCard';

interface KanbanBoardProps {
    leads: Lead[];
    onStatusChange: (leadId: string, newStatus: LeadStatus) => void;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({ leads, onStatusChange }) => {
    const [activeId, setActiveId] = React.useState<string | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const columns = useMemo(() => {
        const cols: Record<LeadStatus, Lead[]> = {
            [LeadStatus.New]: [],
            [LeadStatus.Contacted]: [],
            [LeadStatus.Converted]: [],
            [LeadStatus.Lost]: []
        };

        leads.forEach(lead => {
            if (cols[lead.status]) {
                cols[lead.status].push(lead);
            }
        });
        return cols;
    }, [leads]);

    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id as string);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (!over) {
            setActiveId(null);
            return;
        }

        const activeLeadId = active.id as string;
        const overContainerId = over.id as string; // This will return the status string from the Column container

        // Check if dropped on a column
        if (Object.values(LeadStatus).includes(overContainerId as LeadStatus)) {
            // Find the lead to check if status actually changed
            const lead = leads.find(l => l.id === activeLeadId);
            if (lead && lead.status !== overContainerId) {
                onStatusChange(activeLeadId, overContainerId as LeadStatus);
            }
        }

        setActiveId(null);
    };

    const activeLead = activeId ? leads.find(l => l.id === activeId) : null;

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            <div className="flex h-full overflow-x-auto gap-6 pb-4">
                {Object.values(LeadStatus).map(status => (
                    <KanbanColumn
                        key={status}
                        status={status}
                        leads={columns[status]}
                    />
                ))}
            </div>
            <DragOverlay>
                {activeLead ? <KanbanCard lead={activeLead} isOverlay /> : null}
            </DragOverlay>
        </DndContext>
    );
};
