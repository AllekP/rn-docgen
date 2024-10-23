import React, { useState } from 'react';
import { Search, X, Folder } from 'lucide-react';
import { FormsArray } from '../lib/FormsArray';

interface FormSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectForm: (fileName: string) => void;
}

export const FormSelector: React.FC<FormSelectorProps> = ({ isOpen, onClose, onSelectForm }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const { formsArrayData } = FormsArray('Ontario'); // Default to Ontario forms for now

  if (!isOpen) return null;

  const allForms = formsArrayData.flatMap(category => category.forms);
  
  const filteredForms = allForms.filter(form => 
    form.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    form.shortTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4">
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="text-xl font-semibold">Select a Form</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="p-4">
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Search forms..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
          </div>

          <div className="max-h-96 overflow-y-auto">
            {filteredForms.length === 0 ? (
              <p className="text-center text-gray-500 py-4">No forms found</p>
            ) : (
              <div className="space-y-2">
                {filteredForms.map((form) => (
                  <button
                    key={form.id}
                    onClick={() => {
                      onSelectForm(form.file_name);
                      onClose();
                    }}
                    className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      <Folder className="text-blue-500" size={20} />
                      <div>
                        <p className="font-medium">{form.shortTitle}</p>
                        <p className="text-sm text-gray-500">{form.title}</p>
                      </div>
                    </div>
                    <span className="text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity">
                      Select →
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};