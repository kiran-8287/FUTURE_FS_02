import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { X, Save } from 'lucide-react';
import { useLeads } from '../../context/LeadContext';
import { LeadSource, LeadStatus } from '../../types';
import { Button } from '../ui/Button';

// Define Validation Schema
const leadSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  phone: z.string().min(10, { message: "Phone number must be at least 10 digits" }),
  company: z.string().min(1, { message: "Company name is required" }),
  title: z.string().optional(),
  source: z.nativeEnum(LeadSource),
  status: z.nativeEnum(LeadStatus),
  value: z.coerce.number().min(0, { message: "Value must be positive" }),
});

type LeadFormData = z.infer<typeof leadSchema>;

interface AddLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddLeadModal: React.FC<AddLeadModalProps> = ({ isOpen, onClose }) => {
  const { addLead } = useLeads();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<LeadFormData>({
    resolver: zodResolver(leadSchema) as any,
    defaultValues: {
      status: LeadStatus.New,
      source: LeadSource.Website,
      value: 0
    }
  });

  if (!isOpen) return null;

  const onSubmit = async (data: LeadFormData) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 600));

    addLead({
      ...data,
      title: data.title || ''
    });

    reset();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500/75 dark:bg-black/80 backdrop-blur-sm" onClick={onClose}></div>
        </div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full border border-gray-200 dark:border-gray-700">
          <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex justify-between items-start mb-5 border-b border-gray-100 dark:border-gray-700 pb-4">
              <div>
                <h3 className="text-xl leading-6 font-bold text-gray-900 dark:text-gray-100">
                  Add New Lead
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Enter the details of the potential client.
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <X size={20} />
              </button>
            </div>

            <form id="add-lead-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
                  <input
                    {...register('name')}
                    type="text"
                    className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 sm:text-sm"
                    placeholder="e.g. John Doe"
                  />
                  {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>}
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                  <input
                    {...register('email')}
                    type="email"
                    className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 sm:text-sm"
                    placeholder="john@example.com"
                  />
                  {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Phone</label>
                  <input
                    {...register('phone')}
                    type="tel"
                    className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 sm:text-sm"
                    placeholder="+1 (555) 000-0000"
                  />
                  {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone.message}</p>}
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Company</label>
                  <input
                    {...register('company')}
                    type="text"
                    className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 sm:text-sm"
                    placeholder="Acme Corp"
                  />
                  {errors.company && <p className="mt-1 text-xs text-red-600">{errors.company.message}</p>}
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Job Title</label>
                  <input
                    {...register('title')}
                    type="text"
                    className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 sm:text-sm"
                    placeholder="Marketing Manager"
                  />
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Lead Value (₹)</label>
                  <input
                    {...register('value')}
                    type="number"
                    className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 sm:text-sm"
                    placeholder="0.00"
                  />
                  {errors.value && <p className="mt-1 text-xs text-red-600">{errors.value.message}</p>}
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Source</label>
                  <select
                    {...register('source')}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                  >
                    {Object.values(LeadSource).map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Initial Status</label>
                  <select
                    {...register('status')}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                  >
                    {Object.values(LeadStatus).map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
            </form>
          </div>
          <div className="bg-white dark:bg-gray-900/50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse border-t border-gray-100 dark:border-gray-700">
            <Button
              type="submit"
              form="add-lead-form"
              isLoading={isSubmitting}
              className="w-full sm:w-auto sm:ml-3"
            >
              <Save size={16} className="mr-2" />
              Save Lead
            </Button>
            <Button
              variant="secondary"
              onClick={onClose}
              className="mt-3 w-full sm:mt-0 sm:w-auto dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700"
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};