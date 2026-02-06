import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowRight, Home, Users, BarChart3, Settings, Mail, Plus, Moon, Sun, Monitor } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface Command {
    id: string;
    label: string;
    icon: React.ReactNode;
    action: () => void;
    keywords?: string[];
}

export const CommandPalette: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const navigate = useNavigate();
    const { setTheme } = useTheme();
    const inputRef = useRef<HTMLInputElement>(null);

    const commands: Command[] = [
        {
            id: 'nav-dashboard',
            label: 'Go to Dashboard',
            icon: <Home size={18} />,
            action: () => { navigate('/'); setIsOpen(false); },
            keywords: ['home', 'dashboard', 'overview']
        },
        {
            id: 'nav-leads',
            label: 'Go to Leads',
            icon: <Users size={18} />,
            action: () => { navigate('/leads'); setIsOpen(false); },
            keywords: ['leads', 'contacts', 'customers']
        },
        {
            id: 'nav-analytics',
            label: 'Go to Analytics',
            icon: <BarChart3 size={18} />,
            action: () => { navigate('/analytics'); setIsOpen(false); },
            keywords: ['analytics', 'reports', 'charts', 'stats']
        },
        {
            id: 'nav-communications',
            label: 'Go to Communications',
            icon: <Mail size={18} />,
            action: () => { navigate('/communications'); setIsOpen(false); },
            keywords: ['communications', 'messages', 'email']
        },
        {
            id: 'nav-settings',
            label: 'Go to Settings',
            icon: <Settings size={18} />,
            action: () => { navigate('/settings'); setIsOpen(false); },
            keywords: ['settings', 'preferences', 'config']
        },
        {
            id: 'action-add-lead',
            label: 'Add New Lead',
            icon: <Plus size={18} />,
            action: () => { navigate('/leads'); setIsOpen(false); },
            keywords: ['add', 'new', 'create', 'lead']
        },
        {
            id: 'theme-light',
            label: 'Switch to Light Theme',
            icon: <Sun size={18} />,
            action: () => { setTheme('light'); setIsOpen(false); },
            keywords: ['theme', 'light', 'appearance']
        },
        {
            id: 'theme-dark',
            label: 'Switch to Dark Theme',
            icon: <Moon size={18} />,
            action: () => { setTheme('dark'); setIsOpen(false); },
            keywords: ['theme', 'dark', 'appearance']
        },
        {
            id: 'theme-system',
            label: 'Use System Theme',
            icon: <Monitor size={18} />,
            action: () => { setTheme('system'); setIsOpen(false); },
            keywords: ['theme', 'system', 'auto', 'appearance']
        }
    ];

    // Fuzzy search filter
    const filteredCommands = commands.filter(cmd => {
        const searchLower = search.toLowerCase();
        const labelMatch = cmd.label.toLowerCase().includes(searchLower);
        const keywordMatch = cmd.keywords?.some(kw => kw.toLowerCase().includes(searchLower));
        return labelMatch || keywordMatch;
    });

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Ctrl+K or Cmd+K to open
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                setIsOpen(prev => !prev);
                setSearch('');
                setSelectedIndex(0);
            }

            // Escape to close
            if (e.key === 'Escape' && isOpen) {
                setIsOpen(false);
                setSearch('');
            }

            // Arrow navigation
            if (isOpen) {
                if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    setSelectedIndex(prev => Math.min(prev + 1, filteredCommands.length - 1));
                }
                if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    setSelectedIndex(prev => Math.max(prev - 1, 0));
                }
                if (e.key === 'Enter' && filteredCommands[selectedIndex]) {
                    e.preventDefault();
                    filteredCommands[selectedIndex].action();
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, filteredCommands, selectedIndex]);

    // Focus input when opened
    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    // Reset selected index when search changes
    useEffect(() => {
        setSelectedIndex(0);
    }, [search]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-start justify-center min-h-screen pt-20 px-4">
                {/* Backdrop */}
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
                    onClick={() => setIsOpen(false)}
                />

                {/* Command Palette */}
                <div className="relative bg-white rounded-lg shadow-2xl w-full max-w-2xl overflow-hidden">
                    {/* Search Input */}
                    <div className="flex items-center px-4 py-3 border-b border-gray-200">
                        <Search className="text-gray-400 mr-3" size={20} />
                        <input
                            ref={inputRef}
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Type a command or search..."
                            className="flex-1 outline-none text-gray-900 placeholder-gray-400"
                        />
                        <kbd className="hidden sm:inline-block px-2 py-1 text-xs font-semibold text-gray-500 bg-gray-100 border border-gray-200 rounded">
                            ESC
                        </kbd>
                    </div>

                    {/* Commands List */}
                    <div className="max-h-96 overflow-y-auto">
                        {filteredCommands.length === 0 ? (
                            <div className="px-4 py-8 text-center text-gray-500">
                                No commands found
                            </div>
                        ) : (
                            <div className="py-2">
                                {filteredCommands.map((cmd, index) => (
                                    <button
                                        key={cmd.id}
                                        onClick={cmd.action}
                                        className={`w-full flex items-center px-4 py-3 text-left transition-colors ${index === selectedIndex
                                                ? 'bg-blue-50 text-blue-700'
                                                : 'text-gray-700 hover:bg-gray-50'
                                            }`}
                                    >
                                        <div className={`mr-3 ${index === selectedIndex ? 'text-blue-600' : 'text-gray-400'}`}>
                                            {cmd.icon}
                                        </div>
                                        <span className="flex-1 font-medium">{cmd.label}</span>
                                        {index === selectedIndex && (
                                            <ArrowRight size={16} className="text-blue-600" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Footer Hint */}
                    <div className="px-4 py-2 border-t border-gray-200 bg-gray-50 text-xs text-gray-500 flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <span className="flex items-center">
                                <kbd className="px-1.5 py-0.5 bg-white border border-gray-200 rounded mr-1">↑↓</kbd>
                                Navigate
                            </span>
                            <span className="flex items-center">
                                <kbd className="px-1.5 py-0.5 bg-white border border-gray-200 rounded mr-1">↵</kbd>
                                Select
                            </span>
                        </div>
                        <span className="flex items-center">
                            <kbd className="px-1.5 py-0.5 bg-white border border-gray-200 rounded mr-1">
                                {navigator.platform.includes('Mac') ? '⌘' : 'Ctrl'}
                            </kbd>
                            <kbd className="px-1.5 py-0.5 bg-white border border-gray-200 rounded">K</kbd>
                            <span className="ml-1">to toggle</span>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};
