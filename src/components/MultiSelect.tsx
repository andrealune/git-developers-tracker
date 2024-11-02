import React, { useState, useRef, useEffect } from 'react';
import { Check, ChevronsUpDown, Search, X } from 'lucide-react';

interface Option {
  id: string;
  name: string;
}

interface MultiSelectProps {
  label: string;
  options: Option[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
}

export function MultiSelect({ label, options, selectedValues, onChange }: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredOptions = options.filter(option =>
    option.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleOption = (id: string) => {
    const newSelected = selectedValues.includes(id)
      ? selectedValues.filter(v => v !== id)
      : [...selectedValues, id];
    onChange(newSelected);
  };

  const toggleAll = () => {
    const newSelected = selectedValues.length === filteredOptions.length
      ? []
      : filteredOptions.map(option => option.id);
    onChange(newSelected);
  };

  const selectedCount = selectedValues.length;

  return (
    <div className="relative" ref={containerRef}>
      <label className="text-sm font-medium text-gray-700 mb-1 block">
        {label}
      </label>
      <div
        className="flex items-center justify-between px-3 py-2 border border-gray-300 rounded-md cursor-pointer hover:border-gray-400"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="truncate">
          {selectedCount === 0
            ? 'Select options...'
            : `${selectedCount} selected`}
        </span>
        <ChevronsUpDown className="h-4 w-4 text-gray-500" />
      </div>

      {isOpen && (
        <div className="absolute z-50 mt-1 w-full bg-white rounded-md shadow-lg border border-gray-200">
          <div className="p-2 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                className="w-full pl-8 pr-3 py-1 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onClick={(e) => e.stopPropagation()}
              />
              {searchTerm && (
                <button
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSearchTerm('');
                  }}
                >
                  <X className="h-4 w-4 text-gray-400" />
                </button>
              )}
            </div>
          </div>

          <div className="p-2 border-b border-gray-200">
            <button
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              onClick={(e) => {
                e.stopPropagation();
                toggleAll();
              }}
            >
              {selectedValues.length === filteredOptions.length
                ? 'Deselect all'
                : 'Select all'}
            </button>
          </div>

          <div className="max-h-60 overflow-auto">
            {filteredOptions.map((option) => (
              <div
                key={option.id}
                className="flex items-center px-3 py-2 hover:bg-gray-50 cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleOption(option.id);
                }}
              >
                <div className="flex items-center flex-1 min-w-0">
                  <div className={`
                    flex-shrink-0 h-4 w-4 border rounded
                    ${selectedValues.includes(option.id)
                      ? 'bg-blue-600 border-blue-600'
                      : 'border-gray-300'
                    }
                  `}>
                    {selectedValues.includes(option.id) && (
                      <Check className="h-3 w-3 text-white mx-auto" />
                    )}
                  </div>
                  <span className="ml-2 truncate">{option.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}