import React from "react";

interface FormFieldProps {
  label: string;
  type?: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  required?: boolean;
  min?: number;
  placeholder?: string;
  options?: { value: string; label: string }[]; // For select fields
}

export function FormField({
  label,
  type = "text",
  value,
  onChange,
  required = false,
  min,
  placeholder,
  options
}: FormFieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      {options ? (
        <select
          value={value}
          onChange={onChange}
          required={required}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm px-3 py-2 border"
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          value={value}
          onChange={onChange}
          required={required}
          min={min}
          placeholder={placeholder}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm px-3 py-2 border"
        />
      )}
    </div>
  );
}
