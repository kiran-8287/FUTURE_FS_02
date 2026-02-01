import React, { useEffect, useState } from 'react';
import { Command } from 'cmdk';
import { useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    BarChart3,
    Settings,
    Moon,
    Sun,
    Plus,
    MessageSquare,
    LogOut
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useLeads } from '../context/LeadContext';
import { Search } from 'lucide-react';

export const CommandPalette: React.FC = () => {
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();
    const { setTheme } = useTheme();
    const { logout } = useAuth();
    const { leads } = useLeads();

    // Toggle with Cmd+K / Ctrl+K
    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
        };
        document.addEventListener('keydown', down);
        return () => document.removeEventListener('keydown', down);
    }, []);

    const runCommand = (command: () => void) => {
        setOpen(false);
        command();
    };

    return (
        <Command.Dialog
            open={open}
            onOpenChange={setOpen}
            label="Global Command Menu"
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-start justify-center pt-[20vh] px-4"
        >
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center border-b border-gray-100 dark:border-gray-700 px-4">
                    <Search className="w-5 h-5 text-gray-400 mr-2" />
                    <Command.Input
                        placeholder="Type a command or search..."
                        className="w-full h-14 bg-transparent outline-none text-gray-900 dark:text-gray-100 placeholder:text-gray-400 text-lg"
                    />
                </div>

                <Command.List className="max-h-[60vh] overflow-y-auto p-2 scroll-py-2">
                    <Command.Empty className="py-6 text-center text-sm text-gray-500">
                        No results found.
                    </Command.Empty>

                    <Command.Group heading="Navigation" className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-2 mt-2">
                        <Command.Item
                            onSelect={() => runCommand(() => navigate('/'))}
                            className="flex items-center px-4 py-3 rounded-lg text-sm text-gray-700 dark:text-gray-200 cursor-pointer aria-selected:bg-blue-50 dark:aria-selected:bg-blue-900/30 aria-selected:text-blue-700 dark:aria-selected:text-blue-300 transition-colors"
                        >
                            <LayoutDashboard className="mr-3 h-5 w-5 opacity-70" />
                            Dashboard
                        </Command.Item>
                        <Command.Item
                            onSelect={() => runCommand(() => navigate('/leads'))}
                            className="flex items-center px-4 py-3 rounded-lg text-sm text-gray-700 dark:text-gray-200 cursor-pointer aria-selected:bg-blue-50 dark:aria-selected:bg-blue-900/30 aria-selected:text-blue-700 dark:aria-selected:text-blue-300 transition-colors"
                        >
                            <Users className="mr-3 h-5 w-5 opacity-70" />
                            Leads
                        </Command.Item>
                        <Command.Item
                            onSelect={() => runCommand(() => navigate('/communications'))}
                            className="flex items-center px-4 py-3 rounded-lg text-sm text-gray-700 dark:text-gray-200 cursor-pointer aria-selected:bg-blue-50 dark:aria-selected:bg-blue-900/30 aria-selected:text-blue-700 dark:aria-selected:text-blue-300 transition-colors"
                        >
                            <MessageSquare className="mr-3 h-5 w-5 opacity-70" />
                            Communications
                        </Command.Item>
                        <Command.Item
                            onSelect={() => runCommand(() => navigate('/analytics'))}
                            className="flex items-center px-4 py-3 rounded-lg text-sm text-gray-700 dark:text-gray-200 cursor-pointer aria-selected:bg-blue-50 dark:aria-selected:bg-blue-900/30 aria-selected:text-blue-700 dark:aria-selected:text-blue-300 transition-colors"
                        >
                            <BarChart3 className="mr-3 h-5 w-5 opacity-70" />
                            Analytics
                        </Command.Item>
                        <Command.Item
                            onSelect={() => runCommand(() => navigate('/settings'))}
                            className="flex items-center px-4 py-3 rounded-lg text-sm text-gray-700 dark:text-gray-200 cursor-pointer aria-selected:bg-blue-50 dark:aria-selected:bg-blue-900/30 aria-selected:text-blue-700 dark:aria-selected:text-blue-300 transition-colors"
                        >
                            <Settings className="mr-3 h-5 w-5 opacity-70" />
                            Settings
                        </Command.Item>
                    </Command.Group>

                    <Command.Group heading="Leads" className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-2 mt-4">
                        {leads.slice(0, 5).map(lead => (
                            <Command.Item
                                key={lead.id}
                                onSelect={() => runCommand(() => navigate(`/leads?q=${lead.name}`))}
                                className="flex items-center px-4 py-2 rounded-lg text-sm text-gray-700 dark:text-gray-200 cursor-pointer aria-selected:bg-blue-50 dark:aria-selected:bg-blue-900/30 aria-selected:text-blue-700 dark:aria-selected:text-blue-300 transition-colors"
                            >
                                <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center text-[10px] text-blue-600 font-bold mr-3 shrink-0">
                                    {lead.name.charAt(0)}
                                </div>
                                <span>{lead.name}</span>
                                <span className="ml-auto text-xs text-gray-400">{lead.company}</span>
                            </Command.Item>
                        ))}
                    </Command.Group>

                    <Command.Group heading="Actions" className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-2 mt-4">
                        <Command.Item
                            onSelect={() => runCommand(() => setTheme('light'))}
                            className="flex items-center px-4 py-3 rounded-lg text-sm text-gray-700 dark:text-gray-200 cursor-pointer aria-selected:bg-blue-50 dark:aria-selected:bg-blue-900/30 aria-selected:text-blue-700 dark:aria-selected:text-blue-300 transition-colors"
                        >
                            <Sun className="mr-3 h-5 w-5 opacity-70" />
                            Toggle Light Mode
                        </Command.Item>
                        <Command.Item
                            onSelect={() => runCommand(() => setTheme('dark'))}
                            className="flex items-center px-4 py-3 rounded-lg text-sm text-gray-700 dark:text-gray-200 cursor-pointer aria-selected:bg-blue-50 dark:aria-selected:bg-blue-900/30 aria-selected:text-blue-700 dark:aria-selected:text-blue-300 transition-colors"
                        >
                            <Moon className="mr-3 h-5 w-5 opacity-70" />
                            Toggle Dark Mode
                        </Command.Item>
                        <Command.Item
                            onSelect={() => runCommand(() => navigate('/leads?action=new'))}
                            className="flex items-center px-4 py-3 rounded-lg text-sm text-gray-700 dark:text-gray-200 cursor-pointer aria-selected:bg-blue-50 dark:aria-selected:bg-blue-900/30 aria-selected:text-blue-700 dark:aria-selected:text-blue-300 transition-colors"
                        >
                            <Plus className="mr-3 h-5 w-5 opacity-70" />
                            Create New Lead (Shortcut)
                        </Command.Item>
                        <Command.Item
                            onSelect={() => runCommand(() => { logout(); navigate('/login'); })}
                            className="flex items-center px-4 py-3 rounded-lg text-sm text-red-600 dark:text-red-400 cursor-pointer aria-selected:bg-red-50 dark:aria-selected:bg-red-900/20 aria-selected:text-red-700 dark:aria-selected:text-red-300 transition-colors"
                        >
                            <LogOut className="mr-3 h-5 w-5 opacity-70" />
                            Log Out
                        </Command.Item>
                    </Command.Group>
                </Command.List>

                <div className="border-t border-gray-100 dark:border-gray-700 px-4 py-2 text-xs text-gray-400 flex justify-between">
                    <span>Pro Tip: Use arrow keys to navigate</span>
                    <span>Esc to close</span>
                </div>
            </div>
        </Command.Dialog>
    );
};
