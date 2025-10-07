import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, X, Check } from 'lucide-react';

interface DropdownOption {
  [key: string]: any;
}

interface DropdownProps<T = string | DropdownOption> {
  options: T[];
  value?: T | T[];
  onChange: (value: T | T[] | null) => void;
  placeholder?: string;
  displayKey?: string;
  multiple?: boolean;
  disabled?: boolean;
  error?: boolean;
  helperText?: string;
  label?: string;
  required?: boolean;
  className?: string;
  loading?: boolean;
  noOptionsText?: string;
  clearable?: boolean;
}

const Dropdown = <T extends string | DropdownOption>({
  options = [],
  value,
  onChange,
  placeholder = "Select option...",
  displayKey,
  multiple = false,
  disabled = false,
  error = false,
  helperText,
  label,
  required = false,
  className = "",
  loading = false,
  noOptionsText = "No options available",
  clearable = true
}: DropdownProps<T>) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Helper function to get display value
  const getDisplayValue = (option: T): string => {
    if (typeof option === 'string') return option;
    if (displayKey && typeof option === 'object' && option !== null) {
      return (option as DropdownOption)[displayKey] || '';
    }
    return String(option);
  };

  // Helper function to check if option is selected
  const isSelected = (option: T): boolean => {
    if (!value) return false;
    if (multiple && Array.isArray(value)) {
      return value.some(v => JSON.stringify(v) === JSON.stringify(option));
    }
    return JSON.stringify(value) === JSON.stringify(option);
  };

  // Filter options based on search term
  const filteredOptions = options.filter(option => 
    getDisplayValue(option).toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle option selection
  const handleOptionSelect = (option: T) => {
    if (multiple) {
      const currentValue = Array.isArray(value) ? value : [];
      const isCurrentlySelected = isSelected(option);
      
      if (isCurrentlySelected) {
        const newValue = currentValue.filter(v => JSON.stringify(v) !== JSON.stringify(option));
        onChange(newValue.length > 0 ? newValue : null);
      } else {
        onChange([...currentValue, option]);
      }
    } else {
      onChange(option);
      setIsOpen(false);
      setSearchTerm('');
    }
  };

  // Handle chip removal in multiple mode
  const handleChipRemove = (optionToRemove: T, e: React.MouseEvent) => {
    e.stopPropagation();
    if (Array.isArray(value)) {
      const newValue = value.filter(v => JSON.stringify(v) !== JSON.stringify(optionToRemove));
      onChange(newValue.length > 0 ? newValue : null);
    }
  };

  // Handle clear all
  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(null);
    setSearchTerm('');
  };

  // Get input display value
  const getInputDisplayValue = (): string => {
    if (multiple) return searchTerm;
    if (value && !Array.isArray(value)) return getDisplayValue(value);
    return searchTerm;
  };

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        if (!multiple && !value) {
          setSearchTerm('');
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [multiple, value]);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
    } else if (e.key === 'ArrowDown' && !isOpen) {
      setIsOpen(true);
    }
  };

  const hasValue = multiple ? Array.isArray(value) && value.length > 0 : value !== null && value !== undefined && value !== '';

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div
        className={`relative min-h-[56px] border rounded-lg transition-all duration-200 cursor-pointer ${
          error 
            ? 'border-red-500 focus-within:border-red-500 focus-within:ring-2 focus-within:ring-red-200' 
            : isOpen 
              ? 'border-blue-500 ring-2 ring-blue-200' 
              : 'border-gray-300 hover:border-gray-400 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200'
        } ${disabled ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'}`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <div className="flex items-center min-h-[54px] px-3 py-2">
          {/* Selected chips for multiple mode */}
          {multiple && Array.isArray(value) && value.length > 0 && (
            <div className="flex flex-wrap gap-1 mr-2">
              {value.map((selectedOption, index) => (
                <div
                  key={index}
                  className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-md"
                >
                  <span className="mr-1">{getDisplayValue(selectedOption)}</span>
                  <button
                    type="button"
                    onClick={(e) => handleChipRemove(selectedOption, e)}
                    className="text-blue-600 hover:text-blue-800 focus:outline-none"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Input field */}
          <input
            ref={inputRef}
            type="text"
            value={getInputDisplayValue()}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              if (!isOpen) setIsOpen(true);
            }}
            onKeyDown={handleKeyDown}
            placeholder={hasValue ? '' : placeholder}
            disabled={disabled}
            className="flex-1 outline-none bg-transparent text-gray-900 placeholder-gray-500 disabled:cursor-not-allowed"
          />

          {/* Clear button */}
          {clearable && hasValue && !disabled && (
            <button
              type="button"
              onClick={handleClear}
              className="text-gray-400 hover:text-gray-600 focus:outline-none mr-2"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          {/* Loading spinner or dropdown arrow */}
          {loading ? (
            <div className="animate-spin w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full" />
          ) : (
            <ChevronDown 
              className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                isOpen ? 'transform rotate-180' : ''
              }`} 
            />
          )}
        </div>

        {/* Dropdown menu */}
        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
            {filteredOptions.length === 0 ? (
              <div className="px-3 py-2 text-gray-500 text-sm">
                {loading ? 'Loading...' : noOptionsText}
              </div>
            ) : (
              filteredOptions.map((option, index) => {
                const isOptionSelected = isSelected(option);
                return (
                  <div
                    key={index}
                    className={`flex items-center px-3 py-2 cursor-pointer transition-colors duration-150 ${
                      isOptionSelected 
                        ? 'bg-blue-50 text-blue-900' 
                        : 'hover:bg-gray-50 text-gray-900'
                    }`}
                    onClick={() => handleOptionSelect(option)}
                  >
                    {multiple && (
                      <div className={`w-4 h-4 mr-3 border rounded flex items-center justify-center ${
                        isOptionSelected 
                          ? 'bg-blue-600 border-blue-600' 
                          : 'border-gray-300'
                      }`}>
                        {isOptionSelected && <Check className="w-3 h-3 text-white" />}
                      </div>
                    )}
                    <span className="flex-1">{getDisplayValue(option)}</span>
                    {!multiple && isOptionSelected && (
                      <Check className="w-4 h-4 text-blue-600" />
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>

      {/* Helper text */}
      {helperText && (
        <p className={`mt-1 text-sm ${error ? 'text-red-600' : 'text-gray-500'}`}>
          {helperText}
        </p>
      )}
    </div>
  );
};

export default Dropdown;