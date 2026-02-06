import React, { useState, useRef } from 'react';
import { Button } from '../ui/Button';
import { Upload, X, FileText, Check, AlertCircle } from 'lucide-react';
import { useLeads } from '../../context/LeadContext';
import { useToast } from '../../context/ToastContext';
import { LeadSource, LeadStatus } from '../../types';

interface ImportLeadsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const ImportLeadsModal: React.FC<ImportLeadsModalProps> = ({ isOpen, onClose }) => {
    const { addLead } = useLeads();
    const { addToast } = useToast();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [file, setFile] = useState<File | null>(null);
    const [previewData, setPreviewData] = useState<any[]>([]);
    const [headers, setHeaders] = useState<string[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (!isOpen) return null;

    const parseCSV = (text: string) => {
        const lines = text.split(/\r\n|\n/).filter(line => line.trim());
        if (lines.length < 2) return { headers: [], data: [] };

        const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
        const data = lines.slice(1, 6).map(line => { // Preview top 5
            const values = line.split(',').map(val => val.trim().replace(/^"|"$/g, ''));
            return headers.reduce((obj, header, index) => {
                obj[header] = values[index];
                return obj;
            }, {} as any);
        });

        return { headers, data };
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            if (selectedFile.type !== 'text/csv' && !selectedFile.name.endsWith('.csv')) {
                setError('Please upload a valid CSV file.');
                return;
            }
            setFile(selectedFile);
            setError(null);

            const reader = new FileReader();
            reader.onload = (event) => {
                const text = event.target?.result as string;
                const { headers, data } = parseCSV(text);
                setHeaders(headers);
                setPreviewData(data);
            };
            reader.readAsText(selectedFile);
        }
    };

    const handleImport = async () => {
        if (!file) return;

        setIsUploading(true);
        const reader = new FileReader();

        reader.onload = async (event) => {
            try {
                const text = event.target?.result as string;
                const lines = text.split(/\r\n|\n/).filter(line => line.trim());
                const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, '').toLowerCase());

                // Basic validation mapping
                const nameIdx = headers.findIndex(h => h.includes('name'));
                const emailIdx = headers.findIndex(h => h.includes('email'));

                if (nameIdx === -1 || emailIdx === -1) {
                    throw new Error('CSV must contain "Name" and "Email" columns.');
                }

                let successCount = 0;
                const total = lines.length - 1;

                // Process all lines (skipping header)
                for (let i = 1; i < lines.length; i++) {
                    const values = lines[i].split(',').map(val => val.trim().replace(/^"|"$/g, ''));

                    // Map to Lead object
                    const leadData = {
                        name: values[nameIdx] || 'Unknown',
                        email: values[emailIdx] || '',
                        phone: headers.includes('phone') ? values[headers.indexOf('phone')] : '',
                        company: headers.includes('company') ? values[headers.indexOf('company')] : '',
                        title: headers.includes('title') ? values[headers.indexOf('title')] : '',
                        source: LeadSource.Other, // Default
                        status: LeadStatus.New,   // Default
                        value: 0
                    };

                    // Simulate backend add
                    // In real app, we might send bulk array
                    await addLead(leadData as any);
                    successCount++;
                }

                addToast(`Successfully imported ${successCount} leads`, 'success');
                onClose();
                setFile(null);
                setPreviewData([]);
            } catch (err: any) {
                setError(err.message || 'Failed to import leads');
            } finally {
                setIsUploading(false);
            }
        };

        reader.readAsText(file);
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 transition-opacity" aria-hidden="true" onClick={onClose}>
                    <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                </div>

                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <div className="sm:flex sm:items-start">
                            <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                                <Upload className="h-6 w-6 text-blue-600" />
                            </div>
                            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                                <h3 className="text-lg leading-6 font-medium text-gray-900">Import Leads from CSV</h3>
                                <div className="mt-2 text-sm text-gray-500">
                                    <p>Upload a CSV file with columns: Name, Email, Phone, Company, Title.</p>
                                </div>

                                {/* Drop Zone / Input */}
                                {!file ? (
                                    <div
                                        className="mt-4 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md cursor-pointer hover:bg-gray-50"
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        <div className="space-y-1 text-center">
                                            <FileText className="mx-auto h-12 w-12 text-gray-400" />
                                            <div className="flex text-sm text-gray-600">
                                                <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                                                    <span>Upload a file</span>
                                                </label>
                                                <p className="pl-1">or drag and drop</p>
                                            </div>
                                            <p className="text-xs text-gray-500">CSV up to 10MB</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="mt-4 bg-gray-50 p-3 rounded-lg flex items-center justify-between">
                                        <div className="flex items-center">
                                            <FileText className="h-8 w-8 text-blue-500 mr-3" />
                                            <div className="text-left">
                                                <p className="text-sm font-medium text-gray-900">{file.name}</p>
                                                <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
                                            </div>
                                        </div>
                                        <button onClick={() => { setFile(null); setPreviewData([]); }} className="text-gray-400 hover:text-red-500">
                                            <X size={20} />
                                        </button>
                                    </div>
                                )}
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept=".csv"
                                    onChange={handleFileChange}
                                />

                                {error && (
                                    <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md text-sm flex items-center">
                                        <AlertCircle size={16} className="mr-2" />
                                        {error}
                                    </div>
                                )}

                                {/* Preview */}
                                {previewData.length > 0 && (
                                    <div className="mt-4">
                                        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Preview (First 5 Rows)</h4>
                                        <div className="overflow-x-auto border border-gray-200 rounded text-xs">
                                            <table className="min-w-full divide-y divide-gray-200">
                                                <thead className="bg-gray-50">
                                                    <tr>
                                                        {headers.map((h, i) => <th key={i} className="px-3 py-2 text-left text-gray-500 font-medium">{h}</th>)}
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white divide-y divide-gray-200">
                                                    {previewData.map((row, i) => (
                                                        <tr key={i}>
                                                            {headers.map((h, j) => <td key={j} className="px-3 py-2 whitespace-nowrap text-gray-700">{row[h]}</td>)}
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}

                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                        <Button
                            onClick={handleImport}
                            disabled={!file || isUploading}
                            className="w-full sm:w-auto sm:ml-3"
                        >
                            {isUploading ? 'Importing...' : 'Import Leads'}
                        </Button>
                        <Button
                            onClick={onClose}
                            variant="secondary"
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
