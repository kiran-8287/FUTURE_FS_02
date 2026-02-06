import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useTheme } from '../context/ThemeContext';
import { Button } from '../components/ui/Button';
import { User, Bell, Shield, Mail, Smartphone, Camera, Palette, FileText, Users, MoreVertical, UserPlus } from 'lucide-react';
import { InviteUserModal } from '../components/Settings/InviteUserModal';

export const Settings: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const { addToast } = useToast();
  const { theme, setTheme } = useTheme();

  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'security' | 'appearance' | 'audit-logs' | 'team'>('profile');
  const [isLoading, setIsLoading] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  // Profile Form State
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');

  // Notification State (Mock)
  const [notifications, setNotifications] = useState({
    emailNewLead: true,
    emailWeeklyDigest: false,
    pushStatusUpdates: true,
    pushMentions: true
  });

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      updateProfile({ name, email });
      setIsLoading(false);
      addToast('Profile updated successfully');
    }, 800);
  };

  const toggleNotification = (key: keyof typeof notifications) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
    // In a real app, this would autosave or require a save button
    addToast('Preference saved', 'info');
  };

  const handlePhotoClick = () => {
    addToast('Photo upload simulated. In a real app, this opens a file picker.', 'info');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500">Manage your account settings and preferences.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Settings Navigation */}
        <div className="w-full md:w-64 space-y-1">
          <button
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${activeTab === 'profile'
              ? 'bg-blue-50 text-blue-700'
              : 'text-gray-600 hover:bg-gray-50'
              }`}
          >
            <User size={18} className="mr-3" />
            Profile
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${activeTab === 'notifications'
              ? 'bg-blue-50 text-blue-700'
              : 'text-gray-600 hover:bg-gray-50'
              }`}
          >
            <Bell size={18} className="mr-3" />
            Notifications
          </button>
          <button
            onClick={() => setActiveTab('appearance')}
            className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${activeTab === 'appearance'
              ? 'bg-blue-50 text-blue-700'
              : 'text-gray-600 hover:bg-gray-50'
              }`}
          >
            <Palette size={18} className="mr-3" />
            Appearance
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${activeTab === 'security'
              ? 'bg-blue-50 text-blue-700'
              : 'text-gray-600 hover:bg-gray-50'
              }`}
          >
            <Shield size={18} className="mr-3" />
            Security
          </button>
          <button
            onClick={() => setActiveTab('audit-logs')}
            className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${activeTab === 'audit-logs'
              ? 'bg-blue-50 text-blue-700'
              : 'text-gray-600 hover:bg-gray-50'
              }`}
          >
            <FileText size={18} className="mr-3" />
            Audit Logs
          </button>
          <button
            onClick={() => setActiveTab('team')}
            className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${activeTab === 'team'
              ? 'bg-blue-50 text-blue-700'
              : 'text-gray-600 hover:bg-gray-50'
              }`}
          >
            <Users size={18} className="mr-3" />
            Team
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-white rounded-lg border border-gray-200 shadow-sm">

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-6">Profile Information</h2>

              <div className="flex items-center mb-8">
                <div className="relative group cursor-pointer" onClick={handlePhotoClick}>
                  <img
                    src={user?.avatar}
                    alt="Profile"
                    className="h-24 w-24 rounded-full border-4 border-gray-100 object-cover transition-opacity group-hover:opacity-75"
                  />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="text-gray-800" size={24} />
                  </div>
                  <button
                    type="button"
                    className="absolute bottom-0 right-0 bg-white border border-gray-200 p-1.5 rounded-full shadow-sm text-gray-600 hover:text-blue-600 z-10"
                  >
                    <Camera size={16} />
                  </button>
                </div>
                <div className="ml-5">
                  <h3 className="text-lg font-medium text-gray-900">{user?.name}</h3>
                  <p className="text-sm text-gray-500 capitalize mb-2">{user?.role}</p>
                  <Button variant="secondary" size="sm" onClick={handlePhotoClick}>
                    Change Photo
                  </Button>
                </div>
              </div>

              <form onSubmit={handleProfileSubmit} className="space-y-6 max-w-lg">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <div className="mt-1">
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <Button type="submit" isLoading={isLoading}>
                    Save Changes
                  </Button>
                </div>
              </form>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-6">Notification Preferences</h2>

              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-900 flex items-center mb-4">
                    <Mail size={16} className="mr-2 text-gray-400" />
                    Email Notifications
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="emailNewLead"
                          type="checkbox"
                          checked={notifications.emailNewLead}
                          onChange={() => toggleNotification('emailNewLead')}
                          className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="emailNewLead" className="font-medium text-gray-700">New Leads</label>
                        <p className="text-gray-500">Get notified when a new lead is assigned to you.</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="emailWeeklyDigest"
                          type="checkbox"
                          checked={notifications.emailWeeklyDigest}
                          onChange={() => toggleNotification('emailWeeklyDigest')}
                          className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="emailWeeklyDigest" className="font-medium text-gray-700">Weekly Digest</label>
                        <p className="text-gray-500">Receive a weekly summary of your performance.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-100">
                  <h3 className="text-sm font-medium text-gray-900 flex items-center mb-4">
                    <Smartphone size={16} className="mr-2 text-gray-400" />
                    Push Notifications
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="pushStatusUpdates"
                          type="checkbox"
                          checked={notifications.pushStatusUpdates}
                          onChange={() => toggleNotification('pushStatusUpdates')}
                          className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="pushStatusUpdates" className="font-medium text-gray-700">Status Updates</label>
                        <p className="text-gray-500">Get notified when a lead status changes.</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="pushMentions"
                          type="checkbox"
                          checked={notifications.pushMentions}
                          onChange={() => toggleNotification('pushMentions')}
                          className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="pushMentions" className="font-medium text-gray-700">Mentions</label>
                        <p className="text-gray-500">Get notified when someone mentions you in a note.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Appearance Tab */}
          {activeTab === 'appearance' && (
            <div className="p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-6">Appearance Settings</h2>

              <div className="space-y-4">
                <p className="text-sm text-gray-500">
                  Choose how Lumina CRM looks to you. Select a single theme, or sync with your system and automatically switch between day and night themes.
                </p>

                <div className="space-y-3 mt-6">
                  <div
                    onClick={() => {
                      setTheme('light');
                      addToast('Theme changed to Light', 'success');
                    }}
                    className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all ${theme === 'light'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                      }`}
                  >
                    <div className="flex items-center h-5">
                      <input
                        type="radio"
                        checked={theme === 'light'}
                        onChange={() => { }}
                        className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                      />
                    </div>
                    <div className="ml-3">
                      <label className="font-medium text-gray-900 cursor-pointer">Light</label>
                      <p className="text-sm text-gray-500">Clean and bright interface</p>
                    </div>
                  </div>

                  <div
                    onClick={() => {
                      setTheme('dark');
                      addToast('Theme changed to Dark', 'success');
                    }}
                    className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all ${theme === 'dark'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                      }`}
                  >
                    <div className="flex items-center h-5">
                      <input
                        type="radio"
                        checked={theme === 'dark'}
                        onChange={() => { }}
                        className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                      />
                    </div>
                    <div className="ml-3">
                      <label className="font-medium text-gray-900 cursor-pointer">Dark</label>
                      <p className="text-sm text-gray-500">Easy on the eyes in low light</p>
                    </div>
                  </div>

                  <div
                    onClick={() => {
                      setTheme('system');
                      addToast('Theme set to System', 'success');
                    }}
                    className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all ${theme === 'system'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                      }`}
                  >
                    <div className="flex items-center h-5">
                      <input
                        type="radio"
                        checked={theme === 'system'}
                        onChange={() => { }}
                        className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                      />
                    </div>
                    <div className="ml-3">
                      <label className="font-medium text-gray-900 cursor-pointer">System</label>
                      <p className="text-sm text-gray-500">Automatically switch based on your device settings</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Security Tab (Placeholder) */}
          {activeTab === 'security' && (
            <div className="p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-6">Security Settings</h2>

              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <Shield className="h-5 w-5 text-yellow-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700">
                      These settings are disabled in the demo environment.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-6 opacity-60 pointer-events-none">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Current Password</label>
                  <input type="password" value="********" readOnly className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-50" />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">New Password</label>
                  <input type="password" readOnly className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-50" />
                </div>
                <Button disabled>Update Password</Button>
              </div>
            </div>
          )}

          {/* Audit Logs Tab */}
          {activeTab === 'audit-logs' && (
            <div className="p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-6">Audit Logs</h2>
              <p className="text-sm text-gray-600 mb-6">
                Track all important actions and changes in your CRM system.
              </p>

              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Timestamp
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Action
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Details
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {[
                      {
                        timestamp: new Date(Date.now() - 5 * 60000).toLocaleString(),
                        user: user?.name || 'Admin',
                        action: 'Lead Created',
                        details: 'Created new lead: Acme Corporation',
                        icon: '➕',
                        color: 'text-green-600'
                      },
                      {
                        timestamp: new Date(Date.now() - 15 * 60000).toLocaleString(),
                        user: user?.name || 'Admin',
                        action: 'Status Updated',
                        details: 'Changed lead status from "New" to "Contacted"',
                        icon: '🔄',
                        color: 'text-blue-600'
                      },
                      {
                        timestamp: new Date(Date.now() - 30 * 60000).toLocaleString(),
                        user: user?.name || 'Admin',
                        action: 'Lead Deleted',
                        details: 'Deleted lead: Old Client Inc.',
                        icon: '🗑️',
                        color: 'text-red-600'
                      },
                      {
                        timestamp: new Date(Date.now() - 60 * 60000).toLocaleString(),
                        user: user?.name || 'Admin',
                        action: 'Bulk Import',
                        details: 'Imported 25 leads from CSV file',
                        icon: '📥',
                        color: 'text-purple-600'
                      },
                      {
                        timestamp: new Date(Date.now() - 2 * 60 * 60000).toLocaleString(),
                        user: user?.name || 'Admin',
                        action: 'Settings Changed',
                        details: 'Updated theme to Dark mode',
                        icon: '⚙️',
                        color: 'text-gray-600'
                      },
                      {
                        timestamp: new Date(Date.now() - 3 * 60 * 60000).toLocaleString(),
                        user: user?.name || 'Admin',
                        action: 'Lead Converted',
                        details: 'Converted lead: Tech Startup LLC to customer',
                        icon: '✅',
                        color: 'text-green-600'
                      },
                      {
                        timestamp: new Date(Date.now() - 4 * 60 * 60000).toLocaleString(),
                        user: user?.name || 'Admin',
                        action: 'Note Added',
                        details: 'Added note to lead: Follow up next week',
                        icon: '📝',
                        color: 'text-yellow-600'
                      },
                      {
                        timestamp: new Date(Date.now() - 24 * 60 * 60000).toLocaleString(),
                        user: user?.name || 'Admin',
                        action: 'User Login',
                        details: 'Successful login from 192.168.1.1',
                        icon: '🔐',
                        color: 'text-indigo-600'
                      }
                    ].map((log, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {log.timestamp}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {log.user}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center text-sm font-medium ${log.color}`}>
                            <span className="mr-2">{log.icon}</span>
                            {log.action}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {log.details}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 text-sm text-gray-500">
                Showing last 8 activities. Logs are retained for 90 days.
              </div>
            </div>
          )}

          {/* Team Tab */}
          {activeTab === 'team' && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-lg font-medium text-gray-900 dark:text-white">Team Management</h2>
                  <p className="text-sm text-gray-500">Manage your team members and their permissions.</p>
                </div>
                <Button onClick={() => setIsInviteModalOpen(true)}>
                  <UserPlus size={16} className="mr-2" />
                  Invite Member
                </Button>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-900/50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Member</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {[
                      { name: user?.name || 'Administrator', email: user?.email || 'admin@lumina.com', role: 'Admin', status: 'Active', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=faces' },
                      { name: 'Sarah Chen', email: 'sarah.c@lumina.com', role: 'Manager', status: 'Active', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=32&h=32&fit=crop&crop=faces' },
                      { name: 'Michael Ross', email: 'm.ross@lumina.com', role: 'User', status: 'Invited', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=32&h=32&fit=crop&crop=faces' },
                    ].map((member, i) => (
                      <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <img className="h-8 w-8 rounded-full border border-gray-200 dark:border-gray-600" src={member.avatar} alt={member.name} />
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900 dark:text-white">{member.name}</div>
                              <div className="text-xs text-gray-500">{member.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${member.role === 'Admin' ? 'bg-purple-100 text-purple-700' :
                            member.role === 'Manager' ? 'bg-blue-100 text-blue-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                            {member.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`flex items-center text-xs ${member.status === 'Active' ? 'text-green-600' : 'text-yellow-600'
                            }`}>
                            <span className={`h-1.5 w-1.5 rounded-full mr-2 ${member.status === 'Active' ? 'bg-green-600' : 'bg-yellow-600'
                              }`} />
                            {member.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                            <MoreVertical size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      <InviteUserModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
      />
    </div>
  );
};