import React from 'react';
import { TextCursor, Calendar, Hash, Mail } from 'lucide-react';

interface ToolbarProps {
  onAddField: (type: string) => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({ onAddField }) => {
  const tools = [
    { type: 'text', icon: TextCursor, label: 'Text' },
    { type: 'date', icon: Calendar, label: 'Date' },
    { type: 'number', icon: Hash, label: 'Number' },
    { type: 'email', icon: Mail, label: 'Email' },
  ];

  return (
    <div className="flex flex-col gap-2 bg-white p-4 rounded-lg shadow-lg">
      <h2 className="text-lg font-semibold mb-2">Form Fields</h2>
      {tools.map(({ type, icon: Icon, label }) => (
        <button
          key={type}
          onClick={() => onAddField(type)}
          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
        >
          <Icon size={18} />
          <span>{label}</span>
        </button>
      ))}
    </div>
  );
};