

import React from 'react';
import { FormData, SelectOption } from '../types';
import SparklesIcon from './icons/SparklesIcon';

interface DocumentFormProps {
  formData: FormData;
  onFormChange: (newFormData: Partial<FormData>) => void;
  onSubmit: () => void;
  isLoading: boolean;
  documentTypes: string[];
  usStates: SelectOption[];
  optionalClauses: { id: string; label: string; description: string }[];
  onGetSuggestions: () => void;
  isLoadingSuggestions: boolean;
  customDetailsPlaceholder: string;
}

const InputField: React.FC<{ id: string; label: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; type?: string; placeholder?: string }> = ({ id, label, value, onChange, type = "text", placeholder }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">{label}</label>
    <input
      type={type}
      id={id}
      name={id}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:placeholder-slate-400 transition duration-150"
    />
  </div>
);

const SelectField: React.FC<{ id: string; label: string; value: string; onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void; options: (string | SelectOption)[] }> = ({ id, label, value, onChange, options }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">{label}</label>
    <select
      id={id}
      name={id}
      value={value}
      onChange={onChange}
      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-150"
    >
      {options.map(opt => {
        const val = typeof opt === 'string' ? opt : opt.value;
        const lab = typeof opt === 'string' ? opt : opt.label;
        return <option key={val} value={val}>{lab}</option>;
      })}
    </select>
  </div>
);

const DocumentForm: React.FC<DocumentFormProps> = ({ formData, onFormChange, onSubmit, isLoading, documentTypes, usStates, optionalClauses, onGetSuggestions, isLoadingSuggestions, customDetailsPlaceholder }) => {
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    onFormChange({ [e.target.name]: e.target.value });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    onFormChange({
      optionalClauses: { ...formData.optionalClauses, [name]: checked },
    });
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }} className="space-y-6">
      <SelectField id="documentType" label="Document Type" value={formData.documentType} onChange={handleInputChange} options={documentTypes} />
      <SelectField id="state" label="State of Jurisdiction" value={formData.state} onChange={handleInputChange} options={usStates} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField id="partyA_name" label="Party A Name" value={formData.partyA_name} onChange={handleInputChange} placeholder="e.g., John Doe, ABC Corp."/>
        <InputField id="partyA_address" label="Party A Address" value={formData.partyA_address} onChange={handleInputChange} placeholder="123 Main St, Anytown, USA" />
        <InputField id="partyB_name" label="Party B Name" value={formData.partyB_name} onChange={handleInputChange} placeholder="e.g., Jane Smith, XYZ Inc."/>
        <InputField id="partyB_address" label="Party B Address" value={formData.partyB_address} onChange={handleInputChange} placeholder="456 Oak Ave, Otherville, USA"/>
      </div>

      <InputField id="effectiveDate" label="Effective Date" type="date" value={formData.effectiveDate} onChange={handleInputChange} />

      <div>
        <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-300">Optional Clauses</label>
            <button type="button" onClick={onGetSuggestions} disabled={isLoadingSuggestions} className="text-xs inline-flex items-center px-2 py-1 border border-transparent font-medium rounded-md shadow-sm text-white bg-slate-500 hover:bg-slate-600 disabled:bg-slate-300">
                <SparklesIcon className="w-4 h-4 mr-1.5" />
                {isLoadingSuggestions ? 'Thinking...' : 'AI Suggestions'}
            </button>
        </div>
        <div className="space-y-3">
          {optionalClauses.map(clause => (
            <div key={String(clause.id)} className="relative flex items-start">
              <div className="flex items-center h-5">
                <input
                  id={String(clause.id)}
                  name={String(clause.id)}
                  type="checkbox"
                  checked={formData.optionalClauses[clause.id] || false}
                  onChange={handleCheckboxChange}
                  className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-slate-300 dark:border-slate-600 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor={String(clause.id)} className="font-medium text-slate-700 dark:text-slate-200">{clause.label}</label>
                <p className="text-slate-500 dark:text-slate-400">{clause.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
          <label htmlFor="customDetails" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Other Custom Details</label>
          <textarea
              id="customDetails"
              name="customDetails"
              rows={3}
              value={formData.customDetails}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:placeholder-slate-400 transition duration-150"
              placeholder={customDetailsPlaceholder}
          />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? 'Generating...' : 'Generate Document'}
      </button>
    </form>
  );
};

export default DocumentForm;