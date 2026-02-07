import React, { useState } from 'react';
import { X, Send } from 'lucide-react';
import { useLeads } from '../../context/LeadContext';
import { useToast } from '../../context/ToastContext';
import { Button } from '../ui/Button';
import { RichTextEditor } from '../ui/RichTextEditor';

interface ComposeEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ComposeEmailModal: React.FC<ComposeEmailModalProps> = ({ isOpen, onClose }) => {
  const { leads, addNote } = useLeads();
  const { addToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    leadId: '',
    subject: '',
    message: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.leadId) {
      addToast('Please select a recipient', 'error');
      return;
    }

    setIsSubmitting(true);

    // Simulate API delay
    setTimeout(() => {
      // Log interaction as a note
      addNote(formData.leadId, `Email Sent: ${formData.subject}`);

      addToast('Email sent successfully');
      setIsSubmitting(false);
      onClose();

      // Reset form
      setFormData({
        leadId: '',
        subject: '',
        message: ''
      });
    }, 800);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={onClose}></div>
        </div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex justify-between items-start mb-5">
              <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                Compose Email
              </h3>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                <X size={24} />
              </button>
            </div>

            <form id="compose-email-form" onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Recipient</label>
                <select
                  name="leadId"
                  required
                  value={formData.leadId}
                  onChange={handleChange}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">Select a client...</option>
                  {leads.map(lead => (
                    <option key={lead.id} value={lead.id}>
                      {lead.name} ({lead.email})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Subject</label>
                <input
                  type="text"
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="e.g., Proposal Follow-up"
                  className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Message</label>
                <RichTextEditor
                  value={formData.message}
                  onChange={(html) => setFormData(prev => ({ ...prev, message: html }))}
                  className="mt-1"
                />
              </div>
            </form>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700/50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <Button
              type="submit"
              form="compose-email-form"
              isLoading={isSubmitting}
              className="w-full sm:w-auto sm:ml-3"
            >
              <Send size={16} className="mr-2" />
              Send Email
            </Button>
            <Button
              variant="secondary"
              onClick={onClose}
              className="mt-3 w-full sm:mt-0 sm:w-auto"
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};