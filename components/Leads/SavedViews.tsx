import React, { useState, useEffect } from 'react';
import { Button } from '../ui/Button';
import { Bookmark, Save, Trash2, X, Check } from 'lucide-react';
import { FilterRule } from './FilterBuilder';
import { useToast } from '../../context/ToastContext';

interface SavedView {
    id: string;
    name: string;
    filters: FilterRule[];
}

interface SavedViewsProps {
    currentFilters: FilterRule[];
    onLoadFilters: (filters: FilterRule[]) => void;
}

export const SavedViews: React.FC<SavedViewsProps> = ({ currentFilters, onLoadFilters }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [showSaveInput, setShowSaveInput] = useState(false);
    const [newViewName, setNewViewName] = useState('');
    const [savedViews, setSavedViews] = useState<SavedView[]>([]);
    const { addToast } = useToast();

    useEffect(() => {
        const stored = localStorage.getItem('lumina_saved_views');
        if (stored) {
            try {
                setSavedViews(JSON.parse(stored));
            } catch (e) {
                console.error('Failed to parse saved views');
            }
        }
    }, []);

    const saveViewsToStorage = (views: SavedView[]) => {
        localStorage.setItem('lumina_saved_views', JSON.stringify(views));
        setSavedViews(views);
    };

    const handleSave = () => {
        if (!newViewName.trim()) return;

        const newView: SavedView = {
            id: Math.random().toString(36).substr(2, 9),
            name: newViewName.trim(),
            filters: currentFilters
        };

        const updatedViews = [...savedViews, newView];
        saveViewsToStorage(updatedViews);
        addToast('View saved successfully');
        setNewViewName('');
        setShowSaveInput(false);
    };

    const handleDelete = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        const updatedViews = savedViews.filter(v => v.id !== id);
        saveViewsToStorage(updatedViews);
        addToast('View deleted');
    };

    const handleLoad = (view: SavedView) => {
        onLoadFilters(view.filters);
        setIsOpen(false);
        addToast(`Loaded view: ${view.name}`);
    };

    return (
        <div className="relative">
            <Button
                variant="secondary"
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center"
            >
                <Bookmark size={16} className="mr-2" />
                Saved Views
            </Button>

            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-10"
                        onClick={() => {
                            setIsOpen(false);
                            setShowSaveInput(false);
                        }}
                    />
                    <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-200 z-20 overflow-hidden animate-in fade-in slide-in-from-top-2">

                        {/* Header / Save Action */}
                        <div className="p-3 border-b border-gray-100 bg-gray-50">
                            {!showSaveInput ? (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="w-full justify-center text-blue-600 border-blue-200 hover:bg-blue-50"
                                    onClick={() => setShowSaveInput(true)}
                                    disabled={currentFilters.length === 0}
                                >
                                    <Save size={14} className="mr-2" />
                                    Save Current View
                                </Button>
                            ) : (
                                <div className="space-y-2">
                                    <input
                                        type="text"
                                        autoFocus
                                        placeholder="View Name..."
                                        className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:border-blue-500 focus:outline-none"
                                        value={newViewName}
                                        onChange={(e) => setNewViewName(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                                    />
                                    <div className="flex gap-2">
                                        <Button size="sm" className="flex-1" onClick={handleSave}>Save</Button>
                                        <Button size="sm" variant="secondary" onClick={() => setShowSaveInput(false)}>Cancel</Button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* List */}
                        <div className="max-h-60 overflow-y-auto py-1">
                            {savedViews.length === 0 ? (
                                <div className="px-4 py-3 text-sm text-gray-500 text-center">
                                    No saved views yet.
                                </div>
                            ) : (
                                savedViews.map(view => (
                                    <div
                                        key={view.id}
                                        className="px-3 py-2 hover:bg-gray-50 cursor-pointer flex items-center justify-between group"
                                        onClick={() => handleLoad(view)}
                                    >
                                        <span className="text-sm text-gray-700 truncate font-medium">{view.name}</span>
                                        <button
                                            onClick={(e) => handleDelete(view.id, e)}
                                            className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all p-1"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};
