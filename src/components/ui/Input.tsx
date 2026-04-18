import type { InputHTMLAttributes, ReactNode } from 'react';
import { cn } from '../../utils/cn';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: ReactNode;
  error?: string;
}

export function Input({ label, icon, error, className, ...rest }: Props) {
  return (
    <label className="block">
      {label && <span className="block text-sm font-medium text-gray-700 mb-1.5">{label}</span>}
      <div className="relative">
        {icon && <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">{icon}</span>}
        <input
          {...rest}
          className={cn(
            'w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 placeholder:text-gray-400',
            'focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all',
            icon ? 'pl-11' : '',
            error ? 'border-red-400' : '',
            className
          )}
        />
      </div>
      {error && <span className="text-xs text-red-500 mt-1 block">{error}</span>}
    </label>
  );
}
