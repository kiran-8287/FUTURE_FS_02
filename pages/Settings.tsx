import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Button } from '../components/ui/Button';
import { User, Bell, Shield, Mail, Smartphone, Camera } from 'lucide-react';

export const Settings: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const { addToast } = useToast();
  
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'security'>('profile');
  const [isLoading, setIsLoading] = useState(false);

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
            className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
              activeTab === 'profile' 
                ? 'bg-blue-50 text-blue-700' 
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <User size={18} className="mr-3" />
            Profile
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
              activeTab === 'notifications' 
                ? 'bg-blue-50 text-blue-700' 
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Bell size={18} className="mr-3" />
            Notifications
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
              activeTab === 'security' 
                ? 'bg-blue-50 text-blue-700' 
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Shield size={18} className="mr-3" />
            Security
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
        </div>
      </div>
    </div>
  );
};